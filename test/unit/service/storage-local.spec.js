describe('pascalprecht.translate', function () {

  describe('$translateLocalStorage', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies'));

    var $translateLocalStorage;

    beforeEach(inject(function (_$translateLocalStorage_) {
      $translateLocalStorage = _$translateLocalStorage_;
    }));

    it('should be defined', function () {
      expect($translateLocalStorage).toBeDefined();
    });

    it('should be an object', function () {
      expect(typeof $translateLocalStorage).toBe('object');
    });

    it('should have a set() and a get() method', function () {
      expect($translateLocalStorage.get).toBeDefined();
      expect($translateLocalStorage.set).toBeDefined();
    });

    describe('$translateLocalStorage#get', function () {

      it('should be a function', function () {
        expect(typeof $translateLocalStorage.get).toBe('function');
      });
    });

    describe('$translateLocalStorage#set()', function () {
      it('should be a function', function () {
        expect(typeof $translateLocalStorage.set).toBe('function');
      });
    });

  });

  describe('$translateProvider#useLocalStorage', function () {

    beforeEach(module('pascalprecht.translate', 'ngCookies', function ($translateProvider) {
      // ensure that the local storage is cleared.
      window.localStorage.clear();
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
        .useLocalStorage();
    }));

    it('should use localstorage', function () {
      inject(function ($window, $translate) {
        expect($translate.storage().get($translate.storageKey())).toEqual('de_DE');
      });
    });
  });
});
