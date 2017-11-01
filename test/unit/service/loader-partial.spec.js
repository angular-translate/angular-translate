/* jshint camelcase: false, unused: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  var counter,
    resolveHandlerCounter,
    rejectHandlerCounter;

  beforeEach(function () {
    counter = 0;
    resolveHandlerCounter = 0;
    rejectHandlerCounter = 0;
  });

  function CounterHttpInterceptor(data) {
    ++counter;
    return data;
  }

  beforeEach(module(function ($provide) {
    $provide.factory('ResolveErrorHandler', function ($q) {
      return function (partName, language) {
        ++resolveHandlerCounter;
        var deferred = $q.defer();
        deferred.resolve({foo : 'foo'});
        return deferred.promise;
      };
    });

    $provide.factory('RejectErrorHandler', function ($q) {
      return function (partName, language) {
        ++rejectHandlerCounter;
        var deferred = $q.defer();
        deferred.reject(partName);
        return deferred.promise;
      };
    });

  }));

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

      it('should be defined', function () {
        inject(function ($translatePartialLoader) {
          expect($provider.addPart).toBeDefined();
        });
      });

      it('should be a function', function () {
        inject(function ($translatePartialLoader) {
          expect(typeof $provider.addPart).toBe('function');
        });
      });

      it('should throw an error if given arg is not a string', function () {
        inject(function ($translatePartialLoader) {
          var message = 'Couldn\'t add part, part name has to be a string!';
          expect(function () {
            $provider.addPart(function () {
            });
          }).toThrowError(message);
          expect(function () {
            $provider.addPart(false);
          }).toThrowError(message);
          expect(function () {
            $provider.addPart(null);
          }).toThrowError(message);
          expect(function () {
            $provider.addPart(NaN);
          }).toThrowError(message);
          expect(function () {
            $provider.addPart([]);
          }).toThrowError(message);
          expect(function () {
            $provider.addPart({});
          }).toThrowError(message);
          expect(function () {
            $provider.addPart(2);
          }).toThrowError(message);
          expect(function () {
            $provider.addPart();
          }).toThrowError(message);
        });
      });

      it('should add a part', function () {
        inject(function ($translatePartialLoader) {
          $provider.addPart('part');
          expect($provider.isPartAvailable('part')).toBe(true);
        });
      });

      it('should be chainable', function () {
        inject(function ($translatePartialLoader) {
          expect($provider.addPart('part')).toEqual($provider);
        });
      });
    });

    describe('$translatePartialLoaderProvider#setPart', function () {

      it('should be defined', function () {
        inject(function ($translatePartialLoader) {
          expect($provider.setPart).toBeDefined();
        });
      });

      it('should be a function', function () {
        inject(function ($translatePartialLoader) {
          expect(typeof $provider.setPart).toBe('function');
        });
      });

      it('should throw an error if first arg is not a string', function () {
        inject(function ($translatePartialLoader) {
          var message = 'Couldn\'t set part.`lang` parameter has to be a string!';
          expect(function () {
            $provider.setPart(function () {
            });
          }).toThrowError(message);
          expect(function () {
            $provider.setPart(false);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart(null);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart(NaN);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart([]);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart({});
          }).toThrowError(message);
          expect(function () {
            $provider.setPart(2);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart();
          }).toThrowError(message);
        });
      });

      it('should throw an error if a second arg is not a non-empty string', function () {
        inject(function ($translatePartialLoader) {
          var message = 'Couldn\'t set part.`part` parameter has to be a string!';
          expect(function () {
            $provider.setPart('l', function () {
            });
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', false);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', null);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', NaN);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', []);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', {});
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', 2);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l');
          }).toThrowError(message);
        });
      });

      it('should throw an error if a third arg is not an object', function () {
        inject(function ($translatePartialLoader) {
          var message = 'Couldn\'t set part. `table` parameter has to be an object!';
          expect(function () {
            $provider.setPart('l', 'p', function () {
            });
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', 'p', false);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', 'p', null);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', 'p', NaN);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', 'p', 's');
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', 'p', 2);
          }).toThrowError(message);
          expect(function () {
            $provider.setPart('l', 'p');
          }).toThrowError(message);
        });
      });

      it('should be chainable', function () {
        inject(function ($translatePartialLoader) {
          expect($provider.setPart('lang', 'part', {})).toEqual($provider);
        });
      });

      it('should set a translation table statically', function () {
        inject(function ($translatePartialLoader, $rootScope) {
          $provider.setPart('en', 'part', {foo : 'Foo'});
          $provider.addPart('part');

          var table;

          $translatePartialLoader({
            key : 'en',
            urlTemplate : '/locales/{part}-{lang}.json'
          }).then(function (data) {
            table = data;
          }, function () {
            table = {};
          });
          $rootScope.$digest();
          expect(table.foo).toBeDefined();
          expect(table.foo).toEqual('Foo');
        });
      });

      it('should override the translation table ', function () {
        inject(function ($translatePartialLoader, $rootScope) {
          $provider.setPart('en', 'part', {foo : 'Foo'});
          $provider.setPart('en', 'part', {foo : 'Bar'});
          $provider.addPart('part');

          var table;
          $translatePartialLoader({
            key : 'en',
            urlTemplate : '/locales/{part}-{lang}.json'
          }).then(function (data) {
            table = data;
          }, function () {
            table = {};
          });
          $rootScope.$digest();
          expect(table.foo).toBeDefined();
          expect(table.foo).toEqual('Bar');
        });
      });
    });

    describe('$translatePartialLoader#deletePart', function () {

      it('should be defined', function () {
        inject(function ($translatePartialLoader) {
          expect($provider.deletePart).toBeDefined();
        });
      });

      it('should be a function', function () {
        inject(function ($translatePartialLoader) {
          expect(typeof $provider.deletePart).toBe('function');
        });
      });

      it('should throw an error if a given arg is not a string', function () {
        inject(function ($translatePartialLoader) {
          var message = 'Couldn\'t delete part, first arg has to be string.';
          expect(function () {
            $provider.deletePart(function () {
            });
          }).toThrowError(message);
          expect(function () {
            $provider.deletePart(false);
          }).toThrowError(message);
          expect(function () {
            $provider.deletePart(null);
          }).toThrowError(message);
          expect(function () {
            $provider.deletePart(NaN);
          }).toThrowError(message);
          expect(function () {
            $provider.deletePart([]);
          }).toThrowError(message);
          expect(function () {
            $provider.deletePart({});
          }).toThrowError(message);
          expect(function () {
            $provider.deletePart(2);
          }).toThrowError(message);
          expect(function () {
            $provider.deletePart();
          }).toThrowError(message);
        });
      });

      it('should be chainable', function () {
        inject(function ($translatePartialLoader) {
          expect($provider.deletePart('part')).toEqual($provider);
        });
      });

      it('should delete a part', function () {
        inject(function ($translatePartialLoader) {
          $provider.addPart('part');
          $provider.deletePart('part');
          expect($provider.isPartAvailable('part')).toEqual(false);
        });
      });
    });
  });

  describe('$translatePartialLoader', function () {

    beforeEach(module('pascalprecht.translate', function ($httpProvider) {
      if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
        $httpProvider.useLegacyPromiseExtensions(false);
      }
    }));

    var $translatePartialLoader, $rootScope;

    beforeEach(inject(function (_$translatePartialLoader_, _$rootScope_) {
      $translatePartialLoader = _$translatePartialLoader_;
      $rootScope = _$rootScope_;
    }));

    it('should be defined', function () {
      expect($translatePartialLoader).toBeDefined();
    });

    it('should be a function', function () {
      expect(typeof $translatePartialLoader).toBe('function');
    });

    describe('$translatePartialLoader#addPart', function () {

      it('should be defined', function () {
        expect($translatePartialLoader.addPart).toBeDefined();
      });

      it('should be a function', function () {
        expect(typeof $translatePartialLoader.addPart).toBe('function');
      });

      it('should throw an error if a given arg is not a non-empty string', function () {
        var message = 'Couldn\'t add part, first arg has to be a string';
        expect(function () {
          $translatePartialLoader.addPart(function () {
          });
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.addPart(false);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.addPart(null);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.addPart(NaN);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.addPart([]);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.addPart({});
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.addPart(2);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.addPart();
        }).toThrowError(message);
      });

      it('should be chainable', function () {
        expect($translatePartialLoader.addPart('part')).toEqual($translatePartialLoader);
      });

      it('should add a part', function () {
        $translatePartialLoader.addPart('part');
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(true);
      });

      it('should broadcast a $translatePartialLoaderStructureChanged event', function () {
        spyOn($rootScope, '$emit');
        $translatePartialLoader.addPart('part');
        expect($rootScope.$emit).toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
      });
    });

    describe('$translatePartialLoader#deletePart', function () {

      it('should be defined', function () {
        expect($translatePartialLoader.deletePart).toBeDefined();
      });

      it('should be a function', function () {
        inject(function ($translatePartialLoader) {
          expect(typeof $translatePartialLoader.deletePart).toBe('function');
        });
      });

      it('should throw an error if a first arg is not a string', function () {
        var message = 'Couldn\'t delete part, first arg has to be string';
        expect(function () {
          $translatePartialLoader.deletePart(function () {
          });
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.deletePart(false);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.deletePart(null);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.deletePart(NaN);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.deletePart([]);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.deletePart({});
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.deletePart(2);
        }).toThrowError(message);
        expect(function () {
          $translatePartialLoader.deletePart();
        }).toThrowError(message);
      });

      it('should be chainable', function () {
        expect($translatePartialLoader.deletePart('part')).toEqual($translatePartialLoader);
      });

      it('should delete a target part', function () {
        $translatePartialLoader.addPart('part');
        $translatePartialLoader.deletePart('part');
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
      });

      it('should broadcast a $translatePartialLoaderStructureChanged event', function () {
        $translatePartialLoader.addPart('part');
        spyOn($rootScope, '$emit');
        $translatePartialLoader.deletePart('part');
        expect($rootScope.$emit).toHaveBeenCalledWith('$translatePartialLoaderStructureChanged', 'part');
      });
    });

    describe('$translatePartialLoader#isPartAvailable', function () {

      it('should be defined', function () {
        expect($translatePartialLoader.isPartAvailable).toBeDefined();
      });

      it('should be a function', function () {
        expect(typeof $translatePartialLoader.isPartAvailable).toBe('function');
      });

      it('should return true if a target part was added', function () {
        $translatePartialLoader.addPart('part');
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(true);
      });

      it('should return false if a target part was not added', function () {
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
      });

      it('should return false if a target part was deleted', function () {
        $translatePartialLoader.addPart('part');
        $translatePartialLoader.deletePart('part');
        expect($translatePartialLoader.isPartAvailable('part')).toEqual(false);
      });
    });

    it('should return a promise', function () {
      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.expectGET('/locales/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        var promise = $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        });

        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');

        $httpBackend.flush();
      });
    });

    it('should parse url template', function () {
      inject(function ($translatePartialLoader, $httpBackend) {
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

    it('should parse url template addPart argument', function () {
      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.expectGET('/x/locales/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part-x', undefined, '/x/locales/part-{lang}.json');
        $translatePartialLoader({
          key : 'en',
          urlTemplate: '/locales/{part}-{lang}.json'
        });

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });

    it('should support function in url template', function () {
      inject(function ($translatePartialLoader, $httpBackend) {
        var getUrlTemplate = jasmine.createSpy('getUrlTemplate')
          .and.returnValue('/locales/data.json');

        $httpBackend.expectGET('/locales/data.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : getUrlTemplate
        });

        $httpBackend.flush();
        expect(getUrlTemplate).toHaveBeenCalledWith('part', 'en');
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });

    it('should parse url template with multiple pattern occurrences', function () {
      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.expectGET('/locales/part/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}/{part}-{lang}.json'
        });

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });

  });

  describe('$translatePartialLoader', function () {

    beforeEach(module('pascalprecht.translate', function ($httpProvider) {
      if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
        $httpProvider.useLegacyPromiseExtensions(false);
      }
    }));

    it('should use error handler if it is specified', function () {
      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.whenGET('/locales/part-en.json').respond(404, 'File not found');
        var promise;

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          loadFailureHandler : 'ResolveErrorHandler'
        }).then(
          function () {
            promise = 'resolved';
          },
          function () {
            promise = 'rejected';
          }
        );
        $httpBackend.flush();

        expect(resolveHandlerCounter).toEqual(1);
        expect(promise).toEqual('resolved');
      });
    });

    it('should resolve , if all handlers resolves their promises', function () {
      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.whenGET('/locales/part1-en.json').respond(404, 'File not found');
        $httpBackend.whenGET('/locales/part2-en.json').respond(404, 'File not found');
        var promise;

        $translatePartialLoader.addPart('part1');
        $translatePartialLoader.addPart('part2');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          loadFailureHandler : 'ResolveErrorHandler'
        }).then(
          function () {
            promise = 'resolved';
          },
          function () {
            promise = 'rejected';
          }
        );
        $httpBackend.flush();

        expect(resolveHandlerCounter).toEqual(2);
        expect(promise).toEqual('resolved');
      });
    });
  });

  describe('$translatePartialLoader', function () {

    beforeEach(module('pascalprecht.translate'));

    it('should make 1 request per 1 part', function () {

      counter = 0;

      module(function ($httpProvider) {
        if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
          $httpProvider.useLegacyPromiseExtensions(false);
        }
        $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
      });

      inject(function ($translatePartialLoader, $httpBackend) {
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
      });
    });

    it('shouldn\'t load the same part twice for one language', function () {

      counter = 0;

      module(function ($httpProvider) {
        if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
          $httpProvider.useLegacyPromiseExtensions(false);
        }
        $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
      });

      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.whenGET('/locales/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        });
        $httpBackend.flush();

        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        });
        try {
          $httpBackend.flush();
        } catch (e) {
        }

        expect(counter).toEqual(1);
      });
    });

    it('shouldn\'t load a part if it was loaded, deleted and added again', function () {
      counter = 0;
      module(function ($httpProvider) {
        if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
          $httpProvider.useLegacyPromiseExtensions(false);
        }
        $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
      });

      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.whenGET('/locales/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        });
        $httpBackend.flush();

        $translatePartialLoader.deletePart('part');
        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        });
        try {
          $httpBackend.flush();
        } catch (e) {
        }

        expect(counter).toEqual(1);
      });
    });

    it('should load a part if it was loaded, deleted and added again', function () {

      counter = 0;

      module(function ($httpProvider) {
        if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
          $httpProvider.useLegacyPromiseExtensions(false);
        }
        $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
      });

      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.whenGET('/locales/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        });
        $httpBackend.flush();

        $translatePartialLoader.deletePart('part', true);
        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        });
        $httpBackend.flush();

        expect(counter).toEqual(2);
      });
    });

    it('should put a part into a cache and remove from the cache if the part was deleted', function () {
      module(function ($httpProvider, $translateProvider) {
        if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
          $httpProvider.useLegacyPromiseExtensions(false);
        }
        $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
        $translateProvider.useLoaderCache();
      });

      inject(function ($translatePartialLoader, $httpBackend, $translationCache) {
        $httpBackend.whenGET('/locales/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          $http : {
            cache : $translationCache
          }
        });
        $httpBackend.flush();
        expect($translationCache.info().size).toEqual(1);

        $translatePartialLoader.deletePart('part', true);
        expect($translationCache.info().size).toEqual(0);
      });
    });
  });


  describe('$translatePartialLoader with custom options (method=POST)', function () {

    beforeEach(module('pascalprecht.translate'));

    it('should make 1 request per 1 part', function () {

      counter = 0;

      module(function ($httpProvider) {
        if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
          $httpProvider.useLegacyPromiseExtensions(false);
        }
        $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
      });

      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.expectPOST('/locales/part1-en.json').respond(200, '{}');
        $httpBackend.expectPOST('/locales/part2-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part1');
        $translatePartialLoader.addPart('part2');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          $http : {
            method : 'POST'
          }
        });
        $httpBackend.flush(2);
        expect(counter).toEqual(2);
      });
    });

    it('shouldn\'t load the same part twice for one language', function () {

      counter = 0;

      module(function ($httpProvider) {
        if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
          $httpProvider.useLegacyPromiseExtensions(false);
        }
        $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
      });

      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.whenPOST('/locales/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          $http : {
            method : 'POST'
          }
        });
        $httpBackend.flush();

        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          $http : {
            method : 'POST'
          }
        });
        try {
          $httpBackend.flush();
        } catch (e) {
        }

        expect(counter).toEqual(1);
      });
    });

    it('shouldn\'t load a part if it was loaded, deleted and added again', function () {
      counter = 0;
      module(function ($httpProvider) {
        if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
          $httpProvider.useLegacyPromiseExtensions(false);
        }
        $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
      });

      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.whenPOST('/locales/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          $http : {
            method : 'POST'
          }
        });
        $httpBackend.flush();

        $translatePartialLoader.deletePart('part');
        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          $http : {
            method : 'POST'
          }
        });
        try {
          $httpBackend.flush();
        } catch (e) {
        }

        expect(counter).toEqual(1);
      });
    });

    it('should load a part if it was loaded, deleted and added again', function () {

      counter = 0;

      module(function ($httpProvider) {
        if (angular.isDefined($httpProvider.useLegacyPromiseExtensions)) {
          $httpProvider.useLegacyPromiseExtensions(false);
        }
        $httpProvider.defaults.transformRequest.push(CounterHttpInterceptor);
      });

      inject(function ($translatePartialLoader, $httpBackend) {
        $httpBackend.whenPOST('/locales/part-en.json').respond(200, '{}');

        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          $http : {
            method : 'POST'
          }
        });
        $httpBackend.flush();

        $translatePartialLoader.deletePart('part', true);
        $translatePartialLoader.addPart('part');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json',
          $http : {
            method : 'POST'
          }
        });
        $httpBackend.flush();

        expect(counter).toEqual(2);
      });
    });

    it('should load parts in order of priority', function (done) {
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

      inject(function ($translatePartialLoader, $httpBackend) {
        var table;

        $httpBackend.whenGET('/locales/part1-en.json').respond(200, '{"key1":"value1","key2":"value2","key3":"value3","key4":"value4"}');
        $httpBackend.whenGET('/locales/part2-en.json').respond(200, '{"key2" : "overridenby2","key4":"overridenby2"}');
        $httpBackend.whenGET('/locales/part3-en.json').respond(200, '{"key3" : "overridenby3","key4":"overridenby3"}');

        $translatePartialLoader.addPart('part2', 1);
        $translatePartialLoader.addPart('part3', 2);
        $translatePartialLoader.addPart('part1', 0);
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        }).then(function (data) {
          table = data;
          expect(table.key1).toEqual('value1');
          expect(table.key2).toEqual('overridenby2');
          expect(table.key3).toEqual('overridenby3');
          expect(table.key4).toEqual('overridenby3');
          done();
        }, function () {
          table = {};
        });

        $httpBackend.flush();
      });
    });

    it('should only make one HTTP request per language and part', function () {
      var $q,
        requests = [];

      module(function ($provide) {
        $provide.value('$http', function () {
          var request = $q.defer();

          requests.push(request);

          return request.promise;
        });
      });

      inject(function ($translatePartialLoader, _$q_, $rootScope) {
        var table;

        $q = _$q_;

        $translatePartialLoader.addPart('part1');
        $translatePartialLoader.addPart('part2');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        }).then(function (data) {
          table = data;
        }, function () {
          table = {};
        });

        $translatePartialLoader.addPart('part3');
        $translatePartialLoader({
          key : 'en',
          urlTemplate : '/locales/{part}-{lang}.json'
        }).then(function (data) {
          table = data;
        }, function () {
          table = {};
        });

        expect(requests.length).toEqual(3);

        requests[0].resolve({data : {key1 : 'value1'}});
        requests[1].resolve({data : {key2 : 'value2'}});
        requests[2].resolve({data : {key3 : 'value3'}});
        $rootScope.$digest();

        expect(table.key1).toEqual('value1');
        expect(table.key2).toEqual('value2');
        expect(table.key3).toEqual('value3');

        $translatePartialLoader({
          key : 'en_x',
          urlTemplate : '/locales/{part}-{lang}.json'
        }).then(function (data) {
          table = data;
        }, function () {
          table = {};
        });

        expect(requests.length).toEqual(6);

        requests[3].resolve({data : {key1 : 'value4'}});
        requests[4].resolve({data : {key2 : 'value5'}});
        requests[5].resolve({data : {key3 : 'value6'}});
        $rootScope.$digest();

        expect(table.key1).toEqual('value4');
        expect(table.key2).toEqual('value5');
        expect(table.key3).toEqual('value6');
      });
    });
  });

});
