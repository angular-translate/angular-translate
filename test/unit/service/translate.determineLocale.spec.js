/* jshint camelcase: false, quotmark: false, unused: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  describe('$translateProvider', function () {

    describe('#determinePreferredLanguage()', function () {

      describe('without locale negotiation', function () {

        beforeEach(module('pascalprecht.translate', function ($translateProvider) {
          $translateProvider
            .translations('en_US', {FOO : 'bar'})
            .translations('de_DE', {FOO : 'foo'})
            .determinePreferredLanguage(function () {
              // mocking
              // Work's like `window.navigator.lang = 'en_US'`
              var nav = {
                language : 'en_US'
              };
              return ((
              nav.language ||
              nav.browserLanguage ||
              nav.systemLanguage ||
              nav.userLanguage
              ) || '').split('-').join('_');
            });
        }));

        it('should determine browser language', function () {
          inject(function ($translate, $q, $rootScope) {
            var deferred = $q.defer(),
              promise = deferred.promise,
              value;

            promise.then(function (foo) {
              value = foo;
            });
            $translate('FOO').then(function (translation) {
              deferred.resolve(translation);
            });
            $rootScope.$digest();
            expect(value).toEqual('bar');
          });
        });
      });

      describe('with locale negotiation', function () {

        beforeEach(module('pascalprecht.translate', function ($translateProvider) {
          $translateProvider
            .translations('en', {FOO : 'bar'})
            .translations('de', {FOO : 'foo'})
            .registerAvailableLanguageKeys(['en', 'de'], {
              'en_US' : 'en',
              'de_DE' : 'de'
            })
            .determinePreferredLanguage(function () {
              // mocking
              // Work's like `window.navigator.lang = 'en_US'`
              var nav = {
                language : 'en_US'
              };
              return ((
              nav.language ||
              nav.browserLanguage ||
              nav.systemLanguage ||
              nav.userLanguage
              ) || '').split('-').join('_');
            });
        }));

        it('should determine browser language', function () {
          inject(function ($translate, $q, $rootScope) {
            var deferred = $q.defer(),
              promise = deferred.promise,
              value;

            promise.then(function (foo) {
              value = foo;
            });
            $translate('FOO').then(function (translation) {
              deferred.resolve(translation);
            });
            $rootScope.$digest();
            expect(value).toEqual('bar');
          });
        });
      });

      describe('with locale negotiation and lower-case navigation language', function () {

        beforeEach(module('pascalprecht.translate', function ($translateProvider) {
          $translateProvider
            .translations('en', {FOO : 'bar'})
            .translations('de', {FOO : 'foo'})
            .registerAvailableLanguageKeys(['en', 'de'], {
              'en_US' : 'en',
              'de_DE' : 'de'
            })
            .determinePreferredLanguage(function () {
              // mocking
              // Work's like `window.navigator.lang = 'en_US'`
              var nav = {
                language : 'en_us'
              };
              return ((
              nav.language ||
              nav.browserLanguage ||
              nav.systemLanguage ||
              nav.userLanguage
              ) || '').split('-').join('_');
            });
        }));

        it('should determine browser language', function () {
          inject(function ($translate, $q, $rootScope) {
            var deferred = $q.defer(),
              promise = deferred.promise,
              value;

            promise.then(function (foo) {
              value = foo;
            });
            $translate('FOO').then(function (translation) {
              deferred.resolve(translation);
            });
            $rootScope.$digest();
            expect(value).toEqual('bar');
          });
        });
      });

      describe('with locale negotiation w/o aliases', function () {

        var translateProvider;

        beforeEach(module('pascalprecht.translate', function ($translateProvider) {
          $translateProvider
            .translations('en', {FOO : 'bar'})
            .translations('de', {FOO : 'foo'})
            .registerAvailableLanguageKeys(['en', 'de'])
            .determinePreferredLanguage(function () {
              // mocking
              // Work's like `window.navigator.lang = 'en_US'`
              var nav = {
                language : 'en_US'
              };
              return ((
              nav.language ||
              nav.browserLanguage ||
              nav.systemLanguage ||
              nav.userLanguage
              ) || '').split('-').join('_');
            });

          translateProvider = $translateProvider;
        }));

        it('should determine browser language', function () {
          inject(function ($translate, $q, $rootScope) {
            var deferred = $q.defer(),
              promise = deferred.promise,
              value;

            promise.then(function (foo) {
              value = foo;
            });
            $translate('FOO').then(function (translation) {
              deferred.resolve(translation);
            });
            $rootScope.$digest();
            expect(value).toEqual('bar');
          });
        });

        it('should be chainable', function () {
          inject(function () {
            var ret = translateProvider.determinePreferredLanguage(function () {
              // mocking
              // Work's like `window.navigator.lang = 'en_US'`
              var nav = {
                language : 'en_US'
              };
              return ((
              nav.language ||
              nav.browserLanguage ||
              nav.systemLanguage ||
              nav.userLanguage
              ) || '').split('-').join('_');
            });

            expect(ret).toEqual(translateProvider);
          });
        });
      });

      describe('using resolver "default"', function () {
        describe('should resolve to en-US to en_US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en-US'; };
            $translateProvider.determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en_US');
          }));
        });

        describe('should resolve to en_US to en_US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en_US'; };
            $translateProvider.determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en_US');
          }));
        });

        describe('should resolve to en-us to en_us', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en-us'; };
            $translateProvider.determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en_us');
          }));
        });

        describe('should resolve to en to en using', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en'; };
            $translateProvider.determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en');
          }));
        });
      });

      describe('using resolver "java"', function () {
        describe('should resolve to en-US to en_US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en-US'; };
            $translateProvider
              .uniformLanguageTag('java')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en_US');
          }));
        });

        describe('should resolve to en_US to en_US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en_US'; };
            $translateProvider
              .uniformLanguageTag('java')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en_US');
          }));
        });

        describe('should resolve to en-us to en_US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en-us'; };
            $translateProvider
              .uniformLanguageTag('java')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en_US');
          }));
        });

        describe('should resolve to en to en using', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en'; };
            $translateProvider
              .uniformLanguageTag('java')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en');
          }));
        });
      });

      describe('using resolver "bcp47"', function () {
        describe('should resolve to en-US to en-US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en-US'; };
            $translateProvider
              .uniformLanguageTag('bcp47')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en-US');
          }));
        });

        describe('should resolve to en_US to en-US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en_US'; };
            $translateProvider
              .uniformLanguageTag('bcp47')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en-US');
          }));
        });

        describe('should resolve to en-us to en-US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en-us'; };
            $translateProvider
              .uniformLanguageTag('bcp47')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en-US');
          }));
        });

        describe('should resolve to en to en using', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en'; };
            $translateProvider
              .uniformLanguageTag('bcp47')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en');
          }));
        });
      });

      describe('using resolver "iso639-1"', function () {
        describe('should resolve to en-US to en-US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en-US'; };
            $translateProvider
              .uniformLanguageTag('iso639-1')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en');
          }));
        });

        describe('should resolve to en_US to en-US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en_US'; };
            $translateProvider
              .uniformLanguageTag('iso639-1')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en');
          }));
        });

        describe('should resolve to en-us to en-US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en-us'; };
            $translateProvider
              .uniformLanguageTag('iso639-1')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en');
          }));
        });

        describe('should resolve to en to en using', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () { return 'en'; };
            $translateProvider
              .uniformLanguageTag('iso639-1')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en');
          }));
        });
      });

    });
  });
});
