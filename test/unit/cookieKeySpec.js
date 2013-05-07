describe('ngTranslate', function () {

  describe('$COOKIE_KEY', function () {

    beforeEach(module('ngTranslate'));

    it('should be defined', function () {
      inject(function ($COOKIE_KEY) {
        expect($COOKIE_KEY).toBeDefined();
      });
    });

    it('should be a string', function () {
      inject(function ($COOKIE_KEY) {
        expect(typeof $COOKIE_KEY).toBe('string');
      });
    });

    it('should return the cookie key', function () {
      inject(function ($COOKIE_KEY) {
        expect($COOKIE_KEY).toBe('NG_TRANSLATE_LANG_KEY');
      });
    });
  });
});
