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

  describe('$translateStaticFilesLoader with file format adapter', function () {
    var $httpBackend, $translateStaticFilesLoader, $customFileFormat;

    function parseQS(text) {
      var o = {};
      text.split('&').forEach(function(pair) {
        var two = pair.split('=');
        o[two[0]] = two[1];
      });
      return o;
    }

    beforeEach(module('pascalprecht.translate', function ($provide) {
      $provide.value('$customFileFormat', parseQS);
    }));

    beforeEach(inject(function (_$httpBackend_, _$translateStaticFilesLoader_, _$customFileFormat_) {
      $httpBackend = _$httpBackend_;
      $translateStaticFilesLoader = _$translateStaticFilesLoader_;
      $customFileFormat = _$customFileFormat_;

      $httpBackend.when('GET', 'lang_de_DE.properties').respond('a=b');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should adapt the response', function () {
      $httpBackend.expectGET('lang_de_DE.properties');
      var table;

      $translateStaticFilesLoader({
        key: 'de_DE',
        prefix: 'lang_',
        suffix: '.properties',
        responseHandler: $customFileFormat
      }).then(function(_table_) { 
        table = _table_;
      });

      $httpBackend.flush();

      expect(table).toEqual({a: 'b'});
    });
  });
});
