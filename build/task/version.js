/**
 * 1. 生成带版本号的资源
 * 2. 修改需要引用这些资源的文件中引用的资源链接
 *
 * Author: chenboxiang
 * Date: 14-5-25
 * Time: 下午5:42
 */
'use strict';

module.exports = function(grunt) {

    var path = require('path');
    var glob = require('glob');
    var crypto = require('crypto');
    var util = require('util');
    var fs = require('fs');

    /**
     * 将str中的正则元字符转义
     * @param str
     * @returns {*|XML|string|void}
     */
    function quoteRegExp(str) {
        return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    };

    /**
     * 参数
     * resources: 资源文件，也就是需要被计算签名的文件对象
     * 对象结构
     *  {
     *      // 就是glob的cwd option
     *      // 这个对匹配出来的路径会有影响，此处匹配出来的路径会作为替换refs文件内容的字符串
     *      cwd:
     *      // glob pattern
     *      pattern:
     *  }
     * refs: 引用资源文件的文件
     */
    grunt.registerMultiTask('version', function() {
        var resources = this.data.resources;
        if (!resources) {
            grunt.fail.fatal('the property "resources" is empty');
            return;
        }
        if (!Array.isArray(resources)) {
            resources = [resources];
        }
        var refs = this.data.refs;
        if (!refs) {
            grunt.fail.fatal('the property "refs" is empty');
            return;
        }
        if (!Array.isArray(refs)) {
            refs = [refs];
        }

        // --------- parse files
        var resFiles = [];
        resources.forEach(function(o) {
            var files = glob.sync(o.pattern, {
                cwd: o.cwd
            })
            resFiles.push({
                files: files,
                cwd: o.cwd
            })
        });
        grunt.verbose.ok('resources: ' + JSON.stringify(resFiles, null, 4));

        var refFiles = [];
        refs.forEach(function(o) {
            var files = glob.sync(o.pattern, {
                cwd: o.cwd
            })
            refFiles.push({
                files: files,
                cwd: o.cwd
            })
        });
        grunt.verbose.ok('refs: ' + JSON.stringify(resFiles, null, 4));

        // ---------- generate digest resources
        var resMap = {};
        resFiles.forEach(function(o) {
            var files = o.files;
            var cwd = o.cwd;
            if (files) {
                files.forEach(function(file) {
                    // 二进制数据
                    var data = fs.readFileSync(path.join(cwd, file));
                    // count digest
                    var digest = crypto.createHash('sha1').update(data).digest('hex');
                    var extname = path.extname(file);
                    var targetFile = util.format('%s/%s.%s%s',
                        path.dirname(file), path.basename(file, extname), digest, extname);
                    resMap[file] = targetFile;
                    fs.writeFileSync(path.join(cwd, targetFile), data);
                })
            }
        })
        grunt.log.ok('resources generate completed. resource map: ' + JSON.stringify(resMap, null, 4));

        // ---------- replace ref files reference
        refFiles.forEach(function(o) {
            var files = o.files;
            var cwd = o.cwd;
            if (files) {
                files.forEach(function(file) {
                    var absolutePath = path.join(cwd, file);
                    // 文本数据
                    var data = grunt.file.read(absolutePath);
                    Object.keys(resMap).forEach(function(origin) {
                        var target = resMap[origin];
                        data = data.replace(new RegExp(quoteRegExp(origin), 'g'), target);
                    })
                    // 回写
                    grunt.file.write(absolutePath, data);
                })
            }
        })
        grunt.log.ok('refs replace completed.');
    })
}