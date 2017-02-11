/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  describe('$translateModule#run', function () {

    describe('with no storage', function () {

      describe('and no preferred language', function () {

        beforeEach(module('pascalprecht.translate'));

        it('should set used locale to undefined', inject(function ($translate) {
          expect($translate.use()).toBeUndefined();
        }));
      });

      describe('but with a preferred language', function () {

        beforeEach(module('pascalprecht.translate', function ($translateProvider) {
          $translateProvider.preferredLanguage('en');
        }));

        it('should use preferredLanguage', inject(function ($translate) {
          expect($translate.use()).toEqual('en');
        }));
      });
    });

    describe('with a storage', function () {

      var storage;
      var storageMockCreator = function (storageValue) {
        var storage = {
          get : function () {
            return storage.value;
          },
          put : function (value) {
            storage.value = value;
          },
          set : function (value) {
            storage.value = value;
          }
        };
        spyOn(storage, 'get').and.returnValue(storageValue);
        return storage;
      };

      describe('containing value', function () {

        beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
          storage = storageMockCreator('en');
          $provide.value('storageMock', storage);

          $translateProvider
            .useStorage('storageMock')
            .preferredLanguage('de');
        }));

        it('should use value from storage when provided', inject(function ($translate) {
          expect(storage.get).toHaveBeenCalled();
          expect($translate.use()).toEqual('en');
        }));
      });

      describe('but not containing any value', function () {

        beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
          storage = storageMockCreator(undefined);
          $provide.value('storageMock', storage);

          $translateProvider
            .useStorage('storageMock')
            .preferredLanguage('de');
        }));

        it('should fallback to preferred locale', inject(function ($translate) {
          expect(storage.get).toHaveBeenCalled();
          expect($translate.use()).toEqual('de');
        }));
      });

      describe('but with no loadable translations', function () {

        beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
          storage = storageMockCreator('en');
          $provide.value('storageMock', storage);
          $provide.factory('loaderMock', function ($q) {
            return function (options) {
              if (options.key === 'en') {
                return $q.reject('en');
              } else if (options.key === 'de') {
                return $q.when({
                  key : 'de',
                  table : {}
                });
              }
            };
          });

          $translateProvider
            .useStorage('storageMock')
            .useLoader('loaderMock')
            .preferredLanguage('de');
        }));

        it('should fallback to preferred locale', inject(function ($translate, $rootScope) {
          $rootScope.$digest();
          expect(storage.get).toHaveBeenCalled();
          expect($translate.use()).toEqual('de');
        }));
      });
    });
  });
});
