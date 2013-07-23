module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
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
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
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
      }
    },
    uglify: {
      src: {
        files: {
          'dist/<%= concat.src.dest %>min.js': '<%= concat.src.dest %>'
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
        dest: 'site',
        title: 'angular-translate',
        navTemplate: 'docs/html/nav.html',
        html5Mode: false,
        startPage: '/guide',
        scripts: [
          'http://code.angularjs.org/1.0.7/angular.min.js',
          'http://rawgithub.com/angular/bower-angular-cookies/master/angular-cookies.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate/master/angular-translate.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate-interpolation-default/master/angular-translate-interpolation-default.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate-storage-cookie/master/angular-translate-storage-cookie.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate-storage-local/master/angular-translate-storage-local.min.js',
          'http://rawgithub.com/PascalPrecht/bower-angular-translate-loader-static-files/master/angular-translate-loader-static-files.min.js'
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
        src: ['docs/content/guide/*.ngdoc'],
        title: 'Guide'
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'karma']);
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('build', ['jshint', 'karma', 'concat', 'ngmin', 'copy:demo', 'uglify']);

  // For development purpose.
  grunt.registerTask('dev', ['jshint', 'karma:unit',  'concat', 'copy:demo', 'watch:livereload']);
  grunt.registerTask('server', ['express', 'express-keepalive']);

  grunt.registerTask('docs', ['ngdocs', 'copy:docs_assets']);
};
