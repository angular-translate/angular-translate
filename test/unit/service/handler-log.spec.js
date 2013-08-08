describe('pascalprecht.translate', function () {

  describe('$translateMissingTranslationHandlerLog', function () {

    beforeEach(module('pascalprecht.translate'));

    it('should be defined', function () {
      inject(function ($translateMissingTranslationHandlerLog) {
        expect($translateMissingTranslationHandlerLog).toBeDefined();
      });
    });

    it('should be a function', function () {
      inject(function ($translateMissingTranslationHandlerLog) {
        expect(typeof $translateMissingTranslationHandlerLog).toBe('function');
      });
    });

    it('should use $log service to log message', function () {
      inject(function ($translateMissingTranslationHandlerLog, $log) {
        spyOn($log, 'warn');
        $translateMissingTranslationHandlerLog();
        expect($log.warn).toHaveBeenCalled();
      });
    });

    it('should log the right message', function () {
      inject(function ($translateMissingTranslationHandlerLog, $log) {
        spyOn($log, 'warn');
        $translateMissingTranslationHandlerLog('MISSING_TRANSLATION_ID');
        expect($log.warn)
          .toHaveBeenCalledWith('Translation for MISSING_TRANSLATION_ID doesn\'t exist');
      });
    });
  });

  describe('missingTranslationHandler', function () {

    describe('useMissingTranslationHandler()', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
      }));

      it('should use given missing translation handler service', function () {
        inject(function ($translate, $log) {
          spyOn($log, 'warn');
          $translate('MISSING_TRANSLATION_ID');
          expect($log.warn).toHaveBeenCalled();
        });
      });

      it('should log the right message', function () {
        inject(function($translate, $log) {
          spyOn($log, 'warn');
          $translate('MISSING_TRANSLATION_ID');
          expect($log.warn)
            .toHaveBeenCalledWith('Translation for MISSING_TRANSLATION_ID doesn\'t exist');
        });
      });
    });

    describe('useMissingTranslationHandlerLog()', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider.useMissingTranslationHandlerLog();
      }));

      it('should use $log service to log missing translation message', function () {
        inject(function ($translate, $log) {
          spyOn($log, 'warn');
          $translate('MISSING_TRANSLATION_ID');
          expect($log.warn).toHaveBeenCalled();
        });
      });

      it('should log the right message', function () {
        inject(function($translate, $log) {
          spyOn($log, 'warn');
          $translate('MISSING_TRANSLATION_ID');
          expect($log.warn)
            .toHaveBeenCalledWith('Translation for MISSING_TRANSLATION_ID doesn\'t exist');
        });
      });
    });
  });
});
