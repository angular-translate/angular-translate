describe('pascalprecht.translate', function () {

  describe('$STORAGE_KEY', function () {

    beforeEach(module('pascalprecht.translate'));

    it('should be defined', function () {
      inject(function ($STORAGE_KEY) {
        expect($STORAGE_KEY).toBeDefined();
      });
    });

    it('should be a string', function () {
      inject(function ($STORAGE_KEY) {
        expect(typeof $STORAGE_KEY).toBe('string');
      });
    });

    it('should return the cookie key', function () {
      inject(function ($STORAGE_KEY) {
        expect($STORAGE_KEY).toBe('NG_TRANSLATE_LANG_KEY');
      });
    });
  });
});
