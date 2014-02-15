describe('pascalprecht.translate', function () {

  describe('$translateCookieStorage', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies'));

    var $translateCookieStorage;

    beforeEach(inject(function (_$translateCookieStorage_) {
      $translateCookieStorage = _$translateCookieStorage_;
    }));

    it('should be defined', function () {
      expect($translateCookieStorage).toBeDefined();
    });

    it('should be an object', function () {
      expect(typeof $translateCookieStorage).toBe('object');
    });

    it('should have a set() and a get() method', function () {
      expect($translateCookieStorage.get).toBeDefined();
      expect($translateCookieStorage.set).toBeDefined();
    });

    describe('$translateCookieStorage#get', function () {

      it('should be a function', function () {
        expect(typeof $translateCookieStorage.get).toBe('function');
      });
    });

    describe('$translateCookieStorage#set', function () {
      it('should be a function', function () {
        expect(typeof $translateCookieStorage.set).toBe('function');
      });
    });
  });

  describe('$translateProvider#useCookieStorage', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies', function ($translateProvider) {
      $translateProvider
        .translations('de_DE', {
          'EXISTING_TRANSLATION_ID': 'foo',
          'ANOTHER_ONE': 'bar',
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
          'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
          'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
          'YET_ANOTHER': 'Hallo da!'
        })
        .preferredLanguage('de_DE')
        .useCookieStorage();
    }));

    it('should use cookieStorage', function () {
      inject(function ($translate) {
        expect($translate.storage().get($translate.storageKey())).toEqual('de_DE');
      });
    });
  });

  describe('$translate#storage', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies', function ($translateProvider) {
      $translateProvider.useStorage('$translateCookieStorage');
    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should be defined', function () {
      expect($translate.storage).toBeDefined();
    });

    it('should be a function', function () {
      expect(typeof $translate.storage).toBe('function');
    });

    it('should return registered storage instance if exists', function () {
      expect(typeof $translate.storage()).toBe('object');
      expect($translate.storage().set).toBeDefined();
      expect($translate.storage().get).toBeDefined();
    });
  });
});
