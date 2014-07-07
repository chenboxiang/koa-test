/**
 * gm test
 * Author: chenboxiang
 * Date: 14-6-3
 * Time: 下午5:28
 */
'use strict';

var oriGm = require('gm');
var co = require('co');
var thinkify = require('thunkify-wrap');
var path = require('path');

var gmGetters = [
    'identify',
    'size',
    'format',
    'depth',
    'color',
    'res',
    'filesize',
    'orientation'
];

function gm(source, height, color) {
    var gmInstance = new oriGm(source, height, color);

    // gm getters
    thinkify(gmInstance, gmInstance, gmGetters);

    // gm write
    thinkify(gmInstance, gmInstance, ['write']);

    return gmInstance;
}

var image = gm(path.join(__dirname, 'test.jpg'));
co(function* () {
    var getterResults = {};
    for (var i = 0, len = gmGetters.length; i < len; i++) {
        var getter = gmGetters[i];
        console.log(getter + "----------start");
        var value = yield image[getter]();
//        console.log(value);
        console.log(image.data);
        console.log(getter + "----------end");
        getterResults[getter] = value;
    }
//    console.log(getterResults);

})()

co(function* () {
   yield image.resize(50, 50).noProfile().write(path.join(__dirname, 'test_50x50.jpg'));
})()

//image.identify(function(err, value) {
//    console.log(value);
//    image.res(function(err, value) {
//        console.log(err);
//        console.log(value);
//    })
//})

//co(function* () {
//    var value = yield image.identify();
//    console.log(typeof value);
//})()
//image.identify()(function(err, value) {
//    console.log(value);
//})

//oriGm('test.jpg').identify(function(err, value) {
//    console.log(value);
//})