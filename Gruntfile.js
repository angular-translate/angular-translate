module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-ngdocs');

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    language: grunt.option('lang') || 'en',
    meta: {
      banner: '/**\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n'
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'karma:unit']
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
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        eqeqeq: true,
        globals: {
          angular: true
        }
      }
    },
    concat: {
      src: {
        src: ['src/translate.js', 'src/**/*.js'],
        dest: 'dist/angular-translate.js'
      },

      banner: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.src.dest %>',
        dest: '<%= concat.src.dest %>'
      }
    },
    uglify: {
      src: {
        files: {
          'dist/angular-translate.min.js': '<%= concat.src.dest %>'
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
      unit: {
        configFile: 'karma.unit.conf.js',
        singleRun: true
      },
      midway: {
        configFile: 'karma.midway.conf.js',
        singleRun: true
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },
    ngmin: {
      src: {
        src: '<%= concat.src.dest %>',
        dest: '<%= concat.src.dest %>'
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
        title: '<img width="215" src="img/logo/angular-translate-alternative/angular-translate_alternative_small2.png">',
        navTemplate: 'docs/html/nav.html',
        html5Mode: false,
        startPage: '/guide',
        scripts: [
          'http://rawgithub.com/SlexAxton/messageformat.js/master/messageformat.js',
          'http://rawgithub.com/SlexAxton/messageformat.js/master/locale/de.js',
          'http://code.angularjs.org/1.1.5/angular.min.js',
          'http://rawgithub.com/angular/bower-angular-cookies/master/angular-cookies.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate/master/angular-translate.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate-interpolation-messageformat/master/angular-translate-interpolation-messageformat.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate-storage-cookie/master/angular-translate-storage-cookie.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate-storage-local/master/angular-translate-storage-local.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate-loader-static-files/master/angular-translate-loader-static-files.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate-handler-log/master/angular-translate-handler-log.min.js'
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
    }
  });

  grunt.registerTask('default', ['jshint', 'karma']);
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('build', ['jshint', 'karma', 'concat:src', 'ngmin', 'concat:banner', 'copy:demo', 'uglify']);

  // For development purpose.
  grunt.registerTask('dev', ['jshint', 'karma:unit',  'concat', 'copy:demo', 'watch:livereload']);
  grunt.registerTask('server', ['express', 'express-keepalive']);
};
