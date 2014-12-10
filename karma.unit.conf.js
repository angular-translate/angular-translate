// Karma configuration

var shared = require('./karma.util.conf.js');

module.exports = function (config) {

  var scope = process.env.TEST_SCOPE;
  shared.log(scope);

  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      shared.injectByScope(scope, 'messageformat/messageformat.js'),
      shared.injectByScope(scope, 'angular/angular.js'),
      shared.injectByScope(scope, 'angular-cookies/angular-cookies.js'),
      shared.injectByScope(scope, 'angular-mocks/angular-mocks.js'),
      'src/translate.js',
      'src/**/*.js',
      'test/unit/**/*.spec.js'
    ],

    exclude: [],

    reporters: shared.isDefaultScope(scope) ? ['progress', 'coverage'] : ['progress'],

    preprocessors: shared.isDefaultScope(scope) ? { 'src/**/*.js': ['coverage'] } : undefined,

    coverageReporter: shared.isDefaultScope(scope) ? {
      dir: 'build/coverage',
      subdir: 'report',
      type: 'lcov'
    } : undefined,

    port: 9876,

    colors: true,

    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],

    captureTimeout: 60000,

    singleRun: false
  });
};
