// Karma configuration

module.exports = function (config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'bower_components/angular/angular.js',
      'bower_components/ngMidwayTester/Source/ngMidwayTester.js',
      'src/translate.js',
      'bower_components/angular-translate-interpolation-default/angular-translate-interpolation-default.js',
      'src/**/*.js',
      'test/midway/**/*Spec.js'
    ],

    exclude: [],

    reports: ['progress'],

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

    singleRun: false,

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher'
    ]
  });
};
