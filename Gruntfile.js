module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
        tasks: ['jshint']
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
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('build', ['jshint', 'karma', 'concat', 'uglify']);
};
