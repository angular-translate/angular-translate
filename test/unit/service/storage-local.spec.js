/* jshint camelcase: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  var $translateLocalStorage, $window;

  describe('$translateLocalStorage', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies'));


    beforeEach(inject(function (_$translateLocalStorage_, _$window_) {
      //beforeEach(inject(function (_$translateLocalStorage_) {
      $translateLocalStorage = _$translateLocalStorage_;
      $window = _$window_;
    }));

    it('should be defined', function () {
      expect($translateLocalStorage).toBeDefined();
    });

    it('should be an object', function () {
      expect(typeof $translateLocalStorage).toBe('object');
    });

    it('should have a put() and a get() method', function () {
      expect($translateLocalStorage.put).toBeDefined();
      expect($translateLocalStorage.get).toBeDefined();
      expect($translateLocalStorage.set).toBeDefined(); // deprecated
    });

    describe('$translateLocalStorage#get', function () {

      it('should be a function', function () {
        expect(typeof $translateLocalStorage.get).toBe('function');
      });
    });

    describe('$translateLocalStorage#put()', function () {
      it('should be a function', function () {
        expect(typeof $translateLocalStorage.set).toBe('function'); // deprecated
        expect(typeof $translateLocalStorage.put).toBe('function');
      });
    });

  });

  describe('$translateProvider#useLocalStorage', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies', function ($translateProvider) {
      // ensure that the local storage is cleared.
      $window.localStorage.clear();
      $translateProvider
        .translations('de_DE', {
          'EXISTING_TRANSLATION_ID' : 'foo',
          'ANOTHER_ONE' : 'bar',
          'TRANSLATION_ID' : 'Lorem Ipsum {{value}}',
          'TRANSLATION_ID_2' : 'Lorem Ipsum {{value}} + {{value}}',
          'TRANSLATION_ID_3' : 'Lorem Ipsum {{value + value}}',
          'YET_ANOTHER' : 'Hallo da!'
        })
        .preferredLanguage('de_DE')
        .useLocalStorage();
    }));

    it('should use localstorage', function () {
      inject(function ($translate) {
        expect($translate.storage().get($translate.storageKey())).toEqual('de_DE');
      });
    });
  });
});
