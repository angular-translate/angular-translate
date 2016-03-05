// jshint camelcase: false, quotmark: false

var fs = require('fs');

module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  // Returns configuration for bower-install plugin
  var loadTestScopeConfigurations = function () {
    var scopes = fs.readdirSync('./test_scopes').filter(function (filename) {
      return filename[0] !== '.';
    });
    var config = {
      options: {
        color: false,
        interactive: false
      }
    };
    // Create a sub config for each test scope
    for (var idx in scopes) {
      var scope = scopes[idx];
      config['test_scopes_' + scope] = {
        options: {
          cwd: 'test_scopes/' + scope,
          production: false
        }
      };
    }
    return config;
  };

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    language: grunt.option('lang') || 'en',

    meta: {
      banner: '/*!\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> The <%= pkg.title || pkg.name %> team, <%= pkg.author.name %>;' +
        ' Licensed <%= pkg.license %>\n */\n'
    },

    build_dir: 'dist',

    lib_files: {

      core: [
        'src/translate.js',
        'src/service/sanitization.js',
        'src/service/translate.js',
        'src/service/default-interpolation.js',
        'src/service/storage-key.js',
        'src/directive/translate.js',
        'src/directive/translate-cloak.js',
        'src/directive/translate-namespace.js',
        'src/directive/translate-language.js',
        'src/filter/translate.js',
        'src/service/translationCache.js'
      ],

      ext: {
        messageformat_interpolation: ['src/service/messageformat-interpolation.js'],
        handler_log: ['src/service/handler-log.js'],
        loader_partial: ['src/service/loader-partial.js'],
        loader_static_files: ['src/service/loader-static-files.js'],
        loader_url: ['src/service/loader-url.js'],
        storage_cookie: ['src/service/storage-cookie.js'],
        storage_local: ['src/service/storage-local.js'],
        all: [
          'src/service/messageformat-interpolation.js',
          'src/service/handler-log.js',
          'src/service/loader-partial.js',
          'src/service/loader-static-files.js',
          'src/service/loader-url.js',
          'src/service/storage-cookie.js',
          'src/service/storage-local.js'
        ]
      },

      test: ['test/**/*.js']
    },

    watch: {

      scripts: {
        files: ['Gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.ext.all %>', '<%= lib_files.test %>'],
        tasks: ['jshint:all', 'karma:unit']
      },

      livereload: {
        options: {
          livereload: true
        },
        // TODO actually complete demo except copied "angular-translate-latest.js"
        files: ['src/**/*.js', 'demo/async-loader/*'],
        tasks: ['jshint', 'karma:unit', 'concat', 'copy:demo']
      }
    },

    jshint: {

      options: {
        jshintrc: true
      },

      all: ['Gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.ext.all %>', '<%= lib_files.test %>'],

      core: {
        files: {
          src: ['<%= lib_files.core %>']
        }
      },

      extensions: {
        files: {
          src: ['<%= lib_files.ext.all %>']
        }
      },

      messageformat_interpolation: {
        files: {
          src: ['<%= lib_files.ext.messageformat_interpolation %>']
        }
      },

      handler_log: {
        files: {
          src: ['<%= lib_files.ext.handler_log %>']
        }
      },

      loader_partial: {
        files: {
          src: ['<%= lib_files.ext.loader_partial %>']
        }
      },

      loader_static_files: {
        files: {
          src: ['<%= lib_files.ext.loader_static_files %>']
        }
      },

      loader_url: {
        files: {
          src: ['<%= lib_files.ext.loader_url %>']
        }
      },

      storage_cookie: {
        files: {
          src: ['<%= lib_files.ext.storage_cookie %>']
        }
      },

      storage_local: {
        files: {
          src: ['<%= lib_files.ext.storage_local %>']
        }
      },

      test: {
        files: {
          src: ['<%= lib_files.test %>']
        }
      }
    },

    concat: {

      banner_core: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.core.dest %>',
        dest: '<%= concat.core.dest %>'
      },

      core: {
        src: ['<%= lib_files.core %>'],
        dest: '<%= build_dir %>/angular-translate.js'
      },

      banner_messageformat_interpolation: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.messageformat_interpolation.dest %>',
        dest: '<%= concat.messageformat_interpolation.dest %>'
      },

      messageformat_interpolation: {
        src: ['<%= lib_files.ext.messageformat_interpolation %>'],
        dest: '<%= build_dir%>/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.js'
      },

      banner_handler_log: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.handler_log.dest %>',
        dest: '<%= concat.handler_log.dest %>'
      },

      handler_log: {
        src: ['<%= lib_files.ext.handler_log %>'],
        dest: '<%= build_dir %>/angular-translate-handler-log/angular-translate-handler-log.js'
      },

      banner_loader_partial: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.loader_partial.dest %>',
        dest: '<%= concat.loader_partial.dest %>'
      },

      loader_partial: {
        src: ['<%= lib_files.ext.loader_partial %>'],
        dest: '<%= build_dir %>/angular-translate-loader-partial/angular-translate-loader-partial.js'
      },

      banner_loader_static_files: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.loader_static_files.dest %>',
        dest: '<%= concat.loader_static_files.dest %>'
      },

      loader_static_files: {
        src: ['<%= lib_files.ext.loader_static_files %>'],
        dest: '<%= build_dir %>/angular-translate-loader-static-files/angular-translate-loader-static-files.js'
      },

      banner_loader_url: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.loader_url.dest %>',
        dest: '<%= concat.loader_url.dest %>'
      },

      loader_url: {
        src: ['<%= lib_files.ext.loader_url%>'],
        dest: '<%= build_dir %>/angular-translate-loader-url/angular-translate-loader-url.js'
      },

      banner_storage_cookie: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.storage_cookie.dest %>',
        dest: '<%= concat.storage_cookie.dest %>'
      },

      storage_cookie: {
        src: ['<%= lib_files.ext.storage_cookie %>'],
        dest: '<%= build_dir %>/angular-translate-storage-cookie/angular-translate-storage-cookie.js'
      },

      banner_storage_local: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.storage_local.dest %>',
        dest: '<%= concat.storage_local.dest %>'
      },

      storage_local: {
        src: ['<%= lib_files.ext.storage_local%>'],
        dest: '<%= build_dir %>/angular-translate-storage-local/angular-translate-storage-local.js'
      }

    },

    uglify: {

      options: {
        preserveComments: 'some'
      },

      core: {
        files: {
          '<%= build_dir %>/angular-translate.min.js': '<%= concat.core.dest %>'
        }
      },

      messageformat_interpolation: {
        files: {
          '<%= build_dir %>/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.min.js': '<%= concat.messageformat_interpolation.dest %>'
        }
      },

      handler_log: {
        files: {
          '<%= build_dir %>/angular-translate-handler-log/angular-translate-handler-log.min.js': '<%= concat.handler_log.dest %>'
        }
      },

      loader_partial: {
        files: {
          '<%= build_dir %>/angular-translate-loader-partial/angular-translate-loader-partial.min.js': '<%= concat.loader_partial.dest %>'
        }
      },

      loader_static_files: {
        files: {
          '<%= build_dir %>/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js': '<%= concat.loader_static_files.dest %>'
        }
      },

      loader_url: {
        files: {
          '<%= build_dir %>/angular-translate-loader-url/angular-translate-loader-url.min.js': '<%= concat.loader_url.dest %>'
        }
      },

      storage_cookie: {
        files: {
          '<%= build_dir %>/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js': '<%= concat.storage_cookie.dest %>'
        }
      },

      storage_local: {
        files: {
          '<%= build_dir %>/angular-translate-storage-local/angular-translate-storage-local.min.js': '<%= concat.storage_local.dest %>'
        }
      }
    },

    copy: {

      demo: {
        files: [
          {
            src: 'angular-translate.js',
            dest: 'demo/js/',
            cwd: 'dist/',
            expand: true
          }
        ]
      },

      logos: {
        files: [
          {
            src: ['logo/**'],
            dest: '<%= ngdocs.options.dest %>/img/',
            cwd: 'identity/',
            expand: true
          }
        ]
      },
      docs_index: {
        files: [
          {
            src: ['index.html'],
            dest: '<%= ngdocs.options.dest %>/',
            cwd: 'docs/html/',
            expand: true
          }
        ]
      },
      docs_assets: {
        files: [
          {
            src: ['img/**'],
            dest: '<%= ngdocs.options.dest %>/',
            cwd: 'docs/',
            expand: true
          },
          {
            src: ['data/**'],
            dest: '<%= ngdocs.options.dest %>/',
            cwd: 'docs/',
            expand: true
          }
        ]
      }
    },

    karma: {

      // Runs standard tests in default browser
      'unit': {
        options: {
          configFile: 'karma.unit.conf.js',
          singleRun: true
        }
      },
      'midway': {
        options: {
          configFile: 'karma.midway.conf.js',
          singleRun: true
        }
      },

      // Runs standard tests in headless PhantomJS
      'headless-unit': {
        options: {
          configFile: 'karma.unit.conf.js',
          singleRun: true,
          browsers: ['PhantomJS']
        }
      },
      'headless-midway': {
        options: {
          configFile: 'karma.midway.conf.js',
          singleRun: true,
          browsers: ['PhantomJS']
        }
      },

      // Runs standard tests in Firefox
      'browser-firefox-unit': {
        options: {
          configFile: 'karma.unit.conf.js',
          singleRun: true,
          browsers: ['Firefox']
        }
      },
      'browser-firefox-midway': {
        options: {
          configFile: 'karma.midway.conf.js',
          singleRun: true,
          browsers: ['Firefox']
        }
      },

      // Opens the default browser on the default port for advanced debugging.
      'debug-unit': {
        configFile: 'karma.unit.conf.js',
        singleRun: false,
        browsers: []
      },
      'debug-midway': {
        configFile: 'karma.midway.conf.js',
        singleRun: false,
        browsers: []
      }
    },

    conventionalChangelog : {
      options : {
        changelogOpts : {
          preset : 'angular'
        }
      },
      release : {
        src : 'CHANGELOG.md'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      'core': {
        src: '<%= concat.core.dest %>',
        dest: '<%= concat.core.dest %>'
      },
      'messageformat_interpolation': {
        src: '<%= concat.messageformat_interpolation.dest %>',
        dest: '<%= concat.messageformat_interpolation.dest %>'
      },
      'handler_log': {
        src: '<%= concat.handler_log.dest %>',
        dest: '<%= concat.handler_log.dest %>'
      },
      'loader_partial': {
        src: '<%= concat.loader_partial.dest %>',
        dest: '<%= concat.loader_partial.dest %>'
      },
      'loader_static_files': {
        src: '<%= concat.loader_static_files.dest %>',
        dest: '<%= concat.loader_static_files.dest %>'
      },
      'loader_url': {
        src: '<%= concat.loader_url.dest %>',
        dest: '<%= concat.loader_url.dest %>'
      },
      'storage_cookie': {
        src: '<%= concat.storage_cookie.dest %>',
        dest: '<%= concat.storage_cookie.dest %>'
      },
      'storage_local': {
        src: '<%= concat.storage_local.dest %>',
        dest: '<%= concat.storage_local.dest %>'
      }
    },

    express: {
      server: {
        options: {
          port: 3005,
          bases: '.',
          server: __dirname + '/server.js'
        }
      }
    },

    ngdocs: {
      options: {
        dest: 'tmp',
        navTemplate: 'docs/html/nav.html',
        html5Mode: false,
        title: false,
        image: 'identity/logo/angular-translate-alternative/angular-translate_alternative_small2.png',
        imageLink: 'https://angular-translate.github.io',
        startPage: '/guide',
        scripts: [
          'https://cdn.rawgit.com/SlexAxton/messageformat.js/0.2.2/messageformat.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-animate.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-cookies.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-sanitize.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular-translate/2.8.1/angular-translate.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular-translate-interpolation-messageformat/2.8.1/angular-translate-interpolation-messageformat.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular-translate-storage-cookie/2.8.1/angular-translate-storage-cookie.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular-translate-storage-local/2.8.1/angular-translate-storage-local.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular-translate-loader-url/2.8.1/angular-translate-loader-url.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular-translate-loader-static-files/2.8.1/angular-translate-loader-static-files.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular-translate-handler-log/2.8.1/angular-translate-handler-log.js'
        ],
        styles: ['docs/css/styles.css']
      },
      api: {
        src: [
          'src/translate.js',
          'src/**/*.js',
          'docs/content/api/*.ngdoc'
        ],
        title: 'API Reference'
      },
      guide: {
        src: ['docs/content/guide/<%= language %>/*.ngdoc'],
        title: 'Guide'
      }
    },

    umd: {
      'core': {
        src: '<%= concat.core.dest %>',
        dest: '<%= concat.core.dest %>'
      },
      'messageformat_interpolation': {
        options: {
          deps: {
            'default': ['MessageFormat'],
            amd: ['messageformat'],
            cjs: ['messageformat'],
            global: ['MessageFormat']
          }
        },
        src: '<%= concat.messageformat_interpolation.dest %>',
        dest: '<%= concat.messageformat_interpolation.dest %>'
      },
      'handler_log': {
        src: '<%= concat.handler_log.dest %>',
        dest: '<%= concat.handler_log.dest %>'
      },
      'loader_partial': {
        src: '<%= concat.loader_partial.dest %>',
        dest: '<%= concat.loader_partial.dest %>'
      },
      'loader_static_files': {
        src: '<%= concat.loader_static_files.dest %>',
        dest: '<%= concat.loader_static_files.dest %>'
      },
      'loader_url': {
        src: '<%= concat.loader_url.dest %>',
        dest: '<%= concat.loader_url.dest %>'
      },
      'storage_cookie': {
        src: '<%= concat.storage_cookie.dest %>',
        dest: '<%= concat.storage_cookie.dest %>'
      },
      'storage_local': {
        src: '<%= concat.storage_local.dest %>',
        dest: '<%= concat.storage_local.dest %>'
      }
    },

    file_append: {
      'core': {
        files: [ {
            append: "return 'pascalprecht.translate';",
            input: '<%= concat.core.dest %>'
        } ]
      },
      'messageformat_interpolation': {
        files: [ {
            append: "return 'pascalprecht.translate';",
            input: '<%= concat.messageformat_interpolation.dest %>'
        } ]
      },
      'handler_log': {
        files: [ {
            append: "return 'pascalprecht.translate';",
            input: '<%= concat.handler_log.dest %>'
        } ]
      },
      'loader_partial': {
        files: [ {
            append: "return 'pascalprecht.translate';",
            input: '<%= concat.loader_partial.dest %>'
        } ]
      },
      'loader_static_files': {
        files: [ {
            append: "return 'pascalprecht.translate';",
            input: '<%= concat.loader_static_files.dest %>'
        } ]
      },
      'loader_url': {
        files: [ {
            append: "return 'pascalprecht.translate';",
            input: '<%= concat.loader_url.dest %>'
        } ]
      },
      'storage_cookie': {
        files: [ {
            append: "return 'pascalprecht.translate';",
            input: '<%= concat.storage_cookie.dest %>'
        } ]
      },
      'storage_local': {
        files: [ {
            append: "return 'pascalprecht.translate';",
            input: '<%= concat.storage_local.dest %>'
        } ]
      }
    },

    version: {
      options: {
        prefix: 'var version\\s+=\\s+[\'"]'
      },
      defaults: {
        src: ['<%= concat.core.dest %>']
      }
    },

    'bower-install-simple': loadTestScopeConfigurations()

  });


  grunt.registerTask('default', ['jshint:all', 'karma']);
  grunt.registerTask('test', ['jshint:all', 'karma:unit', 'karma:midway']);
  grunt.registerTask('install-test', ['bower-install-simple']);

  // Advanced test tasks
  grunt.registerTask('test-headless', ['karma:headless-unit', 'karma:headless-midway']);
  grunt.registerTask('test-browser-firefox', ['karma:browser-firefox-unit', 'karma:browser-firefox-midway']);
  grunt.registerTask('test-all', ['test', 'test-headless', 'test-browser-firefox']);

  grunt.registerTask('prepare-release', [
    'jshint:all',
    'test-headless',
    'build-all'
  ]);

  grunt.registerTask('compile', [
    'build-all'
  ]);

  grunt.registerTask('build', [
    'jshint:all',
    'karma:headless-unit',
    'karma:headless-midway',
    'karma:unit',
    'karma:midway',
    'compile'
  ]);

  grunt.registerTask('build-all', [
    'build:core',
    'build:messageformat_interpolation',
    'build:handler_log',
    'build:loader_partial',
    'build:loader_static_files',
    'build:loader_url',
    'build:storage_cookie',
    'build:storage_local'
  ]);

  grunt.registerTask('build:core', [
    'jshint:core',
    'concat:core',
    'version',
    'file_append:core',
    'umd:core',
    'ngAnnotate:core',
    'concat:banner_core',
    'uglify:core'
  ]);

  grunt.registerTask('build:messageformat_interpolation', [
    'jshint:messageformat_interpolation',
    'concat:messageformat_interpolation',
    'file_append:messageformat_interpolation',
    'umd:messageformat_interpolation',
    'ngAnnotate:messageformat_interpolation',
    'concat:banner_messageformat_interpolation',
    'uglify:messageformat_interpolation'
  ]);

  grunt.registerTask('build:handler_log', [
    'jshint:handler_log',
    'concat:handler_log',
    'file_append:handler_log',
    'umd:handler_log',
    'ngAnnotate:handler_log',
    'concat:banner_handler_log',
    'uglify:handler_log'
  ]);

  grunt.registerTask('build:loader_partial', [
    'jshint:loader_partial',
    'concat:loader_partial',
    'file_append:loader_partial',
    'umd:loader_partial',
    'ngAnnotate:loader_partial',
    'concat:banner_loader_partial',
    'uglify:loader_partial'
  ]);

  grunt.registerTask('build:loader_static_files', [
    'jshint:loader_static_files',
    'concat:loader_static_files',
    'file_append:loader_static_files',
    'umd:loader_static_files',
    'ngAnnotate:loader_static_files',
    'concat:banner_loader_static_files',
    'uglify:loader_static_files'
  ]);

  grunt.registerTask('build:loader_url', [
    'jshint:loader_url',
    'concat:loader_url',
    'file_append:loader_url',
    'umd:loader_url',
    'ngAnnotate:loader_url',
    'concat:banner_loader_url',
    'uglify:loader_url'
  ]);

  grunt.registerTask('build:storage_cookie', [
    'jshint:storage_cookie',
    'concat:storage_cookie',
    'file_append:storage_cookie',
    'umd:storage_cookie',
    'ngAnnotate:storage_cookie',
    'concat:banner_storage_cookie',
    'uglify:storage_cookie'
  ]);

  grunt.registerTask('build:storage_local', [
    'jshint:storage_local',
    'concat:storage_local',
    'file_append:storage_local',
    'umd:storage_local',
    'ngAnnotate:storage_local',
    'concat:banner_storage_local',
    'uglify:storage_local'
  ]);


  // For development purpose.
  grunt.registerTask('dev', ['jshint', 'karma:unit', 'concat', 'copy:demo', 'watch:livereload']);
  grunt.registerTask('server', ['express', 'express-keepalive']);

  // Legacy support
  grunt.registerTask('changelog', ['conventionalChangelog']);
};
