/**
 * Author: chenboxiang
 * Date: 14-5-4
 * Time: 下午12:43
 */
'use strict';

var config = require('./config/' + (process.env.NODE_ENV || 'development'));
var pm = require('pm');
var logger = require('tracer').console(config.log);

var master = pm.createMaster();

master.on('giveup', function(name, fatals, pause) {
    logger.info('[master:%s] giveup to restart "%s" process after %d times. pm will try after %d ms.',
        process.pid, name, fatals, pause);
});

master.on('disconnect', function(name, pid) {
    logger.error('[master:%s] worker:%s disconnect!',
        process.pid, pid);
});

master.on('fork', function(name, pid) {
    logger.info('[master:%s] new %s:worker:%s fork',
        process.pid, name, pid);
});

master.on('quit', function(name, pid, code, signal) {
    logger.info('[master:%s] %s:worker:%s quit, code: %s, signal: %s',
        process.pid, name, pid, code, signal);
});

master.register('web', __dirname + '/worker.js', {
    listen: config.port
});

master.dispatch();

if (module.parent) module.exports = master;