describe('pascalprecht.translate', function () {

  describe('$translateService', function () {

    beforeEach(module('pascalprecht.translate'));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should be defined', function () {
      inject(function ($translate) {
        expect($translate).toBeDefined();
      });
    });

    it('should be a function object', function () {
      inject(function ($translate) {
        expect(typeof $translate).toBe("function");
      });
    });

    it('should have a method uses()', function () {
      inject(function ($translate) {
        expect($translate.uses).toBeDefined();
      });
    });

    it('should have a method preferredLanguage()', function() {
      inject(function ($translate) {
        expect($translate.preferredLanguage).toBeDefined();
      });
    });

    it('should have a method storageKey()', function() {
      inject(function ($translate) {
        expect($translate.storageKey).toBeDefined();
      });
    });

    describe('uses()', function () {

      it('should be a function', function () {
        inject(function ($translate) {
          expect(typeof $translate.uses).toBe('function');
        });
      });

      it('should return undefined if no language is specified', function () {
        inject(function ($translate) {
          expect($translate.uses()).toBeUndefined();
        });
      });

    });

    describe('preferredLanguage()', function() {

      it('should be a function', function() {
        inject(function($translate){
          expect(typeof $translate.preferredLanguage).toBe('function');
        });
      });

      it ('should return undefined if no language is specified', function() {
        inject(function($translate){
          expect($translate.preferredLanguage()).toBeUndefined();
        });
      });

    });

    describe('storageKey()', function () {

      it('should be a function', function () {
        inject(function ($translate) {
          expect(typeof $translate.storageKey).toBe('function');
        });
      });

      it('should return a string', function () {
        inject(function($translate) {
          expect(typeof $translate.storageKey()).toBe('string');
        });
      });

      it('should be equal to $STORAGE_KEY by default', function() {
        inject(function ($translate, $STORAGE_KEY) {
          expect($translate.storageKey()).toEqual($STORAGE_KEY);
        });
      });

    });

  });

  describe('$translateService (single-lang)', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.translations({
        'EXISTING_TRANSLATION_ID': 'foo',
        'BLANK_VALUE': '',
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
      });

      $translateProvider.translations({
        'FOO': 'bar',
        'BAR': 'foo'
      });
    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should return translation id if translation doesn\'t exist', function () {
      var translationId = 'NOT_EXISTING_TRANSLATION_ID';
      inject(function ($translate) {
        expect($translate(translationId)).toEqual(translationId);
      });
    });

    it('should return translation if translation id if exists', function () {
      inject(function ($translate) {
        expect($translate("EXISTING_TRANSLATION_ID")).toEqual('foo');
        expect($translate("BLANK_VALUE")).toEqual('');
      });
    });

    it('should replace interpolate directives with empty string if no values given', function () {
      inject(function ($translate) {
        expect($translate('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      });
    });

    it('should replace interpolate directives with given values', function () {
      inject(function ($translate) {
        expect($translate('TRANSLATION_ID', { value: 'foo'})).toEqual('Lorem Ipsum foo');
        expect($translate('TRANSLATION_ID_2', { value: 'foo'})).toEqual('Lorem Ipsum foo + foo');
        expect($translate('TRANSLATION_ID_3', { value: 'foo'})).toEqual('Lorem Ipsum foofoo');
        expect($translate('TRANSLATION_ID_3', { value: '3'})).toEqual('Lorem Ipsum 33');
        expect($translate('TRANSLATION_ID_3', { value: 3})).toEqual('Lorem Ipsum 6');
      });
    });

    it('should extend translation table rather then overwriting it', function () {
      inject(function ($translate) {
        expect($translate('FOO')).toEqual('bar');
        expect($translate('BAR')).toEqual('foo');
      });
    });
  });

  describe('$translateService (multi-lang)', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.translations('de_DE', {
        'EXISTING_TRANSLATION_ID': 'foo',
        'ANOTHER_ONE': 'bar',
        'BLANK_VALUE': '',
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
        'YET_ANOTHER': 'Hallo da!'
      });
      $translateProvider.translations('de_DE', {
        'FOO': 'bar'
      });
      $translateProvider.translations('en_EN', {
        'YET_ANOTHER': 'Hello there!'
      });
      $translateProvider.translations('en_EN', {
        'FOO': 'bar'
      });
      $translateProvider.uses('de_DE');
      $translateProvider.preferredLanguage('en_EN');
      $translateProvider.preferredLanguage('de_DE');
      $translateProvider.storageKey('lang');
    }));

    var $translate, $rootScope, $compile;

    beforeEach(inject(function (_$translate_, _$rootScope_, _$compile_) {
      $translate = _$translate_;
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    }));

    it('should return translation id if language is given and translation id doesn\'t exist', function () {
      inject(function ($translate) {
        expect($translate('NON_EXISTING_TRANSLATION_ID')).toEqual('NON_EXISTING_TRANSLATION_ID');
      });
    });

    it('should return translation when language is given and translation id exist', function () {
      inject(function ($translate) {
        expect($translate('EXISTING_TRANSLATION_ID')).toEqual('foo');
        expect($translate('ANOTHER_ONE')).toEqual('bar');
        expect($translate('BLANK_VALUE')).toEqual('');
      });
    });

    it('should replace interpolate directives with empty string if no values given and language is specified', function () {
      inject(function ($translate) {
        expect($translate('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      });
    });

    it('should replace interpolate directives with given values when language is specified', function () {
      inject(function ($translate) {
        expect($translate('TRANSLATION_ID', { value: 'foo'})).toEqual('Lorem Ipsum foo');
        expect($translate('TRANSLATION_ID_2', { value: 'foo'})).toEqual('Lorem Ipsum foo + foo');
        expect($translate('TRANSLATION_ID_3', { value: 'foo'})).toEqual('Lorem Ipsum foofoo');
        expect($translate('TRANSLATION_ID_3', { value: '3'})).toEqual('Lorem Ipsum 33');
        expect($translate('TRANSLATION_ID_3', { value: 3})).toEqual('Lorem Ipsum 6');
      });
    });

    it('should extend translation table rather then overwriting it', function () {
      inject(function ($translate) {
        expect($translate('FOO')).toEqual('bar');
        $translate.uses('en_EN');
        expect($translate('FOO')).toEqual('bar');
      });
    });

    describe('$translateService#uses()', function () {

      it('should return a string', function () {
        inject(function ($translate) {
          expect(typeof $translate.uses()).toBe('string');
        });
      });

      it('should return language key', function () {
        inject(function ($translate) {
          expect($translate.uses()).toEqual('de_DE');
        });
      });

      it('should change language at runtime', function () {
        inject(function ($translate) {
          expect($translate('YET_ANOTHER')).toEqual('Hallo da!');
          $translate.uses('en_EN');
          expect($translate('YET_ANOTHER')).toEqual('Hello there!');
        });
      });

      it('should change language and take effect in the UI', function () {
        inject(function ($rootScope, $compile, $translate) {
          element = $compile('<div translate="YET_ANOTHER"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hallo da!');

          $translate.uses('en_EN');
          element = $compile('<div translate="YET_ANOTHER"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');
        });
      });
    });

    describe('$translateService#storageKey()', function () {

      it('should allow to change the storage key during config', function() {
        inject(function($translate, $STORAGE_KEY) {
          expect($translate.storageKey()).toNotEqual($STORAGE_KEY);
        });
      });

      it('shouldn\'t allow to change the storage key during runtime', function() {
        inject(function($translate, $STORAGE_KEY) {
          var prevKey = $translate.storageKey();
          $translate.storageKey(prevKey + "somestring");
          expect($translate.storageKey()).toEqual(prevKey);
        });
      });

    });

    describe('$translateService#preferredLanguage()', function () {

      it ('should return a string if language is specified', function() {
        inject(function($translate){
          expect(typeof $translate.preferredLanguage()).toBe('string');
        });
      });

      it ('should return a correct language code', function() {
        inject(function($translate){
          expect($translate.preferredLanguage()).toEqual('de_DE');
        });
      });

      it('should allow to change preferred language during config', function() {
        inject(function($translate){
          expect($translate.preferredLanguage()).toEqual('de_DE');
        });
      });

      it('shouldn\'t allow to change preferred language during runtime', function() {
        inject(function($translate){
          var prevLang = $translate.preferredLanguage();
          $translate.preferredLanguage(prevLang === 'de_DE' ? 'en_EN' : 'de_DE');
          expect($translate.preferredLanguage()).toBe(prevLang);
        });
      });

    });

  });

  describe('where data is a nested object structure (namespace support)', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.translations('en_US', {
       "DOCUMENT" : {
          "HEADER" : {
            "TITLE" : "Header"
          },
          "SUBHEADER" : {
            "TITLE" : "2. Header"
          }
        }
      });
    }));

    it('implicit invoking loader should be successful', inject(function ($translate, $timeout) {
      $translate.uses('en_US');
      expect($translate('DOCUMENT.HEADER.TITLE')).toEqual('Header');
      expect($translate('DOCUMENT.SUBHEADER.TITLE')).toEqual('2. Header');
    }));

  });

  describe('if language is specified',function(){
    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.translations('de_DE', {});
      $translateProvider.translations('en_EN', {});
      $translateProvider.preferredLanguage('en_EN');
    }));

    var $translate;
    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it ('uses method should use the preferredLanguage if no storage is used', function() {
      inject(function($translate){
        expect($translate.uses()).toEqual($translate.preferredLanguage());
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
