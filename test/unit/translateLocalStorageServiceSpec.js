describe('ngTranslate', function () {

  describe('$translateLocalStorage', function () {


    beforeEach(module('ngTranslate'));

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
});
