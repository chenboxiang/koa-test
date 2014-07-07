/**
 * Author: chenboxiang
 * Date: 14-5-25
 * Time: 下午2:55
 */
'use strict';

module.exports = function(grunt) {
    var path = require('path');
    var fs = require('fs');
    var Loader = require('loader');
    var cwd = process.cwd();
    
    grunt.registerTask('assetsMap', 'generate assets.json', function() {
        // 视图目录
        var viewsDir = path.join(cwd, './view');
        // 资源目录
        var baseDir = path.join(cwd, './static/dist');

        // scan views folder, get the assets map
        var scanned = Loader.scanDir(viewsDir);
        grunt.log.ok('Scaned.');

        // combo？md5 hash
        var minified = Loader.minify(baseDir, scanned);
        grunt.log.ok(JSON.stringify(minified, null, 4));
        grunt.log.ok('Compile static assets done.');

        // write the assets mapping into assets.json
        var assets = path.join(baseDir, 'assets.json');
        grunt.log.ok('assets.json is here: ' + assets);
        fs.writeFileSync(assets, JSON.stringify(Loader.map(minified)));
        grunt.log.ok('write assets.json done. assets.json: ');
        grunt.log.ok(fs.readFileSync(assets, 'utf-8'));
    })
}