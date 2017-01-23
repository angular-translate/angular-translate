/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  describe('$translateModule#run', function () {
    var $rootScope;

    describe('with no storage', function() {

      describe('and no preferred language', function() {

        beforeEach(module('pascalprecht.translate'));
        //these have always to be called AFTER the module() functions
        beforeEach(inject(function($injector){
          $rootScope = $injector.get('$rootScope');
          spyOn($rootScope, '$emit');
        }));
        it('should set used locale to undefined', inject(function($translate) {
          expect($translate.use()).toBeUndefined();
        }));
        it('should not emit $translateReadyToUse Event', function(){
          $rootScope.$digest();
          expect($rootScope.$emit).not.toHaveBeenCalled();
        });
      });

      describe('but with a preferred language', function() {

        beforeEach(module('pascalprecht.translate', function ($translateProvider) {
          $translateProvider.preferredLanguage('en');
        }));
        beforeEach(inject(function($injector){
          $rootScope = $injector.get('$rootScope');
          spyOn($rootScope, '$emit');
        }));
        it('should use preferredLanguage', inject(function($translate) {
          $rootScope.$digest();
          expect($translate.use()).toEqual('en');
          expect($rootScope.$emit).toHaveBeenCalledWith('$translateReadyToUse');

        }));
      });
    });

    describe('with a storage', function() {

      var storage;
      var storageMockCreator = function(storageValue) {
        var storage = {
          get: function() {
            return storage.value;
          },
          put: function(value) {
            storage.value = value;
          },
          set: function(value) {
            storage.value = value;
          }
        };
        spyOn(storage, 'get').and.returnValue(storageValue);
        return storage;
      };

      describe('containing value', function() {

        beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
          storage = storageMockCreator('en');
          $provide.value('storageMock', storage);

          $translateProvider
            .useStorage('storageMock')
            .preferredLanguage('de');
        }));
        beforeEach(inject(function($injector){
          $rootScope = $injector.get('$rootScope');
          spyOn($rootScope, '$emit');
        }));

        it('should use value from storage when provided', inject(function($translate) {
          $rootScope.$digest();
          expect(storage.get).toHaveBeenCalled();
          expect($translate.use()).toEqual('en');
          expect($rootScope.$emit).toHaveBeenCalledWith('$translateReadyToUse');

        }));
      });

      describe('but not containing any value', function() {

        beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
          storage = storageMockCreator(undefined);
          $provide.value('storageMock', storage);

          $translateProvider
            .useStorage('storageMock')
            .preferredLanguage('de');
        }));
        beforeEach(inject(function($injector){
          $rootScope = $injector.get('$rootScope');
          spyOn($rootScope, '$emit');
        }));
        it('should fallback to preferred locale', inject(function($translate) {
          $rootScope.$digest();
          expect(storage.get).toHaveBeenCalled();
          expect($translate.use()).toEqual('de');
          expect($rootScope.$emit).toHaveBeenCalledWith('$translateReadyToUse');

        }));
      });

      describe('but with no loadable translations', function() {
        beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
          storage = storageMockCreator('en');
          $provide.value('storageMock', storage);
          $provide.factory('loaderMock', function($q) {
            return function(options) {
              if(options.key === 'en') {
                return $q.reject('en');
              } else if(options.key === 'de') {
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
        beforeEach(inject(function($injector){
          $rootScope = $injector.get('$rootScope');
          spyOn($rootScope, '$emit');
        }));
        it('should fallback to preferred locale', inject(function($translate, $rootScope) {
          $rootScope.$digest();
          expect(storage.get).toHaveBeenCalled();
          expect($translate.use()).toEqual('de');
          expect($rootScope.$emit).toHaveBeenCalledWith('$translateReadyToUse');
        }));
      });
    });
  });
});
describe('Event $translateReadyToUse', function(){
  var $rootScope;
  var gotEvent = false;
  var eventCallback = {
    fn: function() {
      gotEvent = true;
    }
  };
  beforeEach(module('pascalprecht.translate', function($translateProvider) {
        $translateProvider.preferredLanguage('de');
  }));
  beforeEach(inject(function($injector){

    $rootScope = $injector.get('$rootScope');
    $rootScope.$on('$translateReadyToUse', eventCallback.fn);
    spyOn($rootScope, '$emit');
    spyOn(eventCallback, 'fn');
  }));

  it('should emit the Event and use() should return the correct language', inject(function($translate){
    expect($translate.use()).toEqual('de');
    $rootScope.$digest();
    expect($rootScope.$emit).toHaveBeenCalledWith('$translateReadyToUse');
  }));
  //can't figure out how to setup the the event listener before the module is instantiated
  xit('should be received', function(){
    expect(eventCallback.fn).toHaveBeenCalled();
    expect(gotEvent).toBe(true);
  });
});
