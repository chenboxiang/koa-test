/**
 * Author: chenboxiang
 * Date: 14-3-26
 * Time: 下午3:24
 */
define(function(require, exports, module) {
    "use strict";

    var hw = require("./hw");
    module.exports = function() {
        hw();
        console.log("hello world 1");
    }
})