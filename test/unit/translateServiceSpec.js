describe('ngTranslate', function () {

  describe('$translateService', function () {

    beforeEach(module('ngTranslate'));

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

    beforeEach(module('ngTranslate', function ($translateProvider) {
      $translateProvider.translations({
        'EXISTING_TRANSLATION_ID': 'foo',
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
      var translationId = "EXISTING_TRANSLATION_ID";
      inject(function ($translate) {
        expect($translate(translationId)).toEqual('foo');
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

    beforeEach(module('ngTranslate', function ($translateProvider) {
      $translateProvider.translations('de_DE', {
        'EXISTING_TRANSLATION_ID': 'foo',
        'ANOTHER_ONE': 'bar',
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

    beforeEach(module('ngTranslate', function ($translateProvider) {
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
    beforeEach(module('ngTranslate', function ($translateProvider) {
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

  describe('Asynchronous loading', function () {

    describe('register loader=null', function () {

      var exceptionMessage;

      beforeEach(module('ngTranslate', function ($translateProvider) {
        try {
          $translateProvider.registerLoader(null);
        } catch (ex) {
          exceptionMessage = ex.message;
        }
      }));

      it('should be throw an error', inject(function ($translate) {
        expect($translate.uses()).toBeUndefined();
        $translate.uses('de_DE');
        expect($translate.uses()).toBeUndefined();
        expect(exceptionMessage).toEqual('Please define a valid loader!');
      }));

    });

    describe('register loader=undefined', function () {

      var exceptionMessage;

      beforeEach(module('ngTranslate', function ($translateProvider) {
        try {
          $translateProvider.registerLoader(undefined);
        } catch (ex) {
          exceptionMessage = ex.message;
        }
      }));

      it('should be throw an error', inject(function ($translate) {
        expect($translate.uses()).toBeUndefined();
        $translate.uses('de_DE');
        expect($translate.uses()).toBeUndefined();
        expect(exceptionMessage).toEqual('Please define a valid loader!');
      }));

    });

    describe('register a loader (function) where data is a nested object structure (namespace support)', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
        $translateProvider.registerLoader(function ($q, $timeout) {
          return function (key) {
            var data = (key !== 'en_US') ? null : {
                "DOCUMENT" : {
                  "HEADER" : {
                    "TITLE" : "Header"
                  },
                  "SUBHEADER" : {
                    "TITLE" : "2. Header"
                  }
                }
            };
            var deferred = $q.defer();
            $timeout(function () {
              deferred.resolve(data);
            }, 200);
            return deferred.promise;
          };
        });
      }));

      it('implicit invoking loader should be successful', inject(function ($translate, $timeout) {
        var called = false;
        $translate.uses('en_US').then(function (){
          called = true;
        });
        $timeout.flush();
        expect(called).toEqual(true);
      }));

      it('implicit invoking loader should be successful', inject(function ($translate, $timeout) {
        var called = false;
        $translate.uses('en_US');
        $timeout.flush();
        expect($translate('DOCUMENT.HEADER.TITLE')).toEqual('Header');
        expect($translate('DOCUMENT.SUBHEADER.TITLE')).toEqual('2. Header');
      }));

    });

    describe('register loader via a function', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
        $translateProvider.registerLoader(function ($q, $timeout) {
          return function (key) {
            var data = (key !== 'de_DE') ? null : {
              'KEY1': 'Schluessel 1',
              'KEY2': 'Schluessel 2'
            };
            var deferred = $q.defer();
            $timeout(function () {
              deferred.resolve(data);
            }, 200);
            return deferred.promise;
          };
        });
      }));

      it('implicit invoking loader should be successful', inject(function ($translate, $timeout) {
        var called = false;
        $translate.uses('de_DE').then(function (){
          called = true;
        });
        $timeout.flush();
        expect(called).toEqual(true);
      }));

      it('should return the correct translation after change', inject(function ($translate, $timeout) {
        var called = false;
        // Check that the start point is the translation id itself.
        expect($translate('KEY1')).toEqual('KEY1');
        $translate.uses('de_DE');
        $timeout.flush(); // finish loader
        expect($translate('KEY1')).toEqual('Schluessel 1');
      }));

    });

    describe('register loader with useLoaderFactory()', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
        $translateProvider.useLoaderFactory(function ($q, $timeout) {
          return function (key) {
            var data = (key !== 'de_DE') ? null : {
              'KEY1': 'Schluessel 1',
              'KEY2': 'Schluessel 2'
            };
            var deferred = $q.defer();
            $timeout(function () {
              deferred.resolve(data);
            }, 200);
            return deferred.promise;
          };
        });
      }));

      it('implicit invoking loader should be successful', inject(function ($translate, $timeout) {
        var called = false;
        $translate.uses('de_DE').then(function (){
          called = true;
        });
        $timeout.flush();
        expect(called).toEqual(true);
      }));

      it('should return the correct translation after change', inject(function ($translate, $timeout) {
        var called = false;
        // Check that the start point is the translation id itself.
        expect($translate('KEY1')).toEqual('KEY1');
        $translate.uses('de_DE');
        $timeout.flush(); // finish loader
        expect($translate('KEY1')).toEqual('Schluessel 1');
      }));
    });

    describe('register loader as url string', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
        $translateProvider.registerLoader('foo/bar.json');
      }));

      var $translate, $httpBackend;

      beforeEach(inject(function (_$translate_, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $translate = _$translate_;

        $httpBackend.when('GET', 'foo/bar.json?lang=de_DE').respond({foo:'bar'});
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should fetch url when invoking #uses', function () {
        $httpBackend.expectGET('foo/bar.json?lang=de_DE');
        $translate.uses('de_DE');
        $httpBackend.flush();
      });
    });

    describe('register loader by static-files (using prefix, suffix)', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
        $translateProvider.registerLoader({type: 'static-files', prefix: 'lang_', suffix: '.json'});
      }));

      var $translate, $httpBackend;

      beforeEach(inject(function (_$translate_, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $translate = _$translate_;

        $httpBackend.when('GET', 'lang_de_DE.json').respond({HEADER: 'Ueberschrift'});
        $httpBackend.when('GET', 'lang_en_US.json').respond({HEADER:'Header'});
        $httpBackend.when('GET', 'lang_nt_VD.json').respond(404);
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should fetch url when invoking #uses(de_DE)', function () {
        $httpBackend.expectGET('lang_de_DE.json');
        $translate.uses('de_DE');
        $httpBackend.flush();
        expect($translate('HEADER')).toEqual('Ueberschrift');
      });

      it('should fetch url when invoking #uses(en_US)', function () {
        $httpBackend.expectGET('lang_en_US.json');
        $translate.uses('en_US');
        $httpBackend.flush();
        expect($translate('HEADER')).toEqual('Header');
      });

      it('should fetch url when invoking #uses invalid', function () {
        $httpBackend.expectGET('lang_nt_VD.json');
        $translate.uses('nt_VD');
        $httpBackend.flush();
        expect($translate('HEADER')).toEqual('HEADER');
      });
    });
  });

  describe('Storage', function () {

    describe('$translate#storage', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
        $translateProvider.useStorage('$translateLocalStorage');
      }));

      it('should be defined', function () {
        inject(function ($translate) {
          expect($translate.storage).toBeDefined();
        });
      });

      it('should be a function', function () {
        inject(function ($translate) {
          expect(typeof $translate.storage).toBe('function');
        });
      });

      it('should return registered storage instance if exists', function () {
        inject(function ($translate) {
          expect(typeof $translate.storage()).toBe('object');
          expect($translate.storage().set).toBeDefined();
          expect($translate.storage().get).toBeDefined();
        });
      });
    });

    describe('useCookieStorage()', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'EXISTING_TRANSLATION_ID': 'foo',
          'ANOTHER_ONE': 'bar',
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
          'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
          'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
          'YET_ANOTHER': 'Hallo da!'
        });
        $translateProvider.preferredLanguage('de_DE');

        $translateProvider.useCookieStorage();
      }));

      it('should use cookieStorage', function () {
        inject(function ($translate) {
          expect($translate.storage().get($translate.storageKey())).toEqual('de_DE');
        });
      });
    });

    describe('useLocalStorage()', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
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
        inject(function ($translate) {
          console.log($translate.storage().get($translate.storageKey()));
          console.log(window.localStorage.getItem($translate.storageKey()));
          expect($translate.storage().get($translate.storageKey())).toEqual('de_DE');
        });
      });
    });

    describe('storage prefix', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
        $translateProvider.storagePrefix('test');
        $translateProvider.useCookieStorage();
        $translateProvider.preferredLanguage('de_DE');
      }));

      it('should use storage prefix', function () {
        inject(function ($translate) {
          expect($translate.storageKey()).toEqual('testNG_TRANSLATE_LANG_KEY');
        });
      });
    });
  });
});
