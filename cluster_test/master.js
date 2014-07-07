/**
 * Author: chenboxiang
 * Date: 14-5-2
 * Time: 上午11:56
 */
'use strict';

var cp = require('child_process');
require('cluster');
var cpus = require('os').cpus();

var server = require('net').createServer();
server.listen(3000);

var workers = {};

function createWorker() {
    var worker = cp.fork(__dirname + '/worker.js');
    worker.on('exit', function() {
        console.log('Worker ' + worker.pid + ' exited.');
        delete workers[worker.pid];
    })

    worker.send('server', server);
    workers[worker.pid] = worker;
    console.log('Create worker, pid: ' + worker.pid);
}

for (var i = 0; i < cpus.length; i++) {
    createWorker();
}

process.on('exit', function() {
    Object.keys(workers).forEach(function(pid) {
        workers[pid].kill();
    })
})