describe('pascalprecht.translate', function () {

  describe('$translateUrlLoader', function () {

    var $translate, $httpBackend, $translateUrlLoader;

    beforeEach(module('pascalprecht.translate'));

    beforeEach(inject(function (_$translate_, _$httpBackend_, _$translateUrlLoader_, _$translationCache_) {
      $translate = _$translate_;
      $httpBackend = _$httpBackend_;
      $translateUrlLoader = _$translateUrlLoader_;
      $translationCache = _$translationCache_;

      $httpBackend.when('GET', 'foo/bar.json?lang=de_DE').respond({
        it: 'works'
      });
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined', function () {
      expect($translateUrlLoader).toBeDefined();
    });

    it('should be a function', function () {
      expect(typeof $translateUrlLoader).toBe('function');
    });

    it('should throw an error when called without url option', function () {
      expect(function () {
        $translateUrlLoader();
      }).toThrow('Couldn\'t use urlLoader since no url is given!');
    });

    it('should fetch url when invoking', function () {
      $httpBackend.expectGET('foo/bar.json?lang=de_DE');
      $translateUrlLoader({
        key: 'de_DE',
        url: 'foo/bar.json'
      });
      $httpBackend.flush();
    });

    it('should put a translation table into a cache', function() {
      $httpBackend.expectGET('foo/bar.json?lang=de_DE');
        $translateUrlLoader({
        key: 'de_DE',
        url: 'foo/bar.json',
        $http: {
          cache: $translationCache
        }
      });
      $httpBackend.flush();
      expect($translationCache.info().size).toEqual(1);
    });

    it('should return a promise', function () {
      var promise = $translateUrlLoader({
        key: 'de_DE',
        url: 'foo/bar.json'
      });
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
      $httpBackend.flush();
    });
  });

  describe('$translateProvider#useUrlLoader', function () {
    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.useUrlLoader('foo/bar.json');
    }));

    var $translate, $httpBackend;

    beforeEach(inject(function (_$translate_, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $translate = _$translate_;

      $httpBackend.when('GET', 'foo/bar.json?lang=de_DE').respond({it: 'works'});
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch url when invoking #use', function () {
      $httpBackend.expectGET('foo/bar.json?lang=de_DE');
      $translate.use('de_DE');
      $httpBackend.flush();
    });
  });

  describe('$translateProvider#useUrlLoader with custom $http options (method=POST)', function () {
    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.useUrlLoader('foo/bar.json', {
        $http: {
          method: 'POST'
        }
      });
    }));

    var $translate, $httpBackend;

    beforeEach(inject(function (_$translate_, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $translate = _$translate_;

      $httpBackend.when('POST', 'foo/bar.json?lang=de_DE').respond({it: 'works'});
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch url when invoking #use', function () {
      $httpBackend.expectPOST('foo/bar.json?lang=de_DE');
      $translate.use('de_DE');
      $httpBackend.flush();
    });
  });
});
