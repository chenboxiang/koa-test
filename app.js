/**
 * Author: chenboxiang
 * Date: 14-4-18
 * Time: 下午5:23
 */
'use strict';

var path = require('path');
var http = require('http');
var koa = require('koa');
var middlewares = require('koa-middlewares');
var _ = require('lodash');
var async = require('async');
var Loader = require('loader');
var config = require('./config/' + (process.env.NODE_ENV || 'development'));
var logger = require('tracer').console(config.log);
var fs = require('fs');
var crypto = require('crypto')

// 全局对象
global.G = {};
G.logger = logger;

// -- 初始化数据库 -----------------------
var mysqlIsInit = false;
// TODO 需在测试环境确认mysql未启动的情况是否会报错
var initMysqlConnectionPool = function(callback) {
    var db = require('koa-db');
    config.db.pool.afterCreate = function(connection, cb) {
        if (!mysqlIsInit) {
            logger.info('Mysql connection pool init success!');
            mysqlIsInit = true;
            callback();
        }
        cb(null, connection);
    }
    db.buildDao(_.extend({name: "def"}, config.db));
}

// -- new app instance ----------------
var app = new koa();
require('koa-trace')(app)
app.debug()
app.keys = config.keys;

// -- 加载中间件 ------------------------
var useMiddlewares = function(callback) {
    app.use(function* (next) {
        try {
            yield next;
        } catch (err) {
            logger.error(err);
            this.status = err.status || 500;
            this.body = err.message || require('http').STATUS_CODES[this.status];
            this.app.emit('error', err, this);
        }
    });
    // response time trace
    app.use(middlewares.rt());

    // static file
    var serve = require('koa-static');
    app.use(serve(path.join(__dirname, config.staticDir), config.static));

    // logger
    app.use(middlewares.logger());

    app.use(function* (next) {
        // give each request some sort of ID
        this.id = crypto.randomBytes(12)

        // log events with optional arguments
        this.trace('start')
        yield* next
        this.trace('finish')
    })
    app.use(function* (next) {
        this.trace('something', 1, 2, 3)
        yield* next
    })

    // session
    var redisStore = new middlewares.redisStore(config.session.redisStore);
    redisStore.on('connect', function() {
        logger.info('Redis store is connected!');
        callback(null);
    })
    redisStore.on('disconnect', function() {
        logger.error('Redis store is disconnected!');
        callback(new Error('Redis store is disconnected!'));
    })
    app.use(middlewares.session({
        store: redisStore,
        cookie: config.session.cookie
    }))

    // body parser
    app.use(middlewares.bodyParser());

    // router
    app.use(middlewares.router(app));
    require('koa-router-namespace')(app);


    // view engine
    var assetsMap = {};
    if (config.assets.combo) {
        try {
            assetsMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'static/dist/assets.json')));
        } catch (e) {
            logger.error('You must execute `make build` before start app when mini_assets is true.');
            throw e;
        }
    }
    var middlewareEjs = require('./middleware/ejs');
    middlewareEjs(app, {
        root: path.join(__dirname, 'view'),
        cache: app.env !== 'development',
        ext: '.html',
        locals: {
            config: config,
            Loader: Loader,
            assetsMap: assetsMap
        }
    });
    //app.use(middlewares.conditional());
    //app.use(middlewares.etag());
    //app.use(middlewares.compress());
    //middlewares.csrf(app);
}

app.on('error', function (err, ctx) {
    err.url = err.url || ctx.request.url;
    logger.error(err);
});

// -- 启动服务器 -------------------------
async.parallel(
    [initMysqlConnectionPool, useMiddlewares],
    function(err) {
        if (!err) {
            // -- 加载路由配置信息 -------------------------
            require('./routes')(app);
            app.emit('ready');

        } else {
            app.emit('startError', err);
        }
    }
);

if (module.parent) module.exports = app;

