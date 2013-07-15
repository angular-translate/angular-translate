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

    it('should have a method load()', function () {
      inject(function ($translate) {
        expect($translate.load).toBeDefined();
      });
    });

    it('should have a method preferredLanguage()', function() {
      inject(function ($translate) {
        expect($translate.preferredLanguage).toBeDefined();
      });
    });
    it('should have a method fallbackLanguage()', function() {
      inject(function ($translate) {
        expect($translate.fallbackLanguage).toBeDefined();
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

    describe('load()', function () {

      it('should be a function', function () {
        inject(function ($translate) {
          expect(typeof $translate.load).toBe('function');
        });
      });

      it('should throw an error if no language is specified', function () {
        inject(function ($translate) {
          expect(function () {$translate.load();}).toThrow();
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


    describe('fallbackLanguage()', function() {

      it('should be a function', function() {
        inject(function($translate){
          expect(typeof $translate.fallbackLanguage).toBe('function');
        });
      });

      it ('should return undefined if no language is specified', function() {
        inject(function($translate){
          expect($translate.fallbackLanguage()).toBeUndefined();
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
      $translateProvider.fallbackLanguage('en_EN');

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

  describe('$translateService#fallbackLanguage()', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.translations('foo', {
        'TRANSLATION_ID': 'foo',
        'TRANSLATION__ID': 'booyaka'
      });

      $translateProvider.translations('bar', {
        'TRANSLATION__ID': 'bazinga'
      });

      $translateProvider.preferredLanguage('bar');
      $translateProvider.fallbackLanguage('foo');
    }));

    it ('should return a string if language is specified', function() {
      inject(function($translate){
        expect(typeof $translate.fallbackLanguage()).toBe('string');
      });
    });

    it ('should return a correct language code', function() {
      inject(function($translate){
        expect($translate.fallbackLanguage()).toEqual('foo');
      });
    });

    it ('should use fallback language if translation id doesn\'t exist', function () {
      inject(function ($translate) {
        expect($translate('TRANSLATION__ID')).toEqual('bazinga');
        expect($translate('TRANSLATION_ID')).toEqual('foo');
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
      $translateProvider.fallbackLanguage('en_EN');
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

  describe('using async loaders', function () {

    describe('loader returning single promise', function () {
      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

        $translateProvider.useLoader('customLoader', {});

        $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {
          return function (options) {
            var deferred = $q.defer();
            var key = options.key;

            
            if (key === 'en') {
              $timeout(function () {
                deferred.resolve({
                  FOO: 'bar'
                });
              }, 1000);
            } else if (key === 'ne') {
              $timeout(function () {
                deferred.resolve({
                  FOO: 'foo',
                  BAR: 'bar'
                });
              }, Infinity);
            } else if (key === 'tt') {
              $timeout(function () {
                deferred.resolve({
                  FOO: 'foofoo',
                  BAR: 'barbar'
                });
              }, Infinity);
            }

            return deferred.promise;
          };
        }]);

        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage('ne');
      }));

      it('should use custom loader to load preferredLanguage', function () {
        inject(function ($translate, $timeout) {
          $timeout.flush();
          expect($translate('FOO')).toEqual('bar');
        });
      });

      it('should use custom loader to load fallbackLanguage', function () {
        inject(function ($translate, $timeout) {
          $timeout.flush();
          expect($translate('BAR')).toEqual('bar');
        });
      });

      it('should be able to load a language without using it', function () {
        inject(function ($translate, $timeout) {
          $translate.load('tt');
          expect($translate('BAR')).toEqual('BAR');
          $timeout.flush();
          $translate.uses('tt');
          expect($translate('BAR')).toEqual('barbar');
        });
      });
    });

    describe('loader returning multiple promises', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

        $translateProvider.useLoader('customLoader');

        $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {
          return function (options) {
            var firstDeferred = $q.defer(),
                secondDeferred = $q.defer();

            $timeout(function () {
              firstDeferred.resolve({
                FOO: 'bar'
              });
            });

            $timeout(function () {
              secondDeferred.resolve({
                BAR: 'foo'
              });
            });

            return $q.all([firstDeferred.promise, secondDeferred.promise]);
          };
        }]);

        $translateProvider.preferredLanguage('en');
      }));

      it('should be able to handle multiple promises', function () {
        inject(function ($translate, $timeout) {
          $timeout.flush();
          expect($translate('FOO')).toEqual('bar');
          expect($translate('BAR')).toEqual('foo');
        });
      });
    });

  });

  describe('missing translation handling', function () {

    var hasBeenCalled = false;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      // consider we have a custom loader, which needs a bit 'til it returns translation
      // data
      $provide.factory('customLoader', function ($timeout, $q) {
        return function (options) {
          var deferred = $q.defer(),
              translations = {
                'FOO': 'BAR'
              };

          $timeout(function () {
            deferred.resolve(translations);
          }, 2000);

          return deferred.promise;
        };
      });

      // we also have a custom missing translation handler which gets called, when
      // trying to translate translation ids that aren't existing.
      $provide.factory('customMissingTranslationHandler', function () {
        return function (translationId) {
          hasBeenCalled = true;
        };
      });

      // finally, we make use of both
      $translateProvider.useLoader('customLoader', {});
      $translateProvider.useMissingTranslationHandler('customMissingTranslationHandler');
      $translateProvider.preferredLanguage('en_US');
    }));

    it('shouldn\'t call when there is a pending loader', function () {
      inject(function ($translate, $timeout) {
        expect($translate('FOO')).toEqual('FOO');
        // missingTranslationHandler should not has been called, because i18n data
        // is loaded asynchronously it should wait, once its loaded.
        expect(hasBeenCalled).toBe(false);
        $timeout.flush();
        expect($translate('FOO')).toEqual('BAR');
        expect($translate('MISSING_ONE')).toEqual('MISSING_ONE');
        expect(hasBeenCalled).toBe(true);
      });
    });
  });
});
