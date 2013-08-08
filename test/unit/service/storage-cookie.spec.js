describe('pascalprecht.translate', function () {

  describe('$translateCookieStorage', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies'));

    it('should be defined', function () {
      inject(function ($translateCookieStorage) {
        expect($translateCookieStorage).toBeDefined();
      });
    });

    it('should be an object', function () {
      inject(function ($translateCookieStorage) {
        expect(typeof $translateCookieStorage).toBe('object');
      });
    });

    it('should have a set() and a get() method', function () {
      inject(function ($translateCookieStorage) {
        expect($translateCookieStorage.get).toBeDefined();
        expect($translateCookieStorage.set).toBeDefined();
      });
    });

    describe('get()', function () {

      it('should be a function', function () {
        inject(function ($translateCookieStorage) {
          expect(typeof $translateCookieStorage.get).toBe('function');
        });
      });

    });

    describe('set()', function () {
      it('should be a function', function () {
        inject(function ($translateCookieStorage) {
          expect(typeof $translateCookieStorage.set).toBe('function');
        });
      });
    });
  });

  describe('useCookieStorage()', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies', function ($translateProvider) {
      $translateProvider.translations('de_DE', {
        'EXISTING_TRANSLATION_ID': 'foo',
        'ANOTHER_ONE': 'bar',
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
        'YET_ANOTHER': 'Hallo da!'
      });
      $translateProvider.preferredLanguage('de_DE');

      $translateProvider.useCookieStorage();
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

    it('should be defined', function () {
      inject(function ($translate) {
        expect($translate.storage).toBeDefined();
      });
    });

    it('should be a function', function () {
      inject(function ($translate) {
        expect(typeof $translate.storage).toBe('function');
      });
    });

    it('should return registered storage instance if exists', function () {
      inject(function ($translate) {
        expect(typeof $translate.storage()).toBe('object');
        expect($translate.storage().set).toBeDefined();
        expect($translate.storage().get).toBeDefined();
      });
    });
  });
});
