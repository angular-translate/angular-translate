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
    });
  });

});
