describe('pascalprecht.translate', function() {

  describe('$translatePartialLoader', function() {

    beforeEach(module('pascalprecht.translate'));
    
    var counter,
        resolveHandlerCounter,
        rejectHandlerCounter;
    
    function ThrowErrorHttpInterceptor() {
      return {
        request : function() {
          throw new Error('$http service was used!');
        }
      };
    }

    function CounterHttpInterceptor() {
      return {
        request : function(options) {
          ++counter;
          return options;
        }
      };
    }
    
    beforeEach(module(function($provide) {
      $provide.factory('ResolveErrorHandler', function($q) {
        return function(partName, language) {
          ++resolveHandlerCounter;
          var deferred = $q.defer();
          deferred.resolve('{"foo":"foo"}');
          return deferred.promise;
        };
      });
      
      $provide.factory('RejectErrorHandler', function($q) {
        return function(partName, language) {
          ++rejectHandlerCounter;
          var deferred = $q.defer();
          deferred.reject(partName);
          return deferred.promise;
        };
      });
    }));
    
    beforeEach(function() {
      counter = 0;
      resolveHandlerCounter = 0;
      rejectHandlerCounter = 0;
    });
    
    
    
    
    describe('provider', function() {

      var $provider;
      
      beforeEach(module('pascalprecht.translate', function($translatePartialLoaderProvider) {
        $provider = $translatePartialLoaderProvider;
      }));
      
      
      describe('addPart()', function() {
      
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($provider.addPart).toBeDefined();
          });
        });
      
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $provider.addPart).toBe('function');
          });
        });
        
        it('should throw an error if called without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.addPart();
            }).toThrow('Couldn\'t add a new part, no part name is specified!');
          });
        });
        
        it('should throw an error if a given arg is not a string', function() {
          inject(function($translatePartialLoader) {
            var message = 'Invalid type of a first argument, string expected.';
            expect(function() { $provider.addPart(function(){}); }).toThrow(message);
            expect(function() { $provider.addPart(false);        }).toThrow(message);
            expect(function() { $provider.addPart(null);         }).toThrow(message);
            expect(function() { $provider.addPart(NaN);          }).toThrow(message);
            expect(function() { $provider.addPart([]);           }).toThrow(message);
            expect(function() { $provider.addPart({});           }).toThrow(message);
            expect(function() { $provider.addPart(2);            }).toThrow(message);
          });
        });
        
        it('should be chainable if called with args', function() {
          inject(function($translatePartialLoader) {
            expect($provider.addPart('part')).toEqual($provider);
          });
        });
        
        it('should add a part', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            expect($provider.isPartAvailable('part')).toEqual(true);
          });
        });
        
        it('shouldn\'t throw an error if the same part is added multiple times', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.addPart('part');
              $provider.addPart('part');
            }).not.toThrow();
          });
        });
        
        it('shouldn\'t broadcast any event if called without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            try { $provider.addPart(); } catch (e) {}
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event if called with args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $provider.addPart('part');
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t really load any data from the server', function() {
          module(function($httpProvider) {
            $httpProvider.interceptors.push(ThrowErrorHttpInterceptor);
          });
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.addPart('part');
            }).not.toThrow('$http service was used!');
          });
        });
        
        it('shouldn\'t affect on other parts', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part1');
            var isPart1 = $provider.isPartAvailable('part1'),
                isPart2 = $provider.isPartAvailable('part2');
            
            $provider.addPart('part3');
            
            expect($provider.isPartAvailable('part1')).toEqual(isPart1);
            expect($provider.isPartAvailable('part2')).toEqual(isPart2);
          });
        });
        
      });
      
      
      describe('deletePart()', function() {
      
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($provider.deletePart).toBeDefined();
          });
        });
      
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $provider.deletePart).toBe('function');
          });
        });
        
        it('should throw an error if called without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.deletePart();
            }).toThrow('Couldn\'t delete any part, no part name is specified!');
          });
        });
        
        it('should throw an error if a given arg is not a string', function() {
          inject(function($translatePartialLoader) {
            var message = 'Invalid type of a first argument, string expected.';
            expect(function() { $provider.deletePart(function(){}); }).toThrow(message);
            expect(function() { $provider.deletePart(false);        }).toThrow(message);
            expect(function() { $provider.deletePart(null);         }).toThrow(message);
            expect(function() { $provider.deletePart(NaN);          }).toThrow(message);
            expect(function() { $provider.deletePart([]);           }).toThrow(message);
            expect(function() { $provider.deletePart({});           }).toThrow(message);
            expect(function() { $provider.deletePart(2);            }).toThrow(message);
          });
        });
      
        it('should be chainable if called with args', function() {
          inject(function($translatePartialLoader) {
            expect($provider.deletePart('part')).toEqual($provider);
          });
        });
        
        it('should delete a target part', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            $provider.deletePart('part');
            expect($provider.isPartAvailable('part')).toEqual(false);
          });
        });
        
        it('shouldn\'t throw an error if a target part is not present', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.deletePart('part');
            }).not.toThrow();
          });
        });
        
        it('shouldn\'t broadcast any event if called without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            try { $provider.deletePart(); } catch (e) {}
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event called with args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $provider.deletePart('part');
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t affect on other parts', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part1').addPart('part3');
            var isPart1 = $provider.isPartAvailable('part1'),
                isPart2 = $provider.isPartAvailable('part2');
            
            $provider.deletePart('part3');
            
            expect($provider.isPartAvailable('part1')).toEqual(isPart1);
            expect($provider.isPartAvailable('part2')).toEqual(isPart2);
          });
        });
        
      });
      
      
      describe('isPartAvailable()', function() {
      
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($provider.isPartAvailable).toBeDefined();
          });
        });
      
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $provider.isPartAvailable).toBe('function');
          });
        });
        
        it('should throw an error if called without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.isPartAvailable();
            }).toThrow('Couldn\'t check any part, no part name is specified!');
          });
        });
      
        it('should throw an error if a given arg is not a string', function() {
          inject(function($translatePartialLoader) {
            var message = 'Invalid type of a first argument, string expected.';
            expect(function() { $provider.isPartAvailable(function(){}); }).toThrow(message);
            expect(function() { $provider.isPartAvailable(false);        }).toThrow(message);
            expect(function() { $provider.isPartAvailable(null);         }).toThrow(message);
            expect(function() { $provider.isPartAvailable(NaN);          }).toThrow(message);
            expect(function() { $provider.isPartAvailable([]);           }).toThrow(message);
            expect(function() { $provider.isPartAvailable({});           }).toThrow(message);
            expect(function() { $provider.isPartAvailable(2);            }).toThrow(message);
          });
        });
      
        it('should return true if a target part was added', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            expect($provider.isPartAvailable('part')).toEqual(true);
          });
        });
      
        it('should return false if a target part was not added', function() {
          inject(function($translatePartialLoader) {
            expect($provider.isPartAvailable('part')).toEqual(false);
          });
        });
        
        it('should return false if a target part was deleted', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            $provider.deletePart('part');
            expect($provider.isPartAvailable('part')).toEqual(false);
          });
        });
      
      });
      
      
      describe('urlTemplate()', function() {
      
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($provider.useLoadFailureHandler).toBeDefined();
          });
        });
      
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $provider.useLoadFailureHandler).toBe('function');
          });
        });
        
        it('should throw an error if a given arg is not a string', function() {
          inject(function($translatePartialLoader) {
            var message = 'Invalid type of a first argument, string expected.';
            expect(function() { $provider.useLoadFailureHandler(function(){}); }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler(false);        }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler(null);         }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler(NaN);          }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler([]);           }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler({});           }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler(2);            }).toThrow(message);
          });
        });
        
        it('should be chainable if called with args', function() {
          inject(function($translatePartialLoader) {
            expect($provider.useLoadFailureHandler('handler')).toEqual($provider);
          });
        });
        
        it('should return a current url template if called without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.useLoadFailureHandler();
            }).toThrow('Couldn\'t register an error handler, no service name is specified!');
          });
        });
        
        it('shouldn\'t broadcast any event if called without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            try { $provider.useLoadFailureHandler(); } catch (e) {}
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event if called with args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $provider.useLoadFailureHandler('handler');
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t affect on parts', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part1');
            var isPart1 = $provider.isPartAvailable('part1'),
                isPart2 = $provider.isPartAvailable('part2');
            
            $provider.useLoadFailureHandler('handler');
            
            expect($provider.isPartAvailable('part1')).toEqual(isPart1);
            expect($provider.isPartAvailable('part2')).toEqual(isPart2);
          });
        });
      
      });
      
      
      describe('useLoadFailureHandler()', function() {
      
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($provider.useLoadFailureHandler).toBeDefined();
          });
        });
      
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $provider.useLoadFailureHandler).toBe('function');
          });
        });
        
        it('should throw an error if called without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.useLoadFailureHandler();
            }).toThrow('Couldn\'t register an error handler, no service name is specified!');
          });
        });
        
        it('should throw an error if a given arg is not a string', function() {
          inject(function($translatePartialLoader) {
            var message = 'Invalid type of a first argument, string expected.';
            expect(function() { $provider.useLoadFailureHandler(function(){}); }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler(false);        }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler(null);         }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler(NaN);          }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler([]);           }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler({});           }).toThrow(message);
            expect(function() { $provider.useLoadFailureHandler(2);            }).toThrow(message);
          });
        });
        
        it('should be chainable if called with args', function() {
          inject(function($translatePartialLoader) {
            expect($provider.useLoadFailureHandler('handler')).toEqual($provider);
          });
        });
        
        it('shouldn\'t broadcast any event if called without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            try { $provider.useLoadFailureHandler(); } catch (e) {}
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event if called with args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $provider.useLoadFailureHandler('handler');
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t affect on parts', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part1');
            var isPart1 = $provider.isPartAvailable('part1'),
                isPart2 = $provider.isPartAvailable('part2');
            
            $provider.useLoadFailureHandler('handler');
            
            expect($provider.isPartAvailable('part1')).toEqual(isPart1);
            expect($provider.isPartAvailable('part2')).toEqual(isPart2);
          });
        });
        
      });
      
    });
    
    
    
    
    describe('service', function() {
    
      it('should be defined', function() {
        inject(function($translatePartialLoader) {
          expect($translatePartialLoader).toBeDefined();
        });
      });
    
      it('should be a function', function() {
        inject(function($translatePartialLoader) {
          expect(typeof $translatePartialLoader).toBe('function');
        });
      });
    
    
      describe('addPart()', function() {
        
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.addPart).toBeDefined();
          });
        });
      
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $translatePartialLoader.addPart).toBe('function');
          });
        });
        
        it('should throw an error if called without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $translatePartialLoader.addPart();
            }).toThrow('Couldn\'t add a new part, no part name is specified!');
          });
        });
        
        it('should throw an error if a given arg is not a string', function() {
          inject(function($translatePartialLoader) {
            var message = 'Invalid type of a first argument, string expected.';
            expect(function() { $translatePartialLoader.addPart(function(){}); }).toThrow(message);
            expect(function() { $translatePartialLoader.addPart(false);        }).toThrow(message);
            expect(function() { $translatePartialLoader.addPart(null);         }).toThrow(message);
            expect(function() { $translatePartialLoader.addPart(NaN);          }).toThrow(message);
            expect(function() { $translatePartialLoader.addPart([]);           }).toThrow(message);
            expect(function() { $translatePartialLoader.addPart({});           }).toThrow(message);
            expect(function() { $translatePartialLoader.addPart(2);            }).toThrow(message);
          });
        });
        
        it('should be chainable if called with args', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.addPart('part')).toEqual($provider);
          });
        });
        
        it('should add a part', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            expect($translatePartialLoader.isPartAvailable('part')).toEqual(true);
          });
        });
        
        it('shouldn\'t throw an error if the same part is added multiple times', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $translatePartialLoader.addPart('part');
              $translatePartialLoader.addPart('part');
            }).not.toThrow();
          });
        });
        
        it('shouldn\'t broadcast any event if called without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            try { $translatePartialLoader.addPart(); } catch (e) {}
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('should broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if a new part is added', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.addPart('part');
            expect($rootScope.$broadcast)
              .toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
          });
        });
        
        it('shouldn\'t broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if the same part is added again', function() {
          inject(function($translatePartialLoader, $rootScope) {
            $translatePartialLoader.addPart('part');
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.addPart('part');
            expect($rootScope.$broadcast)
              .not.toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
          });
        });
        
        it('should broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if a target part is added again after being deleted', function() {
          inject(function($translatePartialLoader, $rootScope) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.deletePart('part');
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.addPart('part');
            expect($rootScope.$broadcast)
              .toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
          });
        });
        
        it('shouldn\'t really load any data from the server', function() {
          module(function($httpProvider) {
            $httpProvider.interceptors.push(ThrowErrorHttpInterceptor);
          });
          inject(function($translatePartialLoader) {
            expect(function() {
              $translatePartialLoader.addPart('part');
            }).not.toThrow('$http service was used!');
          });
        });
        
        it('shouldn\'t affect on other parts', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part1');
            var isPart1 = $translatePartialLoader.isPartAvailable('part1'),
                isPart2 = $translatePartialLoader.isPartAvailable('part2');
            
            $translatePartialLoader.addPart('part3');
            
            expect($translatePartialLoader.isPartAvailable('part1')).toEqual(isPart1);
            expect($translatePartialLoader.isPartAvailable('part2')).toEqual(isPart2);
          });
        });
      
      });
      
      
      describe('deletePart()', function() {
      
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.deletePart).toBeDefined();
          });
        });
      
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $translatePartialLoader.deletePart).toBe('function');
          });
        });
        
        it('should throw an error if called without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $translatePartialLoader.deletePart();
            }).toThrow('Couldn\'t delete any part, no part name is specified!');
          });
        });
        
        it('should throw an error if a given first arg is not a string', function() {
          inject(function($translatePartialLoader) {
            var message = 'Invalid type of a first argument, string expected.';
            expect(function() { 
              $translatePartialLoader.deletePart(function(){});
            }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart(false);      }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart(null);       }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart(NaN);        }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart([]);         }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart({});         }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart(2);          }).toThrow(message);
          });
        });
      
        it('should throw an error if a given second arg is not a boolean', function() {
          inject(function($translatePartialLoader) {
            var message = 'Invalid type of a second argument, boolean expected.';
            expect(function() {
              $translatePartialLoader.deletePart('s', function(){});
             }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart('s', 'str'); }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart('s', null);  }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart('s', NaN);   }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart('s', []);    }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart('s', {});    }).toThrow(message);
            expect(function() { $translatePartialLoader.deletePart('s', 2);     }).toThrow(message);
          });
        });
      
        it('should be chainable if called with args', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.deletePart('part')).toEqual($provider);
          });
        });
        
        it('should delete a target part', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.deletePart('part');
            expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
          });
        });
        
        it('should delete a target part if a second arg is true', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.deletePart('part', true);
            expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
          });
        });
        
        it('should delete a target part if a second arg is false', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.deletePart('part', false);
            expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
          });
        });
        
        it('shouldn\'t throw an error if a target part is not present', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $translatePartialLoader.deletePart('part');
            }).not.toThrow();
          });
        });
        
        it('shouldn\'t broadcast any event if called without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            try { $translatePartialLoader.deletePart(); } catch (e) {}
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('should broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if a target part is deleted', function() {
          inject(function($translatePartialLoader, $rootScope) {
            $translatePartialLoader.addPart('part');
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.deletePart('part');
            expect($rootScope.$broadcast)
              .toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
          });
        });
        
        it('shouldn\'t broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if a target part is not present', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.deletePart('part');
            expect($rootScope.$broadcast)
              .not.toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
          });
        });
        
        it('shouldn\'t broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if a target part was deleted bedore and not added again', function() {
          inject(function($translatePartialLoader, $rootScope) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.deletePart('part');
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.deletePart('part');
            expect($rootScope.$broadcast)
              .not.toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
          });
        });
        
        it('shouldn\'t affect on other parts', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part1').addPart('part3');
            var isPart1 = $translatePartialLoader.isPartAvailable('part1'),
                isPart2 = $translatePartialLoader.isPartAvailable('part2');
            
            $translatePartialLoader.deletePart('part3');
            
            expect($translatePartialLoader.isPartAvailable('part1')).toEqual(isPart1);
            expect($translatePartialLoader.isPartAvailable('part2')).toEqual(isPart2);
          });
        });
      
      });
    
    
      describe('isPartAvailable()', function() {
        
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.isPartAvailable).toBeDefined();
          });
        });
      
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $translatePartialLoader.isPartAvailable).toBe('function');
          });
        });
        
        it('should throw an error if called without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $translatePartialLoader.isPartAvailable();
            }).toThrow('Couldn\'t check any part, no part name is specified!');
          });
        });
      
        it('should throw an error if a given arg is not a string', function() {
          inject(function($translatePartialLoader) {
            var message = 'Invalid type of a first argument, string expected.';
            expect(function() { 
              $translatePartialLoader.isPartAvailable(function(){}); 
            }).toThrow(message);
            expect(function() { $translatePartialLoader.isPartAvailable(false); }).toThrow(message);
            expect(function() { $translatePartialLoader.isPartAvailable(null);  }).toThrow(message);
            expect(function() { $translatePartialLoader.isPartAvailable(NaN);   }).toThrow(message);
            expect(function() { $translatePartialLoader.isPartAvailable([]);    }).toThrow(message);
            expect(function() { $translatePartialLoader.isPartAvailable({});    }).toThrow(message);
            expect(function() { $translatePartialLoader.isPartAvailable(2);     }).toThrow(message);
          });
        });
      
        it('should return true if a target part was added', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            expect($translatePartialLoader.isPartAvailable('part')).toEqual(true);
          });
        });
      
        it('should return false if a target part was not added', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
          });
        });
        
        it('should return false if a target part was deleted', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.deletePart('part');
            expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
          });
        });
        
      });
      
      
      
      
      describe('instance', function() {
        
        // URL
        describe('', function() {
        
          it('should parse url template if it is passed through an options object', function() {
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({
                key : 'en',
                urlTemplate : '/locales/{part}-{lang}.json'
              });
              
              $httpBackend.flush();
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should parse url template if it passed through a provider', function() {
            module(function($translatePartialLoaderProvider) {
              $translatePartialLoaderProvider.urlTemplate('/locales/{part}-{lang}.json');
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({
                key : 'en'
              });
              
              $httpBackend.flush();
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should parse url template from an options object, if it is passed both through ' +
             'a provider and through the options object', function() {
            module(function($translatePartialLoaderProvider) {
              $translatePartialLoaderProvider.urlTemplate('/locales/{lang}-{part}.json');
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({
                key : 'en',
                urlTemplate : '/locales/{part}-{lang}.json'
              });
              
              $httpBackend.flush();
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should throw an error if a urlTemplate is not specified', function() {
            inject(function($translatePartialLoader) {
              $translatePartialLoader.addPart('part');
              expect(function() {
                $translatePartialLoader({
                  key : 'en'
                });
              }).toThrow('Unable to load data, a urlTemplate is not specified.');
            });
          });
        
          it('should throw an error if a urlTemplate is not a string', function() {
            inject(function($translatePartialLoader) {
              var message = 'Unable to load data, a urlTemplate is not a string.';
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  urlTemplate : function(){} 
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({ 
                  key : 'k',
                  urlTemplate : false
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  urlTemplate : null
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  urlTemplate : NaN
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  urlTemplate : []
                });
              }).toThrow(message);
              expect(function() {
                $translatePartialLoader({
                  key : 'k',
                  urlTemplate : {}
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  urlTemplate : 2
                });
              }).toThrow(message);
            });
          });
        
          it('should throw an error if a key is not passed', function() {
            inject(function($translatePartialLoader) {
              $translatePartialLoader.addPart('part');
              expect(function() {
                $translatePartialLoader({
                  urlTemplate : '/locales/{part}-{lang}.json'
                });
              }).toThrow('Unable to load data, a key is not specified.');
            });
          });
          
          it('should throw an error if a key is not a string', function() {
            module(function($translatePartialLoaderProvider){
              $translatePartialLoaderProvider.urlTemplate('/locales/{part}-{lang}.json');
            });
            
            inject(function($translatePartialLoader) {
              var message = 'Unable to load data, a key is not a string.';
              expect(function() { 
                $translatePartialLoader({ key : function(){} });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({ key : false });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({ key : null });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({ key : NaN });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({ key : [] });
              }).toThrow(message);
              expect(function() {
                $translatePartialLoader({ key : {} });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({ key : 2 });
              }).toThrow(message);
            });
          });
        
        });
        
        
        // Requests
        describe('', function() {
        
          it('should make 1 request to get 1 part', function() {
            module(function($httpProvider) {
              $httpProvider.interceptors.push(CounterHttpInterceptor);
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({
                key : 'en',
                urlTemplate : '/locales/{part}-{lang}.json'
              });
              $httpBackend.flush();
              
              expect(counter).toEqual(1);
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should make 1 request per 1 part', function() {
            module(function($httpProvider) {
              $httpProvider.interceptors.push(CounterHttpInterceptor);
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part1-en.json').respond(200, '{}');
              $httpBackend.expectGET('/locales/part2-en.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part1');
              $translatePartialLoader.addPart('part2');
              $translatePartialLoader({
                key : 'en',
                urlTemplate : '/locales/{part}-{lang}.json'
              });
              $httpBackend.flush(2);
              
              expect(counter).toEqual(2);
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('shouldn\'t make requests to get deleted parts', function() {
            module(function($httpProvider) {
              $httpProvider.interceptors.push(ThrowErrorHttpInterceptor);
            });
            
            inject(function($translatePartialLoader) {
              $translatePartialLoader.addPart('part');
              $translatePartialLoader.deletePart('part');
              expect(function(){
                $translatePartialLoader({
                  key : 'en',
                  urlTemplate : '/locales/{part}-{lang}.json'
                });
              }).not.toThrow('$http service was used!');
            });
          });
          
          it('shouldn\'t load the same part twice for one language', function() {
            module(function($httpProvider, $translatePartialLoaderProvider) {
              $httpProvider.interceptors.push(CounterHttpInterceptor);
              $translatePartialLoaderProvider.urlTemplate('/locales/{part}-{lang}.json');
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ key : 'en' });
              $httpBackend.flush();
              
              $translatePartialLoader({ key : 'en' });
              $httpBackend.flush();
              
              expect(counter).toEqual(1);
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('shouldn\'t load a part if it was loaded, deleted (second arg is false or not ' +
             ' passed) and added again', function() {
            module(function($httpProvider, $translatePartialLoaderProvider) {
              $httpProvider.interceptors.push(CounterHttpInterceptor);
              $translatePartialLoaderProvider.urlTemplate('/locales/{part}-{lang}.json');
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.whenGET('/locales/part-en.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ key : 'en' });
              $httpBackend.flush();
              
              $translatePartialLoader.deletePart('part');
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ key : 'en' });
              $httpBackend.flush();
              
              expect(counter).toEqual(1);
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should load a part if it was loaded, deleted (second arg is true) and added again', 
          function() {
            module(function($httpProvider, $translatePartialLoaderProvider) {
              $httpProvider.interceptors.push(CounterHttpInterceptor);
              $translatePartialLoaderProvider.urlTemplate('/locales/{part}-{lang}.json');
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.whenGET('/locales/part-en.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ key : 'en' });
              $httpBackend.flush();
              
              $translatePartialLoader.deletePart('part', true);
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ key : 'en' });
              $httpBackend.flush();
              
              expect(counter).toEqual(1);
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should load the same part for different languages', function() {
            module(function($httpProvider, $translatePartialLoaderProvider) {
              $httpProvider.interceptors.push(CounterHttpInterceptor);
              $translatePartialLoaderProvider.urlTemplate('/locales/{part}-{lang}.json');
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
              $httpBackend.expectGET('/locales/part-ne.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ key : 'en' });
              $httpBackend.flush();
              $translatePartialLoader({ key : 'ne' });
              $httpBackend.flush();
              
              expect(counter).toEqual(2);
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
        });
        

        // Return value
        describe('', function() {
        
          it('should return a promise', function() {
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
              
              $translatePartialLoader.addPart('part');
              var promise = $translatePartialLoader({
                key : 'en',
                urlTemplate : '/locales/{part}-{lang}.json'
              });
              
              expect(promise.then).toBeDefined();
              expect(typeof promise.then).toBe('function');
              
              $httpBackend.flush();
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should merge parts before resolving a promise', function() {
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part1-en.json').respond(200, '{"foo":"foo"}');
              $httpBackend.expectGET('/locales/part2-en.json').respond(200, '{"bar":"bar"}');
              
              var table = {};
              
              $translatePartialLoader.addPart('part1');
              $translatePartialLoader.addPart('part2');
              $translatePartialLoader({
                key : 'en',
                urlTemplate : '/locales/{part}-{lang}.json'
              }).then(function(data) {
                angular.extend(table, data);
              });
              $httpBackend.flush();

              expect(table.foo).toBeDefined();
              expect(table.foo).toEqual('foo');
              expect(table.bar).toBeDefined();
              expect(table.bar).toEqual('bar');
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should reject promise with language key if error occurred', function() {
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.expectGET('/locales/part-en.json').respond(404, 'File not found');
              
              var key = undefined;
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({
                key : 'en',
                urlTemplate : '/locales/{part}-{lang}.json'
              }).then(
                function() {},
                function(_key) { key = _key; }
              );
              $httpBackend.flush();
              
              expect(key).toEqual('en');
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
        });
        
        
        // Error handling
        describe('when error occurred', function() {
          
          beforeEach(module(function($translatePartialLoaderProvider) {
            $translatePartialLoaderProvider.urlTemplate('/locales/{part}-{lang}.json');
          }));
          
          
          it('should throw an error if a loadFailureHandler is not a string or undefined',
          function() {
            inject(function($translatePartialLoader) {
              var message = 'Unable to load data, a loadFailureHandler is not a string.';
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  loadFailureHandler : function(){} 
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({ 
                  key : 'k',
                  loadFailureHandler : false
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  loadFailureHandler : null
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  loadFailureHandler : NaN
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  loadFailureHandler : []
                });
              }).toThrow(message);
              expect(function() {
                $translatePartialLoader({
                  key : 'k',
                  loadFailureHandler : {}
                });
              }).toThrow(message);
              expect(function() { 
                $translatePartialLoader({
                  key : 'k',
                  loadFailureHandler : 2
                });
              }).toThrow(message);
            });
          });          
          
          it('should reject a resulting promise by default', function() {
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.whenGET('/locales/part-en.json').respond(404, 'File not found');
              var promise = undefined;
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ key : 'en' }).then(
                function() { promise = 'resolved'; },
                function() { promise = 'rejected'; }
              );
              $httpBackend.flush();
              
              expect(promise).toEqual('rejected');
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should use a handler passed to provider', function() {
            module(function($translatePartialLoaderProvider) {
              $translatePartialLoaderProvider.useLoadFailureHandler('ResolveErrorHandler');
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.whenGET('/locales/part-en.json').respond(404, 'File not found');
              var promise = undefined;
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ key : 'en' }).then(
                function() { promise = 'resolved'; },
                function() { promise = 'rejected'; }
              );
              $httpBackend.flush();
              
              expect(resolveHandlerCounter).toEqual(1);
              expect(promise).toEqual('resolved');
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should use a handler passed to options object', function() {
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.whenGET('/locales/part-en.json').respond(404, 'File not found');
              var promise = undefined;
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ 
                key : 'en',
                loadFailureHandler : 'ResolveErrorHandler'
              }).then(
                function() { promise = 'resolved'; },
                function() { promise = 'rejected'; }
              );
              $httpBackend.flush();
              
              expect(resolveHandlerCounter).toEqual(1);
              expect(promise).toEqual('resolved');
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should prefer a handler passed to options object', function() {
            module(function($translatePartialLoaderProvider) {
              $translatePartialLoaderProvider.useLoadFailureHandler('RejectErrorHandler');
            });
            
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.whenGET('/locales/part-en.json').respond(404, 'File not found');
              var promise = undefined;
              
              $translatePartialLoader.addPart('part');
              $translatePartialLoader({ 
                key : 'en',
                loadFailureHandler : 'ResolveErrorHandler'
              }).then(
                function() { promise = 'resolved'; },
                function() { promise = 'rejected'; }
              );
              $httpBackend.flush();
              
              expect(resolveHandlerCounter).toEqual(1);
              expect(rejectHandlerCounter).toEqual(0);
              expect(promise).toEqual('resolved');
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should reject a loading process, if at least one handler rejects it\'s promise',
          function() {
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.whenGET('/locales/part1-en.json').respond(200, '{"bar":"bar"}');
              $httpBackend.whenGET('/locales/part2-en.json').respond(404, 'File not found');
              var promise = undefined;
              
              $translatePartialLoader.addPart('part1');
              $translatePartialLoader.addPart('part2');
              $translatePartialLoader({ 
                key : 'en',
                loadFailureHandler : 'RejectErrorHandler'
              }).then(
                function() { promise = 'resolved'; },
                function() { promise = 'rejected'; }
              );
              $httpBackend.flush();
              
              expect(resolveHandlerCounter).toEqual(1);
              expect(rejectHandlerCounter).toEqual(0);
              expect(promise).toEqual('rejected');
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should resolve a loading process, if all handlers resolves their promises',
          function() {
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.whenGET('/locales/part1-en.json').respond(404, 'File not found');
              $httpBackend.whenGET('/locales/part2-en.json').respond(404, 'File not found');
              var promise = undefined;
              
              $translatePartialLoader.addPart('part1');
              $translatePartialLoader.addPart('part2');
              $translatePartialLoader({ 
                key : 'en',
                loadFailureHandler : 'ResolveErrorHandler'
              }).then(
                function() { promise = 'resolved'; },
                function() { promise = 'rejected'; }
              );
              $httpBackend.flush();
              
              expect(resolveHandlerCounter).toEqual(2);
              expect(promise).toEqual('resolved');
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
          it('should use a data from resolved handler\'s promise instead of data from $http',
          function() {
            inject(function($translatePartialLoader, $httpBackend) {
              $httpBackend.whenGET('/locales/part1-en.json').respond(200, '{"bar":"bar"}');
              $httpBackend.whenGET('/locales/part2-en.json').respond(404, 'File not found');
              var data = {};
              
              $translatePartialLoader.addPart('part1');
              $translatePartialLoader.addPart('part2');
              $translatePartialLoader({
                key : 'en',
                loadFailureHandler : 'ResolveErrorHandler'
              }).then(
                function(_data) { data = _data; },
                function(_data) { data = _data; }
              );
              $httpBackend.flush();
              
              expect(resolveHandlerCounter).toEqual(1);
              expect(data).toEqual({
                bar : 'bar',
                foo : 'foo'
              });
              
              $httpBackend.verifyNoOutstandingExpectation();
              $httpBackend.verifyNoOutstandingRequest();
            });
          });
          
        });
        
      });
      
    });
    
  });

});
