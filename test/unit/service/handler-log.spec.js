describe('pascalprecht.translate', function () {

  describe('$translateMissingTranslationHandlerLog', function () {

    beforeEach(module('pascalprecht.translate'));

    var $translateMissingTranslationHandlerLog, $log;

    beforeEach(inject(function (_$translateMissingTranslationHandlerLog_, _$log_) {
      $translateMissingTranslationHandlerLog = _$translateMissingTranslationHandlerLog_;
      $log = _$log_;
    }));

    it('should be defined', function () {
      expect($translateMissingTranslationHandlerLog).toBeDefined();
    });

    it('should be a function', function () {
      expect(typeof $translateMissingTranslationHandlerLog).toBe('function');
    });

    it('should use $log service to log message', function () {
      spyOn($log, 'warn');
      $translateMissingTranslationHandlerLog();
      expect($log.warn).toHaveBeenCalled();
    });

    it('should log the right message', function () {
      spyOn($log, 'warn');
      $translateMissingTranslationHandlerLog('MISSING_TRANSLATION_ID');
      expect($log.warn)
        .toHaveBeenCalledWith('Translation for MISSING_TRANSLATION_ID doesn\'t exist');
    });
  });

  describe('$translateProvider#useMissingTranslationHandler', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
    }));

    var $translate, $log;

    beforeEach(inject(function (_$translate_, _$log_) {
      $translate = _$translate_;
      $log = _$log_;
    }));

    it('should use given missing translation handler service', function () {
      spyOn($log, 'warn');
      $translate('MISSING_TRANSLATION_ID');
      expect($log.warn).toHaveBeenCalled();
    });

    it('should log the right message', function () {
      spyOn($log, 'warn');
      $translate('MISSING_TRANSLATION_ID');
      expect($log.warn)
        .toHaveBeenCalledWith('Translation for MISSING_TRANSLATION_ID doesn\'t exist');
    });
  });

  describe('$translateProvider#useMissingTranslationHandlerLog', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.useMissingTranslationHandlerLog();
    }));

    var $translate, $log;

    beforeEach(inject(function (_$translate_, _$log_) {
      $translate = _$translate_;
      $log = _$log_;
    }));

    it('should use $log service to log missing translation message', function () {
      spyOn($log, 'warn');
      $translate('MISSING_TRANSLATION_ID');
      expect($log.warn).toHaveBeenCalled();
    });

    it('should log the right message', function () {
      spyOn($log, 'warn');
      $translate('MISSING_TRANSLATION_ID');
      expect($log.warn)
        .toHaveBeenCalledWith('Translation for MISSING_TRANSLATION_ID doesn\'t exist');
    });
  });
});
