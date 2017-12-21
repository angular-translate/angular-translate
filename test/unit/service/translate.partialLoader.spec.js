/* jshint camelcase: false, quotmark: false, unused: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  beforeEach(module('ngMockE2EAsync'));

  beforeEach(module('pascalprecht.translate', function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate : '/locales/{part}-{lang}.json'
    });
    $translatePartialLoaderProvider.addPart('part1');
    $translateProvider.use('en');
  }));

  module(function ($provide) {
    //Randomly delay $http response to simulate real-world scenario.
    $provide.decorator('$httpBackend', function ($delegate) {
      var proxy = function (method, url, data, callback, headers) {
        var interceptor = function () {
          var _this = this,
            _arguments = arguments,
            _timeout = Math.floor((Math.random() * 50) + 1);
          console.log('setting timeout to', _timeout);
          setTimeout(function () {
            callback.apply(_this, _arguments);
          }, _timeout);
        };
        return $delegate.call(this, method, url, data, interceptor, headers);
      };
      for (var key in $delegate) {
        proxy[key] = $delegate[key];
      }
      return proxy;
    });
  });

  describe('using partial-loader', function () {

    it('and one part right before $translate.use(…)', inject(function ($translatePartialLoader, $httpBackend, $translate, $timeout) {

      $httpBackend.whenGET('/locales/part1-en.json').respond(200, '{"key1":"value1","key2":"value2","key3":"value3","key4":"value4"}');

      $translate(['key1', 'key2', 'key3'])
        .then(function (translations) {
          expect(translations.key1).toEqual('value1');
          expect(translations.key2).toEqual('value2');
          expect(translations.key3).toEqual('value3');
          console.log(translations);
        });

      $timeout.flush();

    }));

    // #1781
    it('additional part right after $translate.use(…)', inject(function ($translatePartialLoader, $httpBackend, $translate, $timeout) {

      $translatePartialLoader.addPart('part2');

      $httpBackend.whenGET('/locales/part1-en.json').respond(200, '{"key1":"value1","key2":"value2","key3":"value3","key4":"value4"}');
      $httpBackend.whenGET('/locales/part2-en.json').respond(200, '{"key2" : "overridenby2","key4":"overridenby2"}');

      $translate(['key1', 'key2', 'key3'])
        .then(function (translations) {
          expect(translations.key1).toEqual('value1');
          expect(translations.key2).toEqual('overridenby2');
          expect(translations.key3).toEqual('value3');
        });

      $timeout.flush();

    }));
  });
});
