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
        files: ['Gruntfile.js', 'ngTranslate/**/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'karma:unit']
      },
      livereload: {
        options: {
          livereload: true
        },
        // TODO actually complete demo except copied "angular-translate-latest.js"
        files: ['ngTranslate/**/*.js', 'demo/async-loader/*'],
        tasks: ['jshint', 'karma:unit', 'concat', 'copy:demo']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'ngTranslate/**/*.js', 'test/**/*.js'],
      options: {
        eqeqeq: true,
        globals: {
          angular: true
        }
      }
    },
    concat: {
      ngTranslate: {
        src: ['ngTranslate/translate.js', 'ngTranslate/**/*.js'],
        dest: 'dist/angular-translate-<%= pkg.version %>.js'
      }
    },
    uglify: {
      ngTranslate: {
        files: {
          'dist/angular-translate-<%= pkg.version %>.min.js': '<%= concat.ngTranslate.dest %>'
        }
      }
    },
    copy: {
      demo: {
        files: {
          'demo/angular-translate-latest.js': 'dist/angular-translate-<%= pkg.version %>.js'
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
      ngTranslate: {
        src: '<%= concat.ngTranslate.dest %>',
        dest: '<%= concat.ngTranslate.dest %>'
      }
    },
    express: {
      server: {
        options: {
          port: 3005,
          bases: '.'
        }
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
