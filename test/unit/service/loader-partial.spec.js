describe('pascalprecht.translate', function() {

  describe('$translatePartialLoaderProvider', function () {

    var $provider;

    beforeEach(module('pascalprecht.translate', function ($translatePartialLoaderProvider) {
      $provider = $translatePartialLoaderProvider;
    }));

    describe('$translatePartialLoaderProvider#isPartAvailable', function () {

      it('should be defined', function () {
        inject(function ($translatePartialLoader) {
          expect($provider.isPartAvailable).toBeDefined();
        });
      });

      it('should be a function', function () {
        inject(function ($translatePartialLoader) {
          expect(typeof $provider.isPartAvailable).toBe('function');
        });
      });

      it('should return a boolean', function () {
        inject(function ($translatePartialLoader) {
          expect(typeof $provider.isPartAvailable('foo')).toBe('boolean');
        });
      });
    });

    describe('$translatePartialLoaderProvider#addPart', function () {

      it('should be defined',function () {
        inject(function ($translatePartialLoader) {
          expect($provider.addPart).toBeDefined();
        });
      });

      it('should be a function', function () {
        inject(function ($translatePartialLoader) {
          expect(typeof $provider.addPart).toBe('function');
        });
      });

      it('should throw an error if given arg is not a string', function() {
        inject(function($translatePartialLoader) {
          var message = 'Couldn\'t add part, part name has to be a string!';
          expect(function() { $provider.addPart(function(){}); }).toThrow(message);
          expect(function() { $provider.addPart(false); }).toThrow(message);
          expect(function() { $provider.addPart(null); }).toThrow(message);
          expect(function() { $provider.addPart(NaN); }).toThrow(message);
          expect(function() { $provider.addPart([]); }).toThrow(message);
          expect(function() { $provider.addPart({}); }).toThrow(message);
          expect(function() { $provider.addPart(2); }).toThrow(message);
          expect(function() { $provider.addPart(); }).toThrow(message);
        });
      });

      it('should add a part', function() {
        inject(function($translatePartialLoader) {
          $provider.addPart('part');
          expect($provider.isPartAvailable('part')).toBe(true);
        });
      });

      it('should be chainable', function() {
        inject(function($translatePartialLoader) {
          expect($provider.addPart('part')).toEqual($provider);
        });
      });
    });

    describe('$translatePartialLoaderProvider#setPart', function () {

      it('should be defined', function() {
        inject(function($translatePartialLoader) {
          expect($provider.setPart).toBeDefined();
        });
      });

      it('should be a function', function() {
        inject(function($translatePartialLoader) {
          expect(typeof $provider.setPart).toBe('function');
        });
      });

      it('should throw an error if first arg is not a string', function() {
        inject(function($translatePartialLoader) {
          var message = 'Couldn\'t set part.`lang` parameter has to be a string!';
          expect(function() { $provider.setPart(function(){}); }).toThrow(message);
          expect(function() { $provider.setPart(false); }).toThrow(message);
          expect(function() { $provider.setPart(null); }).toThrow(message);
          expect(function() { $provider.setPart(NaN); }).toThrow(message);
          expect(function() { $provider.setPart([]); }).toThrow(message);
          expect(function() { $provider.setPart({}); }).toThrow(message);
          expect(function() { $provider.setPart(2); }).toThrow(message);
          expect(function() { $provider.setPart(); }).toThrow(message);
        });
      });

      it('should throw an error if a second arg is not a non-empty string', function() {
        inject(function($translatePartialLoader) {
          var message = 'Couldn\'t set part.`part` parameter has to be a string!';
          expect(function() { $provider.setPart('l', function(){}); }).toThrow(message);
          expect(function() { $provider.setPart('l', false); }).toThrow(message);
          expect(function() { $provider.setPart('l', null);  }).toThrow(message);
          expect(function() { $provider.setPart('l', NaN);   }).toThrow(message);
          expect(function() { $provider.setPart('l', []);    }).toThrow(message);
          expect(function() { $provider.setPart('l', {});    }).toThrow(message);
          expect(function() { $provider.setPart('l', 2);     }).toThrow(message);
          expect(function() { $provider.setPart('l');        }).toThrow(message);
        });
      });

      it('should throw an error if a third arg is not an object', function() {
        inject(function($translatePartialLoader) {
          var message = 'Couldn\'t set part. `table` parameter has to be an object!';
          expect(function() { $provider.setPart('l', 'p', function(){}); }).toThrow(message);
          expect(function() { $provider.setPart('l', 'p', false);}).toThrow(message);
          expect(function() { $provider.setPart('l', 'p', null); }).toThrow(message);
          expect(function() { $provider.setPart('l', 'p', NaN);  }).toThrow(message);
          expect(function() { $provider.setPart('l', 'p', 's');  }).toThrow(message);
          expect(function() { $provider.setPart('l', 'p', 2);    }).toThrow(message);
          expect(function() { $provider.setPart('l', 'p');       }).toThrow(message);
        });
      });

      it('should be chainable', function() {
        inject(function($translatePartialLoader) {
          expect($provider.setPart('lang', 'part', {})).toEqual($provider);
        });
      });

      it('should set a translation table statically', function() {
        inject(function($translatePartialLoader, $rootScope) {
          $provider.setPart('en', 'part', { foo : 'Foo' });
          $provider.addPart('part');

          var table;

          $translatePartialLoader({
            key : 'en',
            urlTemplate : '/locales/{part}-{lang}.json'
          }).then(function(data) {
            table = data;
          }, function() {
            table = {};
          });
          $rootScope.$digest();
          expect(table.foo).toBeDefined();
          expect(table.foo).toEqual('Foo');
        });
      });

      it('should override the translation table ', function() {
        inject(function($translatePartialLoader, $rootScope) {
          $provider.setPart('en', 'part', { foo : 'Foo' });
          $provider.setPart('en', 'part', { foo : 'Bar' });
          $provider.addPart('part');

          var table;
          $translatePartialLoader({
            key : 'en',
            urlTemplate : '/locales/{part}-{lang}.json'
          }).then(function(data) {
            table = data;
          }, function() {
            table = {};
          });
          $rootScope.$digest();
          expect(table.foo).toBeDefined();
          expect(table.foo).toEqual('Bar');
        });
      });
    });

    describe('$translatePartialLoader#deletePart', function () {

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

      it('should throw an error if a given arg is not a string', function() {
        inject(function($translatePartialLoader) {
          var message = 'Couldn\'t delete part, first arg has to be string.';
          expect(function() { $provider.deletePart(function(){}); }).toThrow(message);
          expect(function() { $provider.deletePart(false);}).toThrow(message);
          expect(function() { $provider.deletePart(null); }).toThrow(message);
          expect(function() { $provider.deletePart(NaN);  }).toThrow(message);
          expect(function() { $provider.deletePart([]);   }).toThrow(message);
          expect(function() { $provider.deletePart({});   }).toThrow(message);
          expect(function() { $provider.deletePart(2);    }).toThrow(message);
          expect(function() { $provider.deletePart();     }).toThrow(message);
        });
      });

      it('should be chainable', function() {
        inject(function($translatePartialLoader) {
          expect($provider.deletePart('part')).toEqual($provider);
        });
      });

      it('should delete a part', function() {
        inject(function($translatePartialLoader) {
          $provider.addPart('part');
          $provider.deletePart('part');
          expect($provider.isPartAvailable('part')).toEqual(false);
        });
      });
    });
  });

  describe('$translatePartialLoader', function () {

    beforeEach(module('pascalprecht.translate'));

    var $translatePartialLoader, $rootScope;

    beforeEach(inject(function (_$translatePartialLoader_, _$rootScope_) {
      $translatePartialLoader = _$translatePartialLoader_;
      $rootScope = _$rootScope_;
    }));

    it('should be defined', function() {
      expect($translatePartialLoader).toBeDefined();
    });

    it('should be a function', function() {
      expect(typeof $translatePartialLoader).toBe('function');
    });

    describe('$translatePartialLoader#addPart', function () {

      it('should be defined', function() {
        expect($translatePartialLoader.addPart).toBeDefined();
      });

      it('should be a function', function() {
        expect(typeof $translatePartialLoader.addPart).toBe('function');
      });

      it('should throw an error if a given arg is not a non-empty string', function() {
        var message = 'Couldn\'t add part, first arg has to be a string';
        expect(function() { $translatePartialLoader.addPart(function(){}); }).toThrow(message);
        expect(function() { $translatePartialLoader.addPart(false);}).toThrow(message);
        expect(function() { $translatePartialLoader.addPart(null); }).toThrow(message);
        expect(function() { $translatePartialLoader.addPart(NaN);  }).toThrow(message);
        expect(function() { $translatePartialLoader.addPart([]);   }).toThrow(message);
        expect(function() { $translatePartialLoader.addPart({});   }).toThrow(message);
        expect(function() { $translatePartialLoader.addPart(2);    }).toThrow(message);
        expect(function() { $translatePartialLoader.addPart();     }).toThrow(message);
      });

      it('should be chainable', function() {
        expect($translatePartialLoader.addPart('part')).toEqual($translatePartialLoader);
      });

      it('should add a part', function() {
        $translatePartialLoader.addPart('part');
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(true);
      });

      it('should broadcast a $translatePartialLoaderStructureChanged event', function() {
        spyOn($rootScope, '$emit');
        $translatePartialLoader.addPart('part');
        expect($rootScope.$emit).toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
      });
    });

    describe('$translatePartialLoader#deletePart', function () {

      it('should be defined', function() {
        expect($translatePartialLoader.deletePart).toBeDefined();
      });

      it('should be a function', function() {
        inject(function($translatePartialLoader) {
          expect(typeof $translatePartialLoader.deletePart).toBe('function');
        });
      });

      it('should throw an error if a first arg is not a string', function () {
        var message = 'Couldn\'t delete part, first arg has to be string';
        expect(function() { $translatePartialLoader.deletePart(function(){});}).toThrow(message);
        expect(function() { $translatePartialLoader.deletePart(false);}).toThrow(message);
        expect(function() { $translatePartialLoader.deletePart(null); }).toThrow(message);
        expect(function() { $translatePartialLoader.deletePart(NaN);  }).toThrow(message);
        expect(function() { $translatePartialLoader.deletePart([]);   }).toThrow(message);
        expect(function() { $translatePartialLoader.deletePart({});   }).toThrow(message);
        expect(function() { $translatePartialLoader.deletePart(2);    }).toThrow(message);
        expect(function() { $translatePartialLoader.deletePart();     }).toThrow(message);
      });

      it('should be chainable', function() {
        expect($translatePartialLoader.deletePart('part')).toEqual($translatePartialLoader);
      });

      it('should delete a target part', function() {
        $translatePartialLoader.addPart('part');
        $translatePartialLoader.deletePart('part');
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
      });

      it('should broadcast a $translatePartialLoaderStructureChanged event', function() {
        $translatePartialLoader.addPart('part');
        spyOn($rootScope, '$emit');
        $translatePartialLoader.deletePart('part');
        expect($rootScope.$emit).toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
      });
    });

    describe('$translatePartialLoader#isPartAvailable', function() {

      it('should be defined', function() {
        expect($translatePartialLoader.isPartAvailable).toBeDefined();
      });

      it('should be a function', function() {
        expect(typeof $translatePartialLoader.isPartAvailable).toBe('function');
      });

      it('should return true if a target part was added', function() {
        $translatePartialLoader.addPart('part');
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(true);
      });

      it('should return false if a target part was not added', function() {
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
      });

      it('should return false if a target part was deleted', function() {
        $translatePartialLoader.addPart('part');
        $translatePartialLoader.deletePart('part');
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
      });
    });
  });
});
  // describe('$translatePartialLoader', function() {

  //   beforeEach(module('pascalprecht.translate'));

  //   var counter,
  //       resolveHandlerCounter,
  //       rejectHandlerCounter;

  //   function ThrowErrorHttpInterceptor(data) {
  //     throw new Error('$http service was used!');
  //   }

  //   function CounterHttpInterceptor(data) {
  //     ++counter;
  //     return data;
  //   }

  //   beforeEach(module(function($provide) {
  //     $provide.factory('ResolveErrorHandler', function($q) {
  //       return function(partName, language) {
  //         ++resolveHandlerCounter;
  //         var deferred = $q.defer();
  //         deferred.resolve({ foo : 'foo' });
  //         return deferred.promise;
  //       };
  //     });

  //     $provide.factory('RejectErrorHandler', function($q) {
  //       return function(partName, language) {
  //         ++rejectHandlerCounter;
  //         var deferred = $q.defer();
  //         deferred.reject(partName);
  //         return deferred.promise;
  //       };
  //     });
  //   }));

  //   beforeEach(function() {
  //     counter = 0;
  //     resolveHandlerCounter = 0;
  //     rejectHandlerCounter = 0;
  //   });


  //     describe('instance', function() {

  //       // URL
  //       describe('', function() {

  //         it('should correctly parse url template', function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');

  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });

  //             $httpBackend.flush();
  //             $httpBackend.verifyNoOutstandingExpectation();
  //             $httpBackend.verifyNoOutstandingRequest();
  //           });
  //         });

  //         it('should correctly parse url template with multiple pattern occurrences', function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/part/part-en.json').respond(200, '{}');

  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}/{part}-{lang}.json'
  //             });

  //             $httpBackend.flush();
  //             $httpBackend.verifyNoOutstandingExpectation();
  //             $httpBackend.verifyNoOutstandingRequest();
  //           });
  //         });

  //         it('should throw an error if a urlTemplate is not a non-empty string', function() {
  //           inject(function($translatePartialLoader) {
  //             var message = 'Unable to load data, a urlTemplate is not a non-empty string.';
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : function(){}
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : false
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : null
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : NaN
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : []
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : {}
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : 2
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k'
  //               });
  //             }).toThrow(message);
  //           });
  //         });

  //         it('should throw an error if a key is not a non-empty string', function() {
  //           inject(function($translatePartialLoader) {
  //             var message = 'Unable to load data, a key is not a non-empty string.';
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : function(){},
  //                 urlTemplate : '/locales/{part}-{lang}.json'
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : false,
  //                 urlTemplate : '/locales/{part}-{lang}.json'
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : null,
  //                 urlTemplate : '/locales/{part}-{lang}.json'
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : NaN,
  //                 urlTemplate : '/locales/{part}-{lang}.json'
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : [],
  //                 urlTemplate : '/locales/{part}-{lang}.json'
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : {},
  //                 urlTemplate : '/locales/{part}-{lang}.json'
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 2,
  //                 urlTemplate : '/locales/{part}-{lang}.json'
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 urlTemplate : '/locales/{part}-{lang}.json'
  //               });
  //             }).toThrow(message);
  //           });
  //         });

  //       });


  //       // Requests
  //       describe('', function() {

  //         afterEach(inject(function ($httpBackend) {
  //           $httpBackend.verifyNoOutstandingExpectation();
  //           $httpBackend.verifyNoOutstandingRequest();
  //         }));

  //         it('should make 1 request to get 1 part', function() {
  //           module(function($httpProvider) {
  //             $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
  //           });

  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');

  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });
  //             $httpBackend.flush();

  //             expect(counter).toEqual(1);
  //           });
  //         });

  //         it('should make 1 request per 1 part', function() {
  //           module(function($httpProvider) {
  //             $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
  //           });

  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/part1-en.json').respond(200, '{}');
  //             $httpBackend.expectGET('/locales/part2-en.json').respond(200, '{}');

  //             $translatePartialLoader.addPart('part1');
  //             $translatePartialLoader.addPart('part2');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });
  //             $httpBackend.flush(2);

  //             expect(counter).toEqual(2);
  //           });
  //         });

  //         it('shouldn\'t make requests to get deleted parts', function() {
  //           module(function($httpProvider) {
  //             $httpProvider.defaults.transformRequest.push(ThrowErrorHttpInterceptor);
  //           });

  //           inject(function($translatePartialLoader) {
  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader.deletePart('part');
  //             expect(function(){
  //               $translatePartialLoader({
  //                 key : 'en',
  //                 urlTemplate : '/locales/{part}-{lang}.json'
  //               });
  //             }).not.toThrow('$http service was used!');
  //           });
  //         });

  //         it('shouldn\'t load the same part twice for one language', function() {
  //           module(function($httpProvider) {
  //             $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
  //           });

  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.whenGET('/locales/part-en.json').respond(200, '{}');

  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });
  //             $httpBackend.flush();

  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });
  //             try { $httpBackend.flush(); } catch (e) {}

  //             expect(counter).toEqual(1);
  //           });
  //         });

  //         it('shouldn\'t load a part if it was loaded, deleted (second arg is false or not ' +
  //            ' passed) and added again', function() {
  //           module(function($httpProvider) {
  //             $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
  //           });

  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.whenGET('/locales/part-en.json').respond(200, '{}');

  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });
  //             $httpBackend.flush();

  //             $translatePartialLoader.deletePart('part');
  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });
  //             try { $httpBackend.flush(); } catch (e) {}

  //             expect(counter).toEqual(1);
  //           });
  //         });

  //         it('should load a part if it was loaded, deleted (second arg is true) and added again',
  //         function() {
  //           module(function($httpProvider) {
  //             $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
  //           });

  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.whenGET('/locales/part-en.json').respond(200, '{}');

  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });
  //             $httpBackend.flush();

  //             $translatePartialLoader.deletePart('part', true);
  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });
  //             $httpBackend.flush();

  //             expect(counter).toEqual(2);
  //           });
  //         });

  //         it('should load the same part for different languages', function() {
  //           module(function($httpProvider) {
  //             $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
  //           });

  //           inject(function($translatePartialLoader, $httpBackend) {
  //             var table = {};
  //             $translatePartialLoader.addPart('part');

  //             $httpBackend.expectGET('/locales/part-en.json').respond(200, '{"lang":"en"}');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });
  //             $httpBackend.flush();

  //             $httpBackend.expectGET('/locales/part-ne.json').respond(200, '{"lang":"ne"}');
  //             $translatePartialLoader({
  //               key : 'ne',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             }).then(function(data) {
  //               angular.extend(table, data);
  //             });
  //             $httpBackend.flush();

  //             expect(table).toEqual({ lang : 'ne' });
  //           });
  //         });

  //       });


  //       // Return value
  //       describe('', function() {

  //         afterEach(inject(function ($httpBackend) {
  //           $httpBackend.verifyNoOutstandingExpectation();
  //           $httpBackend.verifyNoOutstandingRequest();
  //         }));

  //         it('should return a promise', function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');

  //             $translatePartialLoader.addPart('part');
  //             var promise = $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             });

  //             expect(promise.then).toBeDefined();
  //             expect(typeof promise.then).toBe('function');

  //             $httpBackend.flush();
  //           });
  //         });

  //         it('should merge parts before resolving a promise', function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/part1-en.json').respond(200, '{"foo":"foo"}');
  //             $httpBackend.expectGET('/locales/part2-en.json').respond(200, '{"bar":"bar"}');

  //             var table = {};

  //             $translatePartialLoader.addPart('part1');
  //             $translatePartialLoader.addPart('part2');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             }).then(function(data) {
  //               angular.extend(table, data);
  //             });
  //             $httpBackend.flush();

  //             expect(table.foo).toBeDefined();
  //             expect(table.foo).toEqual('foo');
  //             expect(table.bar).toBeDefined();
  //             expect(table.bar).toEqual('bar');
  //           });
  //         });

  //         it('should merge namespaces instead of overriding them', function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/part1-en.json').respond(200, '{"foo":{"bar":"bar"}}');
  //             $httpBackend.expectGET('/locales/part2-en.json').respond(200, '{"foo":{"buz":"buz"}}');

  //             var table = {};

  //             $translatePartialLoader.addPart('part1');
  //             $translatePartialLoader.addPart('part2');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             }).then(function(data) {
  //               angular.extend(table, data);
  //             });
  //             $httpBackend.flush();

  //             expect(table.foo).toBeDefined();
  //             expect(table.foo.bar).toBeDefined();
  //             expect(table.foo.buz).toBeDefined();
  //             expect(table.foo.bar).toEqual('bar');
  //             expect(table.foo.buz).toEqual('buz');
  //           });
  //         });

  //         it('should reject promise with language key if error occurred', function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/part-en.json').respond(404, 'File not found');

  //             var key;

  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             }).then(
  //               function() {},
  //               function(_key) { key = _key; }
  //             );
  //             $httpBackend.flush();

  //             expect(key).toEqual('en');
  //           });
  //         });

  //       });


  //       // Error handling
  //       describe('when error occurred', function() {

  //         afterEach(inject(function ($httpBackend) {
  //           $httpBackend.verifyNoOutstandingExpectation();
  //           $httpBackend.verifyNoOutstandingRequest();
  //         }));

  //         it('should throw an error if a loadFailureHandler is not a string or undefined',
  //         function() {
  //           inject(function($translatePartialLoader) {
  //             var message = 'Unable to load data, a loadFailureHandler is not a string.';
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : '/locales/{part}-{lang}.json',
  //                 loadFailureHandler : function(){}
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : '/locales/{part}-{lang}.json',
  //                 loadFailureHandler : false
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : '/locales/{part}-{lang}.json',
  //                 loadFailureHandler : null
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : '/locales/{part}-{lang}.json',
  //                 loadFailureHandler : NaN
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : '/locales/{part}-{lang}.json',
  //                 loadFailureHandler : []
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : '/locales/{part}-{lang}.json',
  //                 loadFailureHandler : {}
  //               });
  //             }).toThrow(message);
  //             expect(function() {
  //               $translatePartialLoader({
  //                 key : 'k',
  //                 urlTemplate : '/locales/{part}-{lang}.json',
  //                 loadFailureHandler : 2
  //               });
  //             }).toThrow(message);
  //           });
  //         });

  //         it('should reject a resulting promise by default', function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.whenGET('/locales/part-en.json').respond(404, 'File not found');
  //             var promise;

  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json'
  //             }).then(
  //               function() { promise = 'resolved'; },
  //               function() { promise = 'rejected'; }
  //             );
  //             $httpBackend.flush();

  //             expect(promise).toEqual('rejected');
  //           });
  //         });

  //         it('should use an error handler if it is specified', function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.whenGET('/locales/part-en.json').respond(404, 'File not found');
  //             var promise;

  //             $translatePartialLoader.addPart('part');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json',
  //               loadFailureHandler : 'ResolveErrorHandler'
  //             }).then(
  //               function() { promise = 'resolved'; },
  //               function() { promise = 'rejected'; }
  //             );
  //             $httpBackend.flush();

  //             expect(resolveHandlerCounter).toEqual(1);
  //             expect(promise).toEqual('resolved');
  //           });
  //         });

  //         it('should reject a loading process, if at least one handler rejects it\'s promise',
  //         function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.whenGET('/locales/part1-en.json').respond(200, '{"bar":"bar"}');
  //             $httpBackend.whenGET('/locales/part2-en.json').respond(404, 'File not found');
  //             var promise;

  //             $translatePartialLoader.addPart('part1');
  //             $translatePartialLoader.addPart('part2');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json',
  //               loadFailureHandler : 'RejectErrorHandler'
  //             }).then(
  //               function() { promise = 'resolved'; },
  //               function() { promise = 'rejected'; }
  //             );
  //             $httpBackend.flush();

  //             expect(rejectHandlerCounter).toEqual(1);
  //             expect(promise).toEqual('rejected');
  //           });
  //         });

  //         it('should resolve a loading process, if all handlers resolves their promises',
  //         function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.whenGET('/locales/part1-en.json').respond(404, 'File not found');
  //             $httpBackend.whenGET('/locales/part2-en.json').respond(404, 'File not found');
  //             var promise;

  //             $translatePartialLoader.addPart('part1');
  //             $translatePartialLoader.addPart('part2');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json',
  //               loadFailureHandler : 'ResolveErrorHandler'
  //             }).then(
  //               function() { promise = 'resolved'; },
  //               function() { promise = 'rejected'; }
  //             );
  //             $httpBackend.flush();

  //             expect(resolveHandlerCounter).toEqual(2);
  //             expect(promise).toEqual('resolved');
  //           });
  //         });

  //         it('should use a data from resolved handler\'s promise instead of data from $http',
  //         function() {
  //           inject(function($translatePartialLoader, $httpBackend) {
  //             $httpBackend.whenGET('/locales/part1-en.json').respond(200, '{"bar":"bar"}');
  //             $httpBackend.whenGET('/locales/part2-en.json').respond(404, 'File not found');
  //             var data = {};

  //             $translatePartialLoader.addPart('part1');
  //             $translatePartialLoader.addPart('part2');
  //             $translatePartialLoader({
  //               key : 'en',
  //               urlTemplate : '/locales/{part}-{lang}.json',
  //               loadFailureHandler : 'ResolveErrorHandler'
  //             }).then(
  //               function(_data) { data = _data; },
  //               function(_data) { data = _data; }
  //             );
  //             $httpBackend.flush();

  //             expect(resolveHandlerCounter).toEqual(1);
  //             expect(data).toEqual({
  //               bar : 'bar',
  //               foo : 'foo'
  //             });
  //           });
  //         });

  //       });


  //       // $translate service cooperation
  //       describe('in $translate service', function() {

  //         function SetupHttpBackend() {
  //           inject(function ($httpBackend) {
  //             $httpBackend.whenGET('/locales/foo-en.json').respond({ foo : 'foo_en' });
  //             $httpBackend.whenGET('/locales/bar-en.json').respond({ bar : 'bar_en' });
  //             $httpBackend.whenGET('/locales/foo-ne.json').respond(404, 'File not fould!');
  //             $httpBackend.whenGET('/locales/bar-ne.json').respond({ bar : 'bar_ne' });

  //           });
  //         }

  //         beforeEach(module(function($translateProvider) {
  //           $translateProvider.useLoader('$translatePartialLoader', {
  //             urlTemplate : '/locales/{part}-{lang}.json',
  //             loadFailureHandler : 'ResolveErrorHandler'
  //           });
  //         }));

  //         afterEach(inject(function ($httpBackend) {
  //           $httpBackend.verifyNoOutstandingExpectation();
  //           $httpBackend.verifyNoOutstandingRequest();
  //         }));


  //         it('shouldn\'t throw any error if configured correctly', function() {
  //           SetupHttpBackend();

  //           inject(function($translate, $translatePartialLoader, $httpBackend) {
  //             $translatePartialLoader.addPart('foo');
  //             expect(function() {
  //               $translate.uses('en');
  //               $httpBackend.flush();
  //             }).not.toThrow();
  //           });

  //         });

  //         it('should fetch urls of all parts', function() {
  //           SetupHttpBackend();

  //           inject(function($translate, $translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/foo-en.json');
  //             $httpBackend.expectGET('/locales/bar-en.json');

  //             $translatePartialLoader.addPart('foo');
  //             $translatePartialLoader.addPart('bar');
  //             $translate.uses('en');
  //             $httpBackend.flush();
  //           });
  //         });

  //         iit('should merge data before resolving a promise', function() {
  //           SetupHttpBackend();

  //           inject(function($translate, $translatePartialLoader, $httpBackend, $q) {
  //             $httpBackend.expectGET('/locales/foo-en.json');
  //             $httpBackend.expectGET('/locales/bar-en.json');

  //             $translatePartialLoader.addPart('foo');
  //             $translatePartialLoader.addPart('bar');
  //             $translate.uses('en');

  //             var deferred = $q.defer(),
  //                 promise = deferred.promise,
  //                 value;

  //             promise.then(function (translation) {
  //               value = translation;
  //             });

  //             $translate('foo').then(function (translation) {
  //               deferred.resolve(translation);
  //             });
  //             $httpBackend.flush();
  //             expect(value).toEqual('foo_en');
  //           });
  //         });

  //         it('should use an error handler if possible when loading is failed', function() {
  //           SetupHttpBackend();

  //           inject(function($translate, $translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/foo-ne.json');
  //             $httpBackend.expectGET('/locales/bar-ne.json');

  //             $translatePartialLoader.addPart('foo');
  //             $translatePartialLoader.addPart('bar');
  //             $translate.uses('ne');
  //             $httpBackend.flush();

  //             expect(resolveHandlerCounter).toEqual(1);
  //           });
  //         });

  //         it('should use data from an error handler if possible when loading is failed', function(){
  //           SetupHttpBackend();

  //           inject(function($translate, $translatePartialLoader, $httpBackend) {
  //             $httpBackend.expectGET('/locales/foo-ne.json');
  //             $httpBackend.expectGET('/locales/bar-ne.json');

  //             $translatePartialLoader.addPart('foo');
  //             $translatePartialLoader.addPart('bar');
  //             $translate.uses('ne');
  //             $httpBackend.flush();

  //             expect($translate('foo')).toEqual('foo');
  //             expect($translate('bar')).toEqual('bar_ne');
  //           });
  //         });

  //       });

  //     });

  //   });

  // });
