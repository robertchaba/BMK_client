/*global module, global*/
module.exports = function (grunt) {

    grunt.initConfig({
        /**
         * Clean
         *
         * Before generating any new files, remove any previously-created output files.
         */
        clean : {
            build : [
                'build/output',
                'build/public'
            ]
        },
        /**
         * JSHint
         *
         * Validate the source code files to ensure they follow our coding convention and
         * don't contain any common errors.
         */
        jshint : {
            all : [
                'Gruntfile.js',
                'application.js',
                'app/**/*.js',
                '!app/model/**/*.js'
            ],
            options : {
                jshintrc : '.jshintrc'
            }
        },
        /**
         * Sencha Dependencies
         *
         * Calculate the list of files the app depends on and sort them in the order
         * in which they need to be concatenated
         */
        sencha_dependencies : {
            build : {
                options : {
                    appFile : 'application.js',
                    pageRoot : './',
                    pageToProcess : 'index.html'
                }
            }
        },
        /**
         * Uglify.js
         *
         * Concatenates & minifies the source code files. In addition we create a source map
         * so that in Chrome & FF we can debug with the source files in production.
         * Write the output file to our 'build/public' directory
         */
        uglify : {
            build : {
                options : {
                    sourceMap : 'build/public/source-map.map',
                    sourceMappingURL : './source-map.map',
                    sourceMapRoot : '..'
                },
                files : {
                    'build/public/app.min.js' : [
                        '<%= sencha_dependencies_build %>'
                    ]
                }
            }
        },
        /**
         * Copy
         *
         * Any additional files our project still needs to run with in to the 'build/public' directory
         * This includes CSS, images, mock data and our index.html
         * Note that we also do some replacement on the index.html to point it to our new
         * concat'd/minified JS file.
         */
        copy : {
            build : {
                files : [
                    {
                        expand : true,
                        src : [
                            'libs/ext/resources/ext-theme-neptune/ext-theme-neptune-all.css'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
                    {
                        expand : true,
                        src : [
                            'libs/ext/resources/ext-theme-neptune/images/**'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
                    {
                        expand : true,
                        src : [
                            'libs/ext/resources/themes/default/images/**'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
                    {
                        expand : true,
                        src : [
                            'libs/font-awesome/css/font-awesome.min.css'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
                    {
                        expand : true,
                        src : [
                            'libs/font-awesome/font/**'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
                    {
                        expand : true,
                        src : [
                            'libs/ext/ext-theme-neptune.js'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
                    {
                        expand : true,
                        src : [
                            'libs/ext/locale/ext-lang-en.js'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
                    {
                        expand : true,
                        src : [
                            'resources/css/layout.css'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
                    {
                        expand : true,
                        src : [
                            'app/kernel/Patch.js'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
//                    {
//                        expand : true,
//                        src : [
//                            'data/**'
//                        ],
//                        dest : 'build/public',
//                        cwd : '.'
//                    },
//                    {
//                        expand : true,
//                        src : [
//                            'model/**'
//                        ],
//                        dest : 'build/public',
//                        cwd : '.'
//                    },
                    {
                        expand : true,
                        src : [
                            'application.js'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    },
                    {
                        expand : true,
                        src : [
                            'index.html'
                        ],
                        dest : 'build/public',
                        cwd : '.'
                    }
                ],
                options : {
                    processContentExclude : [
                        '**/*.{gif,jpg,png}'
                    ],
                    processContent : function (content, filePath) {
                        if (/index.html/.test(filePath)) {
                            // remove the ext script
                            content = content.replace(/<script.*ext-dev.js"><\/script>/, '');
                            content = content.replace(/<script.*ext-theme-neptune.js"><\/script>/, '');
                            content = content.replace(/font-awesome\.css/, 'font-awesome.min.css');
                            return content.replace(/application.js/, 'app.min.js');
                        }
                        return content;
                    }
                }
            }
        },
        /**
         * Sencha Jasmine
         *
         * Setups Jasmine and runs them using PhantomJS headlessly.
         */
        sencha_jasmine : {
            options : {
                keepRunner : true,
                helpers : [
                    'tests/libs/jasmine/mock-ajax.js'
                ],
//                template : '_ExtJasmine.tmpl',
                specs : [
                    'tests/specs/**/*.js'
                ],
                extFramework : 'libs/ext',
                extLoaderPaths : {
                    'BM' : 'app'
                }
            },
            // app configuration is for when we want to test without code coverage
            app : {},
            // coverage configuration is for when you want code coverage on your files
            coverage : {
                options : {
                    extLoaderPaths : {
                        'Ext.ux' : 'build/output/coverage/app/ux',
                        'BM' : 'build/output/coverage/app',
                        'Model' : 'build/output/coverage/app/model',
                        'User' : 'build/output/coverage/app/module/user',
                        'Admin' : 'build/output/coverage/app/module/admin',
                        'File' : 'build/output/coverage/app/module/file'
                    }
                }
            }
        },
        /**
         * Istanbul Code Coverage Instrumentation
         *
         * This task instruments the JavaScript source files with Istanbul's code coverage tool
         */
        instrument : {
            files : [
                'app/**/*.js'
            ],
            options : {
                basePath : 'build/output/coverage'
            }
        },
        /**
         * Update Ext.Application#appFolder
         */
        replace : {
            app : {
                src : [
                    'build/output/coverage/app/app.js'
                ],
                overwrite : true,
                replacements : [
                    {
                        from : 'appFolder:\'app\'',
                        to : 'appFolder:\'build/output/coverage/app\''
                    },
//                    {
//                        from : 'paths:{\'Model\':\'app/model\'}',
//                        to : 'paths:{\'Model\':\'build/output/coverage/app/model\'}'
//                    }
                    {
                        from : 'paths:{\'Model\' : \'app/model\',\'User\' : \'app/module/user\',\'Admin\' : \'app/module/admin\'}',
                        to : 'paths:{\'Model\':\'build/output/coverage/app/model\',\'User\':\'build/output/coverage/app/module/user\',\'Admin\':\'build/output/coverage/app/module/admin\'}'
                    }
                ]
            }
        },
        /**
         * Istanbul Store Code Coverage Results
         *
         * After a test has been run against the instrumented source code, this task will store
         * the code coverage results on disk
         */
        storeCoverage : {
            options : {
                dir : 'build/output/coverage'
            }
        },
        /**
         * Istanbul Code Coverage Report Generation
         *
         * Using the stored coverage data we can generate an lcov HTML style set of reports which
         * show the code coverage output of running our tests against our instrumented code.
         */
        makeReport : {
            src : 'build/output/coverage/*.json',
            options : {
                type : 'lcov',
                dir : 'build/reports'
            }
        },
        /**
         * Plato Code Complexity Report Generation
         *
         * This target uses Plato to generate code complexity reports about the code base. These can
         * be useful to know where the most complex pieces of our code are and can help decide if refactoring
         * is worth doing on one or more classes.
         */
        plato : {
            all : {
                files : {
                    'build/reports/plato' : 'app/**/*.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sencha-dependencies');
    grunt.loadNpmTasks('grunt-sencha-jasmine');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('default', [
        'jshint',
        'clean:build',
        'test_with_coverage',
        'plato:all',
        'sencha_dependencies:build',
        'uglify:build',
        'copy:build'
    ]);

    grunt.registerTask('test', [
        'sencha_jasmine:app'
    ]);
    grunt.registerTask('test_with_coverage', [
        'instrument',
        'replace',
        'sencha_jasmine:coverage',
        'storeCoverage',
        'makeReport'
    ]);

    // needed to make grunt-istanbul storeReport
    grunt.event.on('jasmine.coverage', function (coverage) {
        global.__coverage__ = coverage;
    });

};
