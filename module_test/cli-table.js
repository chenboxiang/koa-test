/**
 * Author: chenboxiang
 * Date: 14-5-6
 * Time: 下午4:16
 */
'use strict';

var Table = require('cli-table');

// instantiate
var table = new Table({
    head: ['TH 1 label', 'TH 2 label']
});

// table is an Array, so you can `push`, `unshift`, `splice` and friends
table.push(
    ['First value', 'Second value'],
    ['First value', 'Second value']
);

console.log(table.toString());