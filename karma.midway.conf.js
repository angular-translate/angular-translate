// Karma configuration

var shared = require('./karma.util.conf.js');

module.exports = function (config) {

  var scope = process.env.TEST_SCOPE;
  shared.log(scope);

  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      shared.injectByScope(scope, 'angular/angular.js'),
      'src/translate.js',
      'src/**/*.js',
      'test/midway/**/*Spec.js'
    ],

    exclude: [],

    port: 9876,

    colors: true,

    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,

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
