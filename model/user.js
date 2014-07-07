/**
 * Author: chenboxiang
 * Date: 14-1-29
 * Time: 下午8:37
 */
'use strict';

var db = require('koa-db');

module.exports = db.defineModel('user', {
    email: {
        validation: ['notEmpty', 'email']
    },

    emailChecked: {}
});