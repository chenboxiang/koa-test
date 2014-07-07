'use strict';

module.exports = {
    // session
    session: {
        secret: 'koa test',
        redisStore: {
            host: 'localhost',
            port: '6379',
            db: 0,
            // session过期时间: 4hour
            ttl: 14400,
            prefix: 'sess:'
        },
        cookie: {
            signed: false
        }
    },
    keys: ['koa', 'test'],
    log: {
        format: [
            // 产品环境需去掉file和line以提高性能
            '{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}', //default format
            {
                error: '{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}} \nCall Stack:\n{{stack}}' // error format
            }
        ],
        dateformat: 'yyyy-mm-dd HH:MM:ss.l "GMT"o',
        level: 'debug'
    },

    db: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            port: '3306',
            user: 'root',
            password: '',
            database: 'zhanguoce',
            // When dealing with big numbers (BIGINT and DECIMAL columns) in the database, you should enable this option
            supportBigNumbers: true,
            // Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns)
            // to be always returned as JavaScript String objects (Default: false).
            // Enabling supportBigNumbers but leaving bigNumberStrings disabled will return big numbers as String objects
            // only when they cannot be accurately represented with JavaScript Number objects (which happens when they exceed the [-2^53, +2^53] range),
            // otherwise they will be returned as Number objects. This option is ignored if supportBigNumbers is disabled
            bigNumberStrings: true,
            debug: false
        },
        pool: {
            min: 2,
            max: 50,
            // boolean that specifies whether idle resources at or below the min threshold
            // should be destroyed/re-created.  optional (default=true)
            refreshIdle: true,
            // max milliseconds a resource can go unused before it should be destroyed
            // (default 30000)
            idleTimeoutMillis: 60 * 60 * 1000,
            // frequency to check for idle resources (default 1000)
            reapIntervalMillis: 60 * 1000,
            // true/false or function -
            // If a log is a function, it will be called with two parameters:
            //   - log string
            //   - log level ('verbose', 'info', 'warn', 'error')
            // Else if log is true, verbose log info will be sent to console.log()
            // Else internal log messages be ignored (this is the default)
            log: false
        },
        debug: true
    },

    port: 3000,

    // 静态资源缓存
    'static': {
        maxage: 0
    },

    staticDir: 'static',

    assets: {
        combo: false,
        url: ''
    }
};