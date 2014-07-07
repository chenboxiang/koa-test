/**
 * Author: chenboxiang
 * Date: 14-4-20
 * Time: 下午12:18
 */
'use strict';

var _ = require('lodash');
var _s = require('underscore.string');
var fs = require('co-fs');
var path = require('path');
var ejs = require('ejs-remix');

var defaultConfig = {
    cache: false,
    compileOptions: {
        compileDebug: false,
        debug: false,
        escape: function(html) {
            if (!html) {
                return "";
            }
            return String(html)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }
    },
    // 去多余空白符
    strip: true,
    ext: '.ejs',
    // default global property
    locals: {}
}

// template cache
var cache = {}

/**
 * response the html to browser
 * @param {Object} ctx  koa context
 * @param {String} html
 */
function response(ctx, html) {
    ctx.type = 'html';
    ctx.length = html.length;
    ctx.body = html;
}

module.exports = function(app, config) {
    config = _.extend({}, defaultConfig, config);

    if (!config.root) {
        throw new Error('config.root is required');
    }

    if (config.strip) {
        var parse = ejs.parse;
        ejs.parse = function(str, options) {
            str = str.replace(/(<\/?[^<>]+>)\s+/g, '$1');

            return parse.apply(this, [str, options]);
        }
    }

    if (config.ext.charAt(0) !== '.') {
        config.ext = "." + config.ext;
    }

    app.context.render = function *(view, options) {
        options = _.extend({}, config.locals, options);
        if (!_s.endsWith(view, config.ext)) {
            view += config.ext;
        }
        var template = cache[view];
        if (!template) {
            var absolutePath = path.join(config.root, view);
            var fileData = yield fs.readFile(absolutePath, {encoding: 'utf8'});
            template = ejs.compile(fileData, _.extend({filename: absolutePath}, config.compileOptions));
            if (config.cache) {
                cache[view] = template;
            }
        }
        var html = template.call(options.scope, options);
        response(this, html);
    }
}