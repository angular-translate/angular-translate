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
        dest: 'dist/angular-translate-<%= pkg.version %>.js'
      }
    },
    uglify: {
      src: {
        files: {
          'dist/angular-translate-<%= pkg.version %>.min.js': '<%= concat.src.dest %>'
        }
      }
    },
    copy: {
      demo: {
        files: {
          'demo/js/angular-translate-latest.js': 'dist/angular-translate-<%= pkg.version %>.js'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
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
        html5Mode: false,
        scripts: [
          'bower_components/angular/angular.js',
          'bower_components/angular-translate/angular-translate.js'
        ]
      },
      api: {
        src: [
          'src/translate.js',
          'src/**/*.js',
          'docs/content/api/*.ngdoc'
        ],
        title: 'API Reference'
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'karma']);
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('build', ['jshint', 'karma', 'concat', 'ngmin', 'copy:demo', 'uglify']);

  // For development purpose.
  grunt.registerTask('dev', ['jshint', 'karma:unit',  'concat', 'copy:demo', 'watch:livereload']);
  grunt.registerTask('server', ['express', 'express-keepalive']);
};
