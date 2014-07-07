#!/usr/bin/env node

var program = require('commander');

program
    .version('1.0.0')
    .usage('<start|stop|restart>')

program.parse(process.argv);