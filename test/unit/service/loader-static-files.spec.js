describe('pascalprecht.translate', function () {

  describe('$translateStaticFilesLoader', function () {

    var $translate, $httpBackend, $translateStaticFilesLoader;

    beforeEach(module('pascalprecht.translate'));

    beforeEach(inject(function (_$translate_, _$httpBackend_, _$translateStaticFilesLoader_, _$translationCache_) {
      $httpBackend = _$httpBackend_;
      $translate = _$translate_;
      $translateStaticFilesLoader = _$translateStaticFilesLoader_;
      $translationCache = _$translationCache_;

      $httpBackend.when('GET', 'lang_de_DE.json').respond({HEADER: 'Ueberschrift'});
      $httpBackend.when('GET', 'lang_en_US.json').respond({HEADER:'Header'});
      $httpBackend.when('GET', 'lang_nt_VD.json').respond(404);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined', function () {
      expect($translateStaticFilesLoader).toBeDefined();
    });

    it('should be a function', function () {
      expect(typeof $translateStaticFilesLoader).toBe('function');
    });

    it('should throw an error when called without prefix or suffix', function () {
      expect(function () {
        $translateStaticFilesLoader();
      }).toThrow('Couldn\'t load static files, no prefix or suffix specified!');
    });

    it('should fetch static files when invoking', function () {
      $httpBackend.expectGET('lang_de_DE.json');
      $translateStaticFilesLoader({
        key: 'de_DE',
        prefix: 'lang_',
        suffix: '.json'
      });
      $httpBackend.flush();
    });

    it('should return a promise', function () {
      var promise = $translateStaticFilesLoader({
        key: 'de_DE',
        prefix: 'lang_',
        suffix: '.json'
      });
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
      $httpBackend.flush();
    });

    it('should put a translation table into a cache', function() {
      $httpBackend.expectGET('lang_de_DE.json');
      $translateStaticFilesLoader({
        key: 'de_DE',
        prefix: 'lang_',
        suffix: '.json',
        $http: {
          cache: $translationCache
        }
      });
      $httpBackend.flush();
      expect($translationCache.info().size).toEqual(1);
    });
  });

  describe('$translateStaticFilesLoader with custom options (method=POST)', function () {

    var $translate, $httpBackend, $translateStaticFilesLoader;

    beforeEach(module('pascalprecht.translate'));

    beforeEach(inject(function (_$translate_, _$httpBackend_, _$translateStaticFilesLoader_) {
      $httpBackend = _$httpBackend_;
      $translate = _$translate_;
      $translateStaticFilesLoader = _$translateStaticFilesLoader_;

      $httpBackend.when('POST', 'lang_de_DE.json').respond({HEADER: 'Ueberschrift'});
      $httpBackend.when('POST', 'lang_en_US.json').respond({HEADER:'Header'});
      $httpBackend.when('POST', 'lang_nt_VD.json').respond(404);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined', function () {
      expect($translateStaticFilesLoader).toBeDefined();
    });

    it('should be a function', function () {
      expect(typeof $translateStaticFilesLoader).toBe('function');
    });

    it('should throw an error when called without prefix or suffix', function () {
      expect(function () {
        $translateStaticFilesLoader({
          $http: {
            method: 'POST'
          }
        });
      }).toThrow('Couldn\'t load static files, no prefix or suffix specified!');
    });

    it('should fetch static files when invoking', function () {
      $httpBackend.expectPOST('lang_de_DE.json');
      $translateStaticFilesLoader({
        key: 'de_DE',
        prefix: 'lang_',
        suffix: '.json',
        $http: {
          method: 'POST'
        }
      });
      $httpBackend.flush();
    });
  });

});
