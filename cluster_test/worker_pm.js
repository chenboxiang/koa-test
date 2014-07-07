/**
 * Author: chenboxiang
 * Date: 14-5-2
 * Time: 下午8:03
 */
'use strict';

var http = require('http');
var koa = require('koa');
var config = require('./config/' + (process.env.NODE_ENV || 'development'));
var logger = require('tracer').console(config.log);
var middlewares = require('koa-middlewares');
var pm = require('pm');

var app = new koa();

//session
var redisStore = new middlewares.redisStore(config.session.redisStore);
redisStore.on('connect', function() {
    logger.info('Redis store is connected!');
})
redisStore.on('disconnect', function() {
    logger.error('Redis store is disconnected!');
})
app.use(middlewares.session({
    store: redisStore,
    cookie: config.session.cookie
}))

app.use(function* hello() {
    this.body = 'hello world';
})

var server = http.createServer(function() {
    logger.info('handled by child, pid is ' + process.pid);
    app.callback().apply(this, arguments);
});

var worker = pm.createWorker({
    'terminate_timeout': 15000
});

worker.ready(function(socket, port) {
    server.emit('connection', socket);
})