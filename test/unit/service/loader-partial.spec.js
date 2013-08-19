describe('pascalprecht.translate', function() {

  describe('$translatePartialLoader', function() {
/*
Target API:
$translatePartialLoader {
 provider:
  addPart(partName);                          // chainable
  deletePart(partName);                       // chainable
  isPartAvailable(partName);
  template(optional tpl);                     // getter/setter
  useLoadFailureHandler(serviceFactoryName);  // will be used to handle situations when some part
                                                  was not loaded from server due to loading error.
                                                  Required API:
                                                    promise function(partName, language)
                                                    if the handler resolves a returned promise, this
                                                    part will be also resolved in loader, in other
                                                    case a whole loading process will be rejected
                                                    due to loading error
 service:
  $get()                                      // real data loading
                                                  will return a function(options)
                                                  where options could contain such params as:
                                                    key - a kay of a needed language
                                                    tpl - a template for target URL
                                                    errorHandler - a name of the service for loading
                                                                   errors handling
  addPart(partName);                          // chainable
  deletePart(partName, optional removeData);  // chainable
  isPartAvailable(partName);
}
*/
    beforeEach(module('pascalprecht.translate'));
    
    var counter;
    
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
        
        it('should be chainable with args', function() {
          inject(function($translatePartialLoader) {
            expect($provider.addPart('part')).toEqual($provider);
          });
        });
        
        it('should throw an error without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.addPart();
            }).toThrow('Couldn\'t add a new part, no part name is specified!');
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
        
        it('should add a part', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            expect($provider.isPartPresent('part')).toEqual(true);
          });
        });
        
        it('should add an active part if second arg is not passed', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should add an active part if second arg is true', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part', true);
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should add a not active part if second arg is false', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part', false);
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should make existent part active if called with the same name ' +
           'and without second arg', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part', false);
            $provider.addPart('part');
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should make existent part active if called with the same name ' +
           'and second is true', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part', false);
            $provider.addPart('part', true);
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should keep existent active part as "active" if called with the same name ' +
           'and second is false', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            $provider.addPart('part', false);
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should keep existent not active part as "not active" if called with the same name ' +
           'and second is false', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part', false);
            $provider.addPart('part', false);
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should keep existent active part as "active" if called with the same name ' +
           'and second is true', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            $provider.addPart('part', true);
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should keep existent active part as "active" if called with the same name ' +
           'and without second arg', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            $provider.addPart('part');
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(true);
          });
        });
        
        it('shouldn\'t broadcast any event without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            try { $provider.addPart(); } catch (e) {}
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event with args', function() {
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
        
        it('shouldn\'t affect on other parts if second arg is not passed', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part1').addPart('part2', false);
            var isPresentPart1 = $provider.isPartPresent('part1'),
                isPresentPart2 = $provider.isPartPresent('part2'),
                isPresentPart4 = $provider.isPartPresent('part4'),
                isActivePart1 = $provider.isPartActive('part1'),
                isActivePart2 = $provider.isPartActive('part2'),
                isActivePart4 = $provider.isPartActive('part4');
            
            $provider.addPart('part3');
            
            expect($provider.isPartPresent('part1')).toEqual(isPresentPart1);
            expect($provider.isPartPresent('part2')).toEqual(isPresentPart2);
            expect($provider.isPartPresent('part4')).toEqual(isPresentPart4);
            expect($provider.isPartActive('part1')).toEqual(isActivePart1);
            expect($provider.isPartActive('part2')).toEqual(isActivePart2);
            expect($provider.isPartActive('part4')).toEqual(isActivePart4);
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
        
        it('should be chainable with args', function() {
          inject(function($translatePartialLoader) {
            expect($provider.deletePart('part')).toEqual($provider);
          });
        });
      
        it('should throw an error without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.deletePart();
            }).toThrow('Couldn\'t delete any part, no part name is specified!');
          });
        });
        
        it('shouldn\'t throw an error if target part is not present', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $provider.deletePart('part');
            }).not.toThrow();
          });
        });
        
        it('shouldn\'t broadcast any event without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            try { $provider.deletePart(); } catch (e) {}
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event with args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $provider.deletePart('part');
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
      
        it('should make target part not active if second arg is not passed', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            $provider.deletePart('part');
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should make target part not active if second arg is false', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            $provider.deletePart('part', false);
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should delete target part if second arg is true', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            $provider.deletePart('part', true);
            expect($provider.isPartPresent('part')).toEqual(false);
          });
        });
        
        it('should keep existent not active part as "not active" if called with the same name ' +
           'and without second arg', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part', false);
            $provider.deletePart('part');
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should keep existent not active part as "not active" if called with the same name ' +
           'and second arg is false', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part', false);
            $provider.deletePart('part', false);
            expect($provider.isPartPresent('part')).toEqual(true);
            expect($provider.isPartActive('part')).toEqual(false);
          });
        });
        
        it('shouldn\'t affect on other parts if second arg is not passed', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part1').addPart('part2', false).addPart('part3');
            var isPresentPart1 = $provider.isPartPresent('part1'),
                isPresentPart2 = $provider.isPartPresent('part2'),
                isPresentPart4 = $provider.isPartPresent('part4'),
                isActivePart1 = $provider.isPartActive('part1'),
                isActivePart2 = $provider.isPartActive('part2'),
                isActivePart4 = $provider.isPartActive('part4');
            
            $provider.deletePart('part3');
            
            expect($provider.isPartPresent('part1')).toEqual(isPresentPart1);
            expect($provider.isPartPresent('part2')).toEqual(isPresentPart2);
            expect($provider.isPartPresent('part4')).toEqual(isPresentPart4);
            expect($provider.isPartActive('part1')).toEqual(isActivePart1);
            expect($provider.isPartActive('part2')).toEqual(isActivePart2);
            expect($provider.isPartActive('part4')).toEqual(isActivePart4);
          });
        });
        
      });
      
      
      describe('isPartPresent()', function() {
      
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($provider.isPartPresent).toBeDefined();
          });
        });
      
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $provider.isPartPresent).toBe('function');
          });
        });
        
        it('should return true if target part is present and active', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            expect($provider.isPartPresent('part')).toEqual(true);
          });
        });
        
        it('should return true if target part is present and not active', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part').deletePart('part');
            expect($provider.isPartPresent('part')).toEqual(true);
          });
        });
        
        it('should return false if target part is not present', function() {
          inject(function($translatePartialLoader) {
            expect($provider.isPartPresent('part')).toEqual(false);
          });
        });
        
        it('should return false if target part was deleted', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part').deletePart('part', true);
            expect($provider.isPartPresent('part')).toEqual(false);
          });
        });
        
        it('should return false if no part is passed', function() {
          inject(function($translatePartialLoader) {
            expect($provider.isPartPresent()).toEqual(false);
          });
        });
        
        it('shouldn\'t broadcast any event with args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $provider.isPartPresent('part');
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $provider.isPartPresent();
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t affect on part\'s present-status', function() {
          inject(function($translatePartialLoader) {
            expect($provider.isPartPresent('part')).toEqual($provider.isPartPresent('part'));
            $provider.addPart('part');
            expect($provider.isPartPresent('part')).toEqual($provider.isPartPresent('part'));
          });
        });
        
        it('shouldn\'t affect on part\'s active-status', function() {
          inject(function($translatePartialLoader) {
            var prev;
            
            $provider.addPart('part');
            prev = $provider.isPartActive('part');
            $provider.isPartPresent('part');
            expect($provider.isPartActive('part')).toEqual(prev);
            
            $provider.deletePart('part');
            prev = $provider.isPartActive('part');
            $provider.isPartPresent('part');
            expect($provider.isPartActive('part')).toEqual(prev);
          });
        });
        
      });
      
      
      describe('isPartActive()', function() {
        
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($provider.isPartActive).toBeDefined();
          });
        });
        
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $provider.isPartActive).toBe('function');
          });
        });
        
        it('should return true if target part is present and active', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            expect($provider.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should return false if target part is present and not active', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part').deletePart('part');
            expect($provider.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should return false if target part was deleted', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part').deletePart('part', true);
            expect($provider.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should return false if target part is not present', function() {
          inject(function($translatePartialLoader) {
            expect($provider.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should return false if not part is passed', function() {
          inject(function($translatePartialLoader) {
            expect($provider.isPartActive()).toEqual(false);
          });
        });
        
        it('shouldn\'t broadcast any event with args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $provider.isPartActive('part');
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $provider.isPartActive();
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t affect on part\'s present-status', function() {
          inject(function($translatePartialLoader) {
            var prev;
            
            $provider.addPart('part');
            prev = $provider.isPartPresent('part');
            $provider.isPartActive('part');
            expect($provider.isPartPresent('part')).toEqual(prev);
            
            $provider.deletePart('part', true);
            prev = $provider.isPartPresent('part');
            $provider.isPartActive('part');
            expect($provider.isPartPresent('part')).toEqual(prev);
          });
        });
        
        it('shouldn\'t affect on part\'s active-status', function() {
          inject(function($translatePartialLoader) {
            $provider.addPart('part');
            expect($provider.isPartActive('part')).toEqual($provider.isPartActive('part'));
            $provider.deletePart('part');
            expect($provider.isPartActive('part')).toEqual($provider.isPartActive('part'));
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
        
        it('should be chainable with args', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.addPart('part')).toEqual($translatePartialLoader);
          });
        });
        
        it('should throw an error without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $translatePartialLoader.addPart();
            }).toThrow('Couldn\'t add a new part, no part name is specified!');
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
        
        it('should add a part', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
          });
        });
        
        it('should add an active part if second arg is not passed', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should add an active part if second arg is true', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part', true);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should add a not active part if second arg is false', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part', false);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should make existent part active if called with the same name ' +
           'and without second arg', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part', false);
            $translatePartialLoader.addPart('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should make existent part active if called with the same name ' +
           'and second is true', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part', false);
            $translatePartialLoader.addPart('part', true);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should keep existent active part as "active" if called with the same name ' +
           'and second is false', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.addPart('part', false);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should keep existent not active part as "not active" if called with the same name ' +
           'and second is false', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part', false);
            $translatePartialLoader.addPart('part', false);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should keep existent active part as "active" if called with the same name ' +
           'and second is true', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.addPart('part', true);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should keep existent active part as "active" if called with the same name ' +
           'and without second arg', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.addPart('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(true);
          });
        });
        
        it('shouldn\'t broadcast any event without args', function() {
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
           'if the same active part is added again', function() {
          inject(function($translatePartialLoader, $rootScope) {
            $translatePartialLoader.addPart('part');
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.addPart('part');
            expect($rootScope.$broadcast)
              .not.toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
          });
        });
        
        it('shouldn\'t broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if the same not active part is added again', function() {
          inject(function($translatePartialLoader, $rootScope) {
            $translatePartialLoader.addPart('part', false);
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.addPart('part', false);
            expect($rootScope.$broadcast)
              .not.toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
          });
        });
        
        it('should broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if a target part changes active-status', function() {
          inject(function($translatePartialLoader, $rootScope) {
            $translatePartialLoader.addPart('part', false);
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
        
        it('shouldn\'t affect on other parts if second arg is not passed', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part1').addPart('part2', false);
            var isPresentPart1 = $translatePartialLoader.isPartPresent('part1'),
                isPresentPart2 = $translatePartialLoader.isPartPresent('part2'),
                isPresentPart4 = $translatePartialLoader.isPartPresent('part4'),
                isActivePart1 = $translatePartialLoader.isPartActive('part1'),
                isActivePart2 = $translatePartialLoader.isPartActive('part2'),
                isActivePart4 = $translatePartialLoader.isPartActive('part4');
            
            $translatePartialLoader.addPart('part3');
            
            expect($translatePartialLoader.isPartPresent('part1')).toEqual(isPresentPart1);
            expect($translatePartialLoader.isPartPresent('part2')).toEqual(isPresentPart2);
            expect($translatePartialLoader.isPartPresent('part4')).toEqual(isPresentPart4);
            expect($translatePartialLoader.isPartActive('part1')).toEqual(isActivePart1);
            expect($translatePartialLoader.isPartActive('part2')).toEqual(isActivePart2);
            expect($translatePartialLoader.isPartActive('part4')).toEqual(isActivePart4);
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
        
        it('should be chainable without args', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.deletePart()).toEqual($translatePartialLoader);
          });
        });
        
        it('should throw an error without args', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $translatePartialLoader.deletePart();
            }).toThrow('Couldn\'t delete any part, no part name is specified!');
          });
        });
        
        it('shouldn\'t throw an error if target part is not present', function() {
          inject(function($translatePartialLoader) {
            expect(function() {
              $translatePartialLoader.deletePart('part');
            }).not.toThrow();
          });
        });
        
        it('should make target part not active if second arg is not passed', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.deletePart('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should make target part not active if second arg is false', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.deletePart('part', false);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should delete target part if second arg is true', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            $translatePartialLoader.deletePart('part', true);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(false);
          });
        });
        
        it('should keep existent not active part as "not active" if called with the same name ' +
           'and without second arg', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part', false);
            $translatePartialLoader.deletePart('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should keep existent not active part as "not active" if called with the same name ' +
           'and second arg is false', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part', false);
            $translatePartialLoader.deletePart('part', false);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(false);
          });
        });
        
        it('shouldn\'t broadcast any event without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            try { $translatePartialLoader.deletePart(); } catch (e) {}
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('should broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if a target part changes active-status', function() {
          inject(function($translatePartialLoader, $rootScope) {
            $translatePartialLoader.addPart('part');
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.deletePart('part');
            expect($rootScope.$broadcast)
              .toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
          });
        });
        
        it('should broadcast a $translatePartialLoaderStructureChanged event ' + 
           'if a target part is deleted', function() {
          inject(function($translatePartialLoader, $rootScope) {
            $translatePartialLoader.addPart('part');
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.deletePart('part', true);
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
        
        it('shouldn\'t affect on other parts if second arg is not passed', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part1').addPart('part2', false).addPart('part3');
            var isPresentPart1 = $translatePartialLoader.isPartPresent('part1'),
                isPresentPart2 = $translatePartialLoader.isPartPresent('part2'),
                isPresentPart4 = $translatePartialLoader.isPartPresent('part4'),
                isActivePart1 = $translatePartialLoader.isPartActive('part1'),
                isActivePart2 = $translatePartialLoader.isPartActive('part2'),
                isActivePart4 = $translatePartialLoader.isPartActive('part4');
            
            $translatePartialLoader.deletePart('part3');
            
            expect($translatePartialLoader.isPartPresent('part1')).toEqual(isPresentPart1);
            expect($translatePartialLoader.isPartPresent('part2')).toEqual(isPresentPart2);
            expect($translatePartialLoader.isPartPresent('part4')).toEqual(isPresentPart4);
            expect($translatePartialLoader.isPartActive('part1')).toEqual(isActivePart1);
            expect($translatePartialLoader.isPartActive('part2')).toEqual(isActivePart2);
            expect($translatePartialLoader.isPartActive('part4')).toEqual(isActivePart4);
          });
        });
        
      });
    
    
      describe('isPartPresent()', function() {
        
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.isPartPresent).toBeDefined();
          });
        });
        
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $translatePartialLoader.isPartPresent).toBe('function');
          });
        });
        
        it('should return true if target part is present and active', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
          });
        });
        
        it('should return true if target part is present and not active', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part').deletePart('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(true);
          });
        });
        
        it('should return false if target part is not present', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.isPartPresent('part')).toEqual(false);
          });
        });
        
        it('should return false if target part was deleted', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part').deletePart('part', true);
            expect($translatePartialLoader.isPartPresent('part')).toEqual(false);
          });
        });
        
        it('should return false if no part is passed', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.isPartPresent()).toEqual(false);
          });
        });
        
        it('shouldn\'t broadcast any event with args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.isPartPresent('part');
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.isPartPresent();
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t affect on part\'s present-status', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.isPartPresent('part'))
              .toEqual($translatePartialLoader.isPartPresent('part'));
              
            $translatePartialLoader.addPart('part');
            
            expect($translatePartialLoader.isPartPresent('part'))
              .toEqual($translatePartialLoader.isPartPresent('part'));
          });
        });
        
        it('shouldn\'t affect on part\'s active-status', function() {
          inject(function($translatePartialLoader) {
            var prev;
            
            $translatePartialLoader.addPart('part');
            prev = $translatePartialLoader.isPartActive('part');
            $translatePartialLoader.isPartPresent('part');
            expect($translatePartialLoader.isPartActive('part')).toEqual(prev);
            
            $translatePartialLoader.deletePart('part');
            prev = $translatePartialLoader.isPartActive('part');
            $translatePartialLoader.isPartPresent('part');
            expect($translatePartialLoader.isPartActive('part')).toEqual(prev);
          });
        });
        
      });
      
      
      describe('isPartActive()', function() {
      
        it('should be defined', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.isPartActive).toBeDefined();
          });
        });
        
        it('should be a function', function() {
          inject(function($translatePartialLoader) {
            expect(typeof $translatePartialLoader.isPartActive).toBe('function');
          });
        });
      
        it('should return true if target part is present and active', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            expect($translatePartialLoader.isPartActive('part')).toEqual(true);
          });
        });
        
        it('should return false if target part is present and not active', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part').deletePart('part');
            expect($translatePartialLoader.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should return false if target part was deleted', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part').deletePart('part', true);
            expect($translatePartialLoader.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should return false if target part is not present', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.isPartActive('part')).toEqual(false);
          });
        });
        
        it('should return false if not part is passed', function() {
          inject(function($translatePartialLoader) {
            expect($translatePartialLoader.isPartActive()).toEqual(false);
          });
        });
        
        it('shouldn\'t broadcast any event with args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.isPartActive('part');
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t broadcast any event without args', function() {
          inject(function($translatePartialLoader, $rootScope) {
            spyOn($rootScope, '$broadcast');
            $translatePartialLoader.isPartActive();
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
          });
        });
        
        it('shouldn\'t affect on part\'s present-status', function() {
          inject(function($translatePartialLoader) {
            var prev;
            
            $translatePartialLoader.addPart('part');
            prev = $translatePartialLoader.isPartPresent('part');
            $translatePartialLoader.isPartActive('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(prev);
            
            $translatePartialLoader.deletePart('part', true);
            prev = $translatePartialLoader.isPartPresent('part');
            $translatePartialLoader.isPartActive('part');
            expect($translatePartialLoader.isPartPresent('part')).toEqual(prev);
          });
        });
        
        it('shouldn\'t affect on part\'s active-status', function() {
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part');
            
            expect($translatePartialLoader.isPartActive('part'))
              .toEqual($translatePartialLoader.isPartActive('part'));
              
            $translatePartialLoader.deletePart('part');
            
            expect($translatePartialLoader.isPartActive('part'))
              .toEqual($translatePartialLoader.isPartActive('part'));
          });
        });
      
      });
      
      
      
      
      describe('instance', function() {
        
        it('should parse url template correctly', function() {
          inject(function($translatePartialLoader, $httpBackend) {
            $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
            
            $translatePartialLoader.addPart('part');
            $translatePartialLoader({
              key : 'en',
              tpl : '/locales/{part}-{lang}.json'
            });
            
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
          });
        });
        
        it('should make 1 request to get 1 part', function() {
          counter = 0;
          
          module(function($httpProvider) {
            $httpProvider.interceptors.push(CounterHttpInterceptor);
          });
          
          inject(function($translatePartialLoader, $httpBackend) {
            $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
            
            $translatePartialLoader.addPart('part');
            $translatePartialLoader({
              key : 'en',
              tpl : '/locales/{part}-{lang}.json'
            });
            $httpBackend.flush();
            
            expect(counter).toEqual(1);
            
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
          });
        });
        
        it('should make 1 request per 1 part', function() {
          counter = 0;
          
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
              tpl : '/locales/{part}-{lang}.json'
            });
            $httpBackend.flush(2);
            
            expect(counter).toEqual(2);
            
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
          });
        });
        
        it('shouldn\'t make requests to get not active parts', function() {
          module(function($httpProvider) {
            $httpProvider.interceptors.push(ThrowErrorHttpInterceptor);
          });
          
          inject(function($translatePartialLoader) {
            $translatePartialLoader.addPart('part', false);
            expect(function(){
              $translatePartialLoader({
                key : 'en',
                tpl : '/locales/{part}-{lang}.json'
              });
            }).not.toThrow('$http service was used!');
          });
        });
        
        it('shouldn\'t load the same part twice for one language', function() {
          counter = 0;
        
          module(function($httpProvider) {
            $httpProvider.interceptors.push(CounterHttpInterceptor);
          });
          
          inject(function($translatePartialLoader, $httpBackend) {
            $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
            
            $translatePartialLoader.addPart('part');
            $translatePartialLoader({
              key : 'en',
              tpl : '/locales/{part}-{lang}.json'
            });
            $httpBackend.flush();
            $translatePartialLoader({
              key : 'en',
              tpl : '/locales/{part}-{lang}.json'
            });
            $httpBackend.flush();
            
            expect(counter).toEqual(1);
            
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
          });
        });
        
        it('shouldn\'t load the same part for different languages', function() {
          counter = 0;
        
          module(function($httpProvider) {
            $httpProvider.interceptors.push(CounterHttpInterceptor);
          });
          
          inject(function($translatePartialLoader, $httpBackend) {
            $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
            $httpBackend.expectGET('/locales/part-ne.json').respond(200, '{}');
            
            $translatePartialLoader.addPart('part');
            $translatePartialLoader({
              key : 'en',
              tpl : '/locales/{part}-{lang}.json'
            });
            $httpBackend.flush();
            $translatePartialLoader({
              key : 'ne',
              tpl : '/locales/{part}-{lang}.json'
            });
            $httpBackend.flush();
            
            expect(counter).toEqual(2);
            
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
          });
        });
        
        it('should return a promise', function() {
          inject(function($translatePartialLoader, $httpBackend) {
            $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');
            
            $translatePartialLoader.addPart('part');
            var promise = $translatePartialLoader({
              key : 'en',
              tpl : '/locales/{part}-{lang}.json'
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
              tpl : '/locales/{part}-{lang}.json'
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
        
      });
      
    });
    
  });

});
