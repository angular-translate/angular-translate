describe('pascalprecht.translate', function() {

  describe('provider', function() {
  
    var $translateProvider,
        $translate;

    beforeEach(module('pascalprecht.translate', function(_$translateProvider_) {
      $translateProvider = _$translateProvider_;
    }));
    
    beforeEach(inject(function(_$translate_) {
      $translate = _$translate_;
    }));
    
    
    it('should not has an invalidate() method', function() {
      expect($translateProvider.invalidate).not.toBeDefined();
    });
    
  });
  
  
  
  
  describe('service', function() {
    
    var $translateProvider,
        $translationTable;

    beforeEach(module('pascalprecht.translate', function(_$translateProvider_) {
      $translateProvider = _$translateProvider_;
      $translationTable = $translateProvider.translations();
    }));
    
   
    it('should has an invalidate() method', function() {
      inject(function($translate) {
        expect($translate.invalidate).toBeDefined();
        expect(typeof $translate.invalidate).toBe('function');
      });
    });
    
    
    describe('invalidate() method', function() {
    
      describe('without loader', function() {
      
        beforeEach(module('pascalprecht.translate', function() {
          $translateProvider.translations('en', {});
          $translateProvider.translations('ru', {});
          $translateProvider.uses('en');
        }));

        
        it('should clear all translation tables if no params are passed in', function() {
          inject(function($translate) {
            $translate.invalidate();
            expect($translationTable).toEqual({});
          });
        });
        
        it('should clear the exact translation table if param is passed in', function() {
          inject(function($translate) {
            $translate.invalidate('en');
            expect($translationTable.en).not.toBeDefined();
            expect($translationTable).not.toEqual({});
          });
        });
        
        
        // Events
        describe('', function() {
        
          it('should broadcast the $translateChangeSuccess event if all languages are invalidated',
           function() {
            inject(function($translate, $rootScope) {
              spyOn($rootScope, '$broadcast');
              $translate.invalidate();
              expect($rootScope.$broadcast).toHaveBeenCalledWith('$translateChangeSuccess');
            });
          });
          
          it('should broadcast the $translateChangeSuccess event if current language is ' +
             'directly invalidated', function() {
            inject(function($translate, $rootScope) {
              spyOn($rootScope, '$broadcast');
              $translate.invalidate('en');
              expect($rootScope.$broadcast).toHaveBeenCalledWith('$translateChangeSuccess');
            });
          });
          
          it('should not broadcast the $translateChangeSuccess event if another language is ' +
             'directly invalidated', function() {
            inject(function($translate, $rootScope) {
              spyOn($rootScope, '$broadcast');
              $translate.invalidate('ru');
              expect($rootScope.$broadcast).not.toHaveBeenCalledWith('$translateChangeSuccess');
            });
          });
        
        });
        
      });
      
      
      describe('with loader', function() {
      
        var enCalled,
            ruCalled,
            shouldResolve;
        
        beforeEach(module('pascalprecht.translate', function($provide) {
          enCalled = 0;
          ruCalled = 0;
          shouldResolve = true;
          
          $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {
            var tr = {
              en : [ { foo : 'en_bar' }, { foo : 'en_buz' } ],
              ru : [ { foo : 'ru_bar' }, { foo : 'ru_buz' } ]
            };
            
            return function (options) {
              var deferred = $q.defer();
              var key = options.key;
              
              $timeout(function () {
                if (shouldResolve) {
                  if (key === 'en') {
                    enCalled++;
                    deferred.resolve(tr.en[enCalled % 2]);
                  } else {
                    ruCalled++;
                    deferred.resolve(tr.ru[ruCalled % 2]);
                  }
                } else deferred.reject(key);
              }, 1000);

              return deferred.promise;
            };
          }]);

          $translateProvider.useLoader('customLoader');
          
          // put a data into the translation table now to prevent async loading of translations
          // once module gets into the runtime phase (prevent events broadcasting from uses method)
          $translateProvider.translations('en', { bar : 'en' });
          $translateProvider.translations('ru', { bar : 'ru' });
          
          $translateProvider.uses('en');
        }));
      
        
        it('should invoke it for current language', function() {
          inject(function($translate, $timeout) {
            var loaderCalled = enCalled;
            $translate.invalidate();
            $timeout.flush();
            expect(enCalled).not.toEqual(loaderCalled);
          });
        });
        
        it('should load a new version of translations', function() {
          inject(function($translate, $timeout) {
            var oldTable = $translationTable.en;
            
            $translate.invalidate();
            $timeout.flush();
            
            expect($translationTable.en).toBeDefined();
            expect($translationTable.en).not.toEqual({});
            expect($translationTable.en).not.toEqual(oldTable);
          });
        });

        it('should reload translations, but not extend them', function() {
          inject(function($translate, $timeout) {
            $translate.invalidate();
            $timeout.flush();
            expect($translationTable.en.foo).toBeDefined();
            expect($translationTable.en.bar).not.toBeDefined();
          });
        });
        
        
        // Events
        describe('', function() {
        
          it('should broadcast the $translateChangeSuccess event if new version of the current ' +
             'lang is loaded successfully', function() {
            inject(function($translate, $rootScope, $timeout) {
              spyOn($rootScope, '$broadcast');

              $translate.invalidate();
              $timeout.flush();
              
              expect($rootScope.$broadcast).toHaveBeenCalledWith('$translateChangeSuccess');
            });
          });
          
          it('should broadcast the $translateChangeSuccess event if new version of the current ' +
             'lang is directly reloaded successfully', function() {
            inject(function($translate, $rootScope, $timeout) {
              spyOn($rootScope, '$broadcast');

              $translate.invalidate('en');
              $timeout.flush();
              
              expect($rootScope.$broadcast).toHaveBeenCalledWith('$translateChangeSuccess');
            });
          });
          
          it('should not broadcast the $translateChangeSuccess event if new version of another ' +
             'lang is directly reloaded successfully', function() {
            inject(function($translate, $rootScope, $timeout) {
              spyOn($rootScope, '$broadcast');
              
              $translate.invalidate('ru');
              $timeout.flush();
              
              expect($rootScope.$broadcast).not.toHaveBeenCalledWith('$translateChangeSuccess');
            });
          });
          
          it('should broadcast the $translateChangeError event if new version of the current ' +
             'lang is not loaded successfully', function() {
            inject(function($translate, $rootScope, $timeout) {
              shouldResolve = false;
              spyOn($rootScope, '$broadcast');
              
              $translate.invalidate();
              $timeout.flush();
              
              expect($rootScope.$broadcast).toHaveBeenCalledWith('$translateChangeError');
            });
          });
          
          it('should broadcast the $translateChangeError event if new version of the current ' +
             'lang is directly not reloaded successfully', function() {
            inject(function($translate, $rootScope, $timeout) {
              shouldResolve = false;
              spyOn($rootScope, '$broadcast');
              
              $translate.invalidate('en');
              $timeout.flush();
              
              expect($rootScope.$broadcast).toHaveBeenCalledWith('$translateChangeError');
            });
          });
          
          it('should not broadcast the $translateChangeError event if new version of another ' +
             'lang is not directly reloaded successfully', function() {
            inject(function($translate, $rootScope, $timeout) {
              shouldResolve = false;
              spyOn($rootScope, '$broadcast');
              
              $translate.invalidate('ru');
              $timeout.flush();
              
              expect($rootScope.$broadcast).not.toHaveBeenCalledWith('$translateChangeError');
            });
          });
          
        });


        describe('with fallbackLanguage', function() {
          
          beforeEach(module('pascalprecht.translate', function($provide) {
            $translateProvider.fallbackLanguage('ru');
          }));
          
          
          it('should invoke it for both languages', function() {
            inject(function($translate, $timeout) {
              var fstLoaderCalled = enCalled,
                  sndLoaderCalled = ruCalled;
              
              $translate.invalidate();
              $timeout.flush();
              
              expect(enCalled).not.toEqual(fstLoaderCalled);
              expect(ruCalled).not.toEqual(sndLoaderCalled);
            });
          });
          
          it('should load new versions of both languages', function() {
            inject(function($translate, $timeout) {
              var fstTable = {},
                  sndTable = {};
              angular.extend(fstTable, $translationTable.en);
              angular.extend(sndTable, $translationTable.ru);
              
              $translate.invalidate();
              $timeout.flush();
              
              expect($translationTable.en).not.toEqual(fstTable);
              expect($translationTable.ru).not.toEqual(sndTable);
            });
          });
          
        });
        
      });
      
    });
    
  });
  
});
