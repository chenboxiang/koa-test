/**
 * Author: chenboxiang
 * Date: 14-4-22
 * Time: 上午10:16
 */
'use strict';

//var co = require('co');
//
//co(function *() {
//    yield function *() {
//        req + 'hi'; // ReferenceError: req is not defined
//        return req;
//    }
//})(function(err) {
//    console.log(err); // if I remove throw err, it will log [ReferenceError: req is not defined]
//    console.log('hi');
//    throw err;
//});

//co(function *() {
//    req + 'hi';
//})(function(err) {
//    throw err; // properly throws
//});

var co = require('co');
var fs = require('fs');

function size(file) {
    return function(fn){
        fs.stat(file, function(err, stat){
            if (err) return fn(err);
            fn(null, stat.size);
        });
    }
}

co(function *(){
    var a = size('app.js');
    var b = size('co_test.js');
    var c = size('generator_test.js');
    var res = yield [a, b, c];
    console.log(res);
    // => [ 13, 1687, 129 ]
    return res;
})(function() {
    console.log(arguments);
})