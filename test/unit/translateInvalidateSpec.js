'use strict';

describe('pascalprecht.translate', function() {

  describe('provider', function() {
  
    var $translateProvider
      , $translate;

    beforeEach(module('pascalprecht.translate', function(_$translateProvider_) {
      $translateProvider = _$translateProvider_;
    }));
    
    beforeEach(inject(function(_$translate_) {
      $translate = _$translate_;
    }));
    
    
    it('should not has an invalidate() mathod', function() {
      expect($translateProvider.invalidate).not.toBeDefined();
    });
    
  });
  
  
  
  
  describe('service', function() {
    
    var $translateProvider
      , $translate
      , $translationTable;

    beforeEach(module('pascalprecht.translate', function(_$translateProvider_) {
      $translateProvider = _$translateProvider_;
      $translationTable = $translateProvider.translations();
    }));
    
    beforeEach(inject(function(_$translate_) {
      $translate = _$translate_;
    }));
    
    
    it('should has an invalidate() method', function() {
      expect($translate.invalidate).toBeDefined();
      expect(typeof $translate.invalidate).toBe('function');
    });
    
    
    describe('invalidate() method', function() {
    
      describe('without loader', function() {
      
        beforeEach(module('pascalprecht.translate', function() {
          $translateProvider.translations('en_US', {});
          $translateProvider.translations('ru_RU', {});
          $translateProvider.uses('en_US');
        }));
        
        
        it('should clear all translation tables if no params are passed in', function() {
          $translate.invalidate();
          expect($translationTable).toEqual({});
        });
        
        it('should clear the exact translation table if param is passed in', function() {
          $translate.invalidate('en_US');
          expect($translationTable['en_US']).not.toBeDefined();
          expect($translationTable).not.toEqual({});
        });
        
      });
      
      
      describe('with loader', function() {
      
        var enCalled
          , ruCalled;
        
        beforeEach(module('pascalprecht.translate', function($provide) {
          enCalled = 0;
          ruCalled = 0;
          
          $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {
            var tr = {
              en : [ { foo : 'en_bar' }, { foo : 'en_buz' } ],
              ru : [ { foo : 'ru_bar' }, { foo : 'ru_buz' } ]
            };
            
            return function (options) {
              var deferred = $q.defer();

              $timeout(function () {
                if (options.key == 'en') {
                  enCalled++;
                  deferred.resolve(tr['en'][enCalled % 2]);
                } else {
                  ruCalled++;
                  deferred.resolve(tr['ru'][ruCalled % 2]);
                }
              }, 1000);

              return deferred.promise;
            };
          }]);

          $translateProvider.useLoader('customLoader');
          $translateProvider.uses('en');
        }));
      
        
        it('should invoke it for current language', function() {
          inject(function($timeout) {
            var loaderCalled = enCalled;
            $translate.invalidate();
            $timeout.flush();
            expect(enCalled).not.toEqual(loaderCalled);
          });
        });
        
        it('should load a new version of translations', function() {
          inject(function($timeout) {
            var oldTable = $translationTable['en'];
            
            $translate.invalidate();
            $timeout.flush();
            
            expect($translationTable['en']).toBeDefined();
            expect($translationTable['en']).not.toEqual({});
            expect($translationTable['en']).not.toEqual(oldTable);
          });
        });
        
        
        describe('with fallbackLanguage', function() {
          
          beforeEach(module('pascalprecht.translate', function($provide) {
            $translateProvider.fallbackLanguage('ru');
          }));
          
          
          it('should invoke it for both languages', function() {
            inject(function($timeout) {
              var fstLoaderCalled = enCalled
                , sndLoaderCalled = ruCalled;
              
              $translate.invalidate();
              $timeout.flush();
              
              expect(enCalled).not.toEqual(enLoaderCalled);
              expect(ruCalled).not.toEqual(ruLoaderCalled);
            });
          });
          
          it('should load new versions of both languages', function() {
            inject(function($timeout) {
              var fstTable = {}
                , sndTable = {};
              angular.extend(fstTable, $translationTable['en']);
              angular.extend(sndTable, $translationTable['ru']);
              
              $translate.invalidate();
              $timeout.flush();
              
              expect($translationTable['en']).not.toEqual(fstTable);
              expect($translationTable['ru']).not.toEqual(sndTable);
            });
          });
          
        });
        
      });
      
      
      describe(': Event', function() {
        
        var rootScope, needResolve;
        
        beforeEach(module('pascalprecht.translate', function($provide) {
          needResolve = true;
          
          $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {
            return function (options) {
              var deferred = $q.defer();

              $timeout(function () {
                if (needResolve) deferred.resolve({});
                else deferred.reject(options.key);
              }, 1000);

              return deferred.promise;
            };
          }]);

          $translateProvider.useLoader('customLoader');
          $translateProvider.uses('en');
        }));

        beforeEach(inject(function($injector) {
          rootScope = $injector.get('$rootScope');
          spyOn(rootScope, '$broadcast');
        }));
        
        
        describe('$translateChangeSuccess', function() {
        
          it('should be called if new version of the current lang is loaded successfully',
          function() {
            inject(function($timeout) {
              needResolve = true;
              
              $translate.invalidate();
              $timeout.flush();
              
              expect(rootScope.$broadcast).toHaveBeenCalledWith('$translateChangeSuccess');
            });
          });
          
        });
        
        describe('$translateChangeError', function() {
        
          it('should be called if new version of the current lang is not loaded',
          function() {
            inject(function($timeout) {
              needResolve = false;
              
              $translate.invalidate();
              $timeout.flush();
              
              expect(rootScope.$broadcast).toHaveBeenCalledWith('$translateChangeError');
            });
          });
          
        });
        
      });
      
    });
    
  });
  
});
