/**
 * Author: chenboxiang
 * Date: 14-5-4
 * Time: 下午1:42
 */
'use strict';

var _s = require('underscore.string');
var utils = require('./lib/utils');
var path = require('path');
var logger = G.logger;

module.exports = function(app) {
    // filters

    // controllers
    var paths = utils.getFilePathsSync(path.join(__dirname, 'controller'), function(p, stats) {
        return _s.endsWith(p, '.js') && stats.isFile();
    });
    logger.info('controllers:\n', paths.join('\n '));
    paths.forEach(function(path) {
        require(path)(app);
    });
}