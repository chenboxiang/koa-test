'use strict';

var config = require('./build/config/' + (process.env.NODE_ENV || 'development'));
var path = require('path');

module.exports = function(grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            options: {
                strictMath: true,
                modifyVars: config.lessModifyVars
            },

            production: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'static/less/',      // Src matches are relative to this path.
                        src: ['**/*.less', '!base/*', 'base/index.less'], // Actual pattern(s) to match.
                        dest: 'static/dist/css/',   // Destination path prefix.
                        ext: '.css'    // Dest filepaths will have this extension.
                    }
                ]
            },

            development: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'static/less/',      // Src matches are relative to this path.
                        src: ['**/*.less', '!base/*', 'base/index.less'], // Actual pattern(s) to match.
                        dest: 'static/css/',   // Destination path prefix.
                        ext: '.css'    // Dest filepaths will have this extension.
                    }
                ]
            }
        },

        watch: {
            less: {
                files: ['static/less/**/*.less'],
                tasks: ['less:development']
            }
        },

        clean: {
            js: ['.tmp*'],
            build: ['static/dist']
        },

        // seajs transport
        transport: {
            js: {
                options: {
                    paths: ['static/js/'],
                    idleading: '/js/'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'static/js/',
                        src: ['**/*.js', '!seajs_config.js'],
                        filter: function(path) {
                            return path.indexOf('sea-modules') < 0;
                        },
                        dest: '.tmp1'
                    }
                ]
            }
        },

        // seajs concat
        concat: {
            cmd: {
                options: {
                    include: 'relative'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.tmp1',
                        src: ['**/*.js'],
                        filter: function(filepath) {
                            return !/-debug\.js$/.test(filepath);
                        },
                        dest: '.tmp2'
                    }
                ]
            }
        },

        uglify: {
            js: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp2',
                        src: '**/*.js',
                        dest: 'static/dist/js'
                    }
                ]
            }
        },

        // 生成seajs config文件
        seajsConfig: {
            config: {
                options: {
                    src: 'static/js/seajs_config.js',
                    dest: 'static/dist/js/seajs_config.js'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'static/dist/js/',
                        src: ['**/*.js', '!seajs_config.js'],
                        filter: function(path) {
                            return path.indexOf('sea-modules') < 0;
                        }
                    }
                ]
            }
        },

        copy: {
            main: {
                expand: true,
                cwd: 'static/',
                src: ['font/**', 'image/**', 'swf/**'],
                dest: 'static/dist/'
            }
        },

        version: {
            main: {
                // 需要生成带hash号的资源
                resources: {
                    cwd: path.join(__dirname, 'static/dist/'),
                    pattern: 'image/**/*.*'
                },
                // 需要替换资源为带版本号资源的文件
                refs: {
                    cwd: path.join(__dirname, 'static/dist/'),
                    pattern: 'css/**/*.css'
                }
            }
        },

        // upload to qiniu cdn
        qiniu: {
            deploy: {
                options: {
                    accessKey: config.qiniu.accessKey,
                    secretKey: config.qiniu.secretKey,
                    bucket: config.qiniu.bucket,
                    domain: config.qiniu.domain,
                    resources: [
                        {
                            cwd: 'static/dist',
                            pattern: '**/*.*'
                        }
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-seajs-config');
    grunt.loadNpmTasks('grunt-qiniu-deploy');

    grunt.loadTasks('build/task');

    // 默认任务
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('buildJs', ['clean:js', 'transport', 'concat', 'uglify', 'seajsConfig', 'clean:js']);
    grunt.registerTask('buildCss', ['less']);
    grunt.registerTask('build', ['clean:build', 'buildJs', 'buildCss', 'copy', 'assetsMap', 'version', 'qiniu']);
}