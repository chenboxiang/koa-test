/**
 * Author: chenboxiang
 * Date: 14-5-4
 * Time: 下午12:46
 */
'use strict';

var graceful = require('graceful');
var pm = require('pm');
var http = require('http');
var config = require('./config/' + (process.env.NODE_ENV || 'development'));
var logger = require('tracer').console(config.log);

var worker = pm.createWorker({
    'terminate_timeout': 5000
});
var killTimeout = 10000;
var app = require('./app');

app.on('ready', function() {
    var server = http.createServer(app.callback());
    // hack for pm, because server._handle is empty.
    server.close = function () {};

    graceful({
        server: server,
        worker: worker,
        error: function (err) {
            logger.error('[worker:%s] error: %s', process.pid, err.stack);
        },
        killTimeout: killTimeout
    });

    worker.ready(function (socket, port) {
        server.emit('connection', socket);
    });
})

app.on('startError', function(err) {
    logger.error('[worker:%s] error on start: %s', process.pid, err.stack);
    worker.disconnect();
    // make sure we close down within `killTimeout` seconds
    var killTimer = setTimeout(function () {
        logger.info('[worker:%s] kill timeout, exit now.', process.pid);
        process.exit(1);
    }, killTimeout);

    // But don't keep the process open just for that!
    // If there is no more io waiting, just let process exit normally.
    if (typeof killTimer.unref === 'function') {
        // only worked on node 0.10+
        killTimer.unref();
    }
})