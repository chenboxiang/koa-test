/**
 * Author: chenboxiang
 * Date: 14-1-26
 * Time: 下午2:38
 */
'use strict';

var User = require('../model/user');
var db = require('koa-db');
var parse = require('co-busboy');
var fs = require('fs');
var dao = db.dao;
var logger = G.logger;
var path = require('path');
var saveTo = require('save-to');

module.exports = function(app) {
    app.get('/', function *(next) {
        logger.info('index page');
        this.session.name = 'koa-redis';
        var user = new User({
            email: 'gozap.chenbo@gmail.com',
            emailChecked: true
        });
        yield dao.trans(function *(t) {
            yield dao.select(User, {email: 'gozap.chenboxiang1@gmail.com'}, t).forUpdate();
            yield dao.insert(user, t);
            yield dao.update(user, t);
            yield dao.del(user, t);
        })
//        var user = yield dao.select(User, 1);
        yield* this.render('index')
    })

    app.get('/todo', function *() {
        yield* this.render('index', {
            user: {id: 1}
        })
    })

    app.post('/file/upload', function *(next) {
        // the body isn't multipart, so busboy can't parse it
        if (!this.request.is('multipart/*')) return yield* next;

        var parts = parse(this, {
            autoFields: true
        });
        var part;
        while (part = yield parts) {
            yield saveTo(part, path.join(process.cwd(), 'test.jpg'));
        }
//        console.log(parts.field);
//        console.log(parts.fields);
        this.body = {code: 200};
    })
}