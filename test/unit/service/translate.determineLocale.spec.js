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

      describe('with locale negotiation and lower-case preferred language and canonical form avaliable language', function () {

        beforeEach(module('pascalprecht.translate', function ($translateProvider) {
          $translateProvider
            .translations('en_UK', {FOO : 'bar'})
            .registerAvailableLanguageKeys(['en_UK'])
            .determinePreferredLanguage(function () {
              // mocking
              // Work's like `window.navigator.lang = 'en_uk'`
              var nav = {
                language : 'en_uk'
              };
              return ((
                nav.language ||
                nav.browserLanguage ||
                nav.systemLanguage ||
                nav.userLanguage
              ) || '').split('-').join('_');
            });
        }));

        it('should respect casing in language map', function () {
          inject(function ($translate, $q, $rootScope) {
            var lang = $translate.use();
            expect(lang).toEqual('en_UK');
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

      describe('with locale negotiation and mix-case navigation language with wildcard language map', function () {
        beforeEach(module('pascalprecht.translate', function ($translateProvider) {
          $translateProvider
            .translations('en_UK', {FOO : 'bar'})
            .translations('fl_B1', {FOO : 'B1'})
            .translations('fl_B2', {FOO : 'B2'})
            .translations('fl_B3', {FOO : 'B3'})
            .translations('fl_B4', {FOO : 'B4'})
            .registerAvailableLanguageKeys(['en_UK', 'fl_B1', 'fl_B2', 'fl_B3', 'fl_B4'], {
              'en_*' : 'en_UK',
              'eN_*' : 'fl_B1',
              'En_*' : 'fl_B2',
              'EN_*' : 'fl_B3',
              '*'    : 'fl_B4'
            })
            .determinePreferredLanguage(function () {
              // mocking
              // Work's like `window.navigator.lang = 'en_US'`
              var nav = {
                language : 'EN_us'
              };
              return ((
                nav.language ||
                nav.browserLanguage ||
                nav.systemLanguage ||
                nav.userLanguage
              ) || '').split('-').join('_');
            });
        }));

        it('should match first part of wildcard case insensitive', function () {
          inject(function ($translate, $q, $rootScope) {
            var lang = $translate.use();
            expect(lang).toEqual('en_UK');
          });
        });
      });

      describe('using resolver "default"', function () {
        describe('should resolve to en-US to en_US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en-US';
            };
            $translateProvider.determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en_US');
          }));
        });

        describe('should resolve to en_US to en_US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en_US';
            };
            $translateProvider.determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en_US');
          }));
        });

        describe('should resolve to en-us to en_us', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en-us';
            };
            $translateProvider.determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en_us');
          }));
        });

        describe('should resolve to en to en using', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en-US';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en_US';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en-us';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en';
            };
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
        describe('should resolve to EN to en', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'EN';
            };
            $translateProvider
              .uniformLanguageTag('bcp47')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en');
          }));
        });

        describe('should resolve to en-US to en-US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en-US';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en_US';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en-us';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en';
            };
            $translateProvider
              .uniformLanguageTag('bcp47')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('en');
          }));
        });

        describe('should resolve script without region', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'sr-latn';
            };
            $translateProvider
              .uniformLanguageTag('bcp47')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('sr-Latn');
          }));
        });

        describe('should resolve script with region', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'sr-latn-rs';
            };
            $translateProvider
              .uniformLanguageTag('bcp47')
              .determinePreferredLanguage();
          }));
          it('test', inject(function ($window, $translate) {
            expect($translate.use()).toEqual('sr-Latn-RS');
          }));
        });
      });

      describe('using resolver "iso639-1"', function () {
        describe('should resolve to en-US to en-US', function () {
          beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide, pascalprechtTranslateOverrider) {
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en-US';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en_US';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en-us';
            };
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
            pascalprechtTranslateOverrider.getLocale = function () {
              return 'en';
            };
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
