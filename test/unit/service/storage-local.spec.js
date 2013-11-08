describe('pascalprecht.translate', function () {

  describe('$translateLocalStorage', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies'));

    it('should be defined', function () {
      inject(function ($translateLocalStorage) {
        expect($translateLocalStorage).toBeDefined();
      });
    });

    it('should be an object', function () {
      inject(function ($translateLocalStorage) {
        expect(typeof $translateLocalStorage).toBe('object');
      });
    });

    it('should have a set() and a get() method', function () {
      inject(function ($translateLocalStorage) {
        expect($translateLocalStorage.get).toBeDefined();
        expect($translateLocalStorage.set).toBeDefined();
      });
    });

    describe('get()', function () {

      it('should be a function', function () {
        inject(function ($translateLocalStorage) {
          expect(typeof $translateLocalStorage.get).toBe('function');
        });
      });

    });

    describe('set()', function () {
      it('should be a function', function () {
        inject(function ($translateLocalStorage) {
          expect(typeof $translateLocalStorage.set).toBe('function');
        });
      });
    });

  });

  describe('useLocalStorage()', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies', function ($translateProvider) {
      // ensure that the local storage is cleared.
      window.localStorage.clear();
      $translateProvider.translations('de_DE', {
        'EXISTING_TRANSLATION_ID': 'foo',
        'ANOTHER_ONE': 'bar',
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
        'YET_ANOTHER': 'Hallo da!'
      });
      $translateProvider.preferredLanguage('de_DE');

      $translateProvider.useLocalStorage();
    }));

    it('should use localstorage', function () {
      inject(function ($window, $translate) {
        expect($translate.storage().get($translate.storageKey())).toEqual('de_DE');
      });
    });
  });
});
