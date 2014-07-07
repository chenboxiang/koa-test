/**
 * Author: chenboxiang
 * Date: 14-5-3
 * Time: 下午12:08
 */
'use strict';

var pm = require('pm');

var master = pm.createMaster();

master.on('giveup', function (name, fatals, pause) {
    console.log('[%s] [master:%s] giveup to restart "%s" process after %d times. pm will try after %d ms.',
        new Date(), process.pid, name, fatals, pause);
});

master.on('disconnect', function (name, pid) {
    // console.log('%s %s disconnect', name, pid)
    var w = master.fork(name);
    console.error('[%s] [master:%s] worker:%s disconnect! new worker:%s fork',
        new Date(), process.pid, pid, w.process.pid);
});

master.on('fork', function (name, pid) {
    console.log('[%s] [master:%s] new %s:worker:%s fork',
        new Date(), process.pid, name, pid);
});

master.on('quit', function (name, pid, code, signal) {
    console.log('[%s] [master:%s] %s:worker:%s quit, code: %s, signal: %s',
        new Date(), process.pid, name, pid, code, signal);
});

master.register('web', __dirname + '/worker_pm.js', {
    listen: 3000
});

master.dispatch();