describe('ngTranslate', function () {

  describe('$translateCookieStorage', function () {

    beforeEach(module('ngTranslate', 'ngCookies'));

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
});
