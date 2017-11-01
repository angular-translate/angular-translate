/* jshint camelcase: false, quotmark: false, unused: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  // https://github.com/angular-ui/ui-router/issues/2889#issuecomment-273944742
  var enableUnhandledRejectionTracing = function (module) {

    if (angular.version.minor < 3) {
      // will work w/ AngularJS 1.3+
      return;
    }

    /* jshint ignore:start */
    // Decorate the $q service when app starts
    module.decorator('$q', ["$delegate", function ($delegate) {
      // Create a new promise object
      var promise = $delegate.when();

      // Access the `Promise` prototype (nonstandard, but works in Chrome)
      var proto = promise.__proto__;

      // Define a setter for `$$state` that creates a stacktrace
      // (string) and assigns it as a property of the internal `$$state` object.
      Object.defineProperty(proto, '$$state', {
        enumerable : true,
        set : function (val) {
          val.stack = new Error().stack;
          this._$$state = val;
        },
        get : function () {
          return this._$$state;
        }
      });

      return $delegate;
    }]);
    /* jshint ignore:end */
  };

  beforeEach(module('ngMockE2EAsync'));

  var translationMock = {
    'EXISTING_TRANSLATION_ID' : 'foo',
    'BLANK_VALUE' : '',
    'NULL' : null,
    'TRANSLATION_ID' : 'Lorem Ipsum {{value}}',
    'TRANSLATION_ID_2' : 'Lorem Ipsum {{value}} + {{value}}',
    'TRANSLATION_ID_3' : 'Lorem Ipsum {{value + value}}',
    'DOCUMENT' : {
      'HEADER' : {
        'TITLE' : 'Header'
      },
      'SUBHEADER' : {
        'TITLE' : '2. Header'
      }
    }
  };

  describe('$translate', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .registerAvailableLanguageKeys(['en', 'en_EN', 'de', 'de_DE'], {
          'en_US' : 'en_EN'
        })
        .translations('en', translationMock)
        .translations('en', {
          'FOO' : 'bar',
          'BAR' : 'foo',
          'NULL' : null,
        })
        .translations('de', {
          'FOO' : 'faa'
        })
        .preferredLanguage('en');
    }));

    var $translate, $STORAGE_KEY, $q, $rootScope;

    beforeEach(inject(function (_$translate_, _$STORAGE_KEY_, _$q_, _$rootScope_) {
      $translate = _$translate_;
      $STORAGE_KEY = _$STORAGE_KEY_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    it('should be defined', function () {
      expect($translate).toBeDefined();
    });

    it('should be a function object', function () {
      expect(typeof $translate).toBe("function");
    });

    it('should have a method use()', function () {
      expect($translate.use).toBeDefined();
    });

    it('should have a method preferredLanguage()', function () {
      expect($translate.preferredLanguage).toBeDefined();
    });

    it('should have a method fallbackLanguage()', function () {
      expect($translate.fallbackLanguage).toBeDefined();
    });

    it('should have a method storageKey()', function () {
      expect($translate.storageKey).toBeDefined();
    });

    it('should have a method refresh()', function () {
      expect($translate.refresh).toBeDefined();
    });

    it('should have a method instant()', function () {
      expect($translate.instant).toBeDefined();
    });

    it('should have a method negotiateLocale()', function () {
      expect($translate.negotiateLocale).toBeDefined();
    });

    it('should have a method isForceAsyncReloadEnabled()', function () {
      expect($translate.isForceAsyncReloadEnabled).toBeDefined();
    });

    it('should have a method getTranslationTable()', function () {
      expect($translate.getTranslationTable).toBeDefined();
    });

    it('should not try to load a language which has not been registered yet', function () {
      // ensure initial language is en (preferred one)
      expect($translate.use()).toBe('en');

      var result = {
        successHandler : false,
        failureHandler : false
      };
      $translate.use('it').then(function (lang) {
        result.successHandler = true;
      }, function (lang) {
        result.failureHandler = true;
      });

      $rootScope.$digest();
      // ensure initial language is still en (preferred one)
      expect($translate.use()).toBe('en');
      // ensure result handlers has been called correctly
      expect(result.successHandler).toBe(false);
      expect(result.failureHandler).toBe(true);
    });

    describe('$translate#isForceAsyncReloadEnabled()', function () {

      it('should be a function', function () {
        expect(typeof $translate.isForceAsyncReloadEnabled).toBe('function');
      });

      it('should return false by default', function () {
        expect($translate.isForceAsyncReloadEnabled()).toBe(false);
      });

    });

    describe('$translate#preferredLanguage()', function () {

      it('should be a function', function () {
        expect(typeof $translate.preferredLanguage).toBe('function');
      });

    });

    describe('$translate#fallbackLanguage()', function () {

      it('should be a function', function () {
        expect(typeof $translate.fallbackLanguage).toBe('function');
      });

      it('should return undefined if no language is specified', function () {
        expect($translate.fallbackLanguage()).toBeUndefined();
      });
    });

    describe('$translate#storageKey()', function () {

      it('should be a function', function () {
        expect(typeof $translate.storageKey).toBe('function');
      });

      it('should return a string', function () {
        expect(typeof $translate.storageKey()).toBe('string');
      });

      it('should be equal to $STORAGE_KEY by default', function () {
        expect($translate.storageKey()).toEqual($STORAGE_KEY);
      });
    });

    describe('$translate#nestedObjectDelimeter()', function () {

      it('should be a function', function () {
        expect(typeof $translate.nestedObjectDelimeter).toBe('function');
      });

      it('should return \'.\' if no delimiter is specified', function () {
        expect($translate.nestedObjectDelimeter()).toEqual('.');
      });
    });

    describe('$translate#negotiateLocale()', function () {

      it('should return undefined if no key is specified', function () {
        expect($translate.negotiateLocale()).toEqual(undefined);
      });

      it('should return language key if registered', function () {
        expect($translate.negotiateLocale('en')).toEqual('en');
      });

      it('should return resolved alias', function () {
        expect($translate.negotiateLocale('en_US')).toEqual('en_EN');
      });

      it('should return matching registered language if lang_REGION doesn\'t match', function () {
        expect($translate.negotiateLocale('en_GB')).toEqual('en');
      });

      it('should return undefined if key doesn\'t resolve to an alias or registered language', function () {
        expect($translate.negotiateLocale('foo')).toEqual(undefined);
      });
    });

    it('should return a promise', function () {
      expect($translate('FOO').then).toBeDefined();
      expect(typeof $translate('FOO').then).toEqual('function');
    });

    it('should return translation id if translation doesn\'t exist', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      var translationId = 'NOT_EXISTING_TRANSLATION_ID';

      $translate(translationId).then(null, function (translation) {
        deferred.resolve(translation);
      });

      $rootScope.$digest();
      expect(value).toEqual(translationId);
    });

    it('should return translation id if translation is null', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });


      $translate('NULL').then(null, function (translations) {
        deferred.resolve(translations);
      });

      $rootScope.$digest();
      expect(value).toEqual('NULL');
    });


    it('should return translation if translation id if exists', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $q.all([
        $translate("EXISTING_TRANSLATION_ID"),
        $translate("BLANK_VALUE")
      ]).then(function (translations) {
        deferred.resolve(translations);
      });

      $rootScope.$digest();
      expect(value[0]).toEqual('foo');
      expect(value[1]).toEqual('');
    });

    it('should return translation if translation id exists and return a default value if not existing', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;
      promise.then(function (translation) {
        value = translation;
      });

      $q.all([
        $translate("EXISTING_TRANSLATION_ID"),
        $translate("NON_EXISTING_KEY", undefined, undefined, "Default Translation")
      ]).then(function (translations) {
        deferred.resolve(translations);
      });

      $rootScope.$digest();
      expect(value[0]).toEqual('foo');
      expect(value[1]).toEqual('Default Translation');
    });


    it('should return translations of multiple translation ids if exists', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $translate(["EXISTING_TRANSLATION_ID", "BLANK_VALUE"]).then(function (translations) {
        deferred.resolve(translations);
      });

      $rootScope.$digest();
      expect(value.EXISTING_TRANSLATION_ID).toEqual('foo');
      expect(value.BLANK_VALUE).toEqual('');
    });

    it('should return translation, if translation id exists with whitespace', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $q.all([
        $translate("EXISTING_TRANSLATION_ID\t        \n"),
        $translate("\t        \nEXISTING_TRANSLATION_ID"),
        $translate("BLANK_VALUE\t        \n"),
        $translate("\t        \nBLANK_VALUE")
      ]).then(function (translations) {
        deferred.resolve(translations);
      });

      $rootScope.$digest();
      expect(value[0]).toEqual('foo');
      expect(value[1]).toEqual('foo');
      expect(value[2]).toEqual('');
      expect(value[3]).toEqual('');
    });

    it('should use $interpolate service', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $q.all([
        $translate('TRANSLATION_ID'),
        $translate('TRANSLATION_ID', {value : 'foo'}),
        $translate('TRANSLATION_ID_2', {value : 'foo'}),
        $translate('TRANSLATION_ID_3', {value : 'foo'}),
        $translate('TRANSLATION_ID_3', {value : '3'}),
        $translate('TRANSLATION_ID_3', {value : 3})
      ]).then(function (translations) {
        deferred.resolve(translations);
      });

      $rootScope.$digest();
      expect(value[0]).toEqual('Lorem Ipsum ');
      expect(value[1]).toEqual('Lorem Ipsum foo');
      expect(value[2]).toEqual('Lorem Ipsum foo + foo');
      expect(value[3]).toEqual('Lorem Ipsum foofoo');
      expect(value[4]).toEqual('Lorem Ipsum 33');
      expect(value[5]).toEqual('Lorem Ipsum 6');
    });

    it('should extend translation table rather then overwriting it', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $q.all([
        $translate("FOO"),
        $translate("BAR")
      ]).then(function (translations) {
        deferred.resolve(translations);
      });

      $rootScope.$digest();
      expect(value[0]).toEqual('bar');
      expect(value[1]).toEqual('foo');
    });

    it('should support namespaces in translation ids', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $q.all([
        $translate("DOCUMENT.HEADER.TITLE"),
        $translate("DOCUMENT.SUBHEADER.TITLE")
      ]).then(function (translations) {
        deferred.resolve(translations);
      });

      $rootScope.$digest();
      expect(value[0]).toEqual('Header');
      expect(value[1]).toEqual('2. Header');
    });

    it('should use forceLanguage', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $q.all([
        $translate("FOO"),
        $translate("FOO", null, null, null, 'de')
      ]).then(function (translations) {
        deferred.resolve(translations);
      });

      $rootScope.$digest();
      expect(value[0]).toEqual('bar');
      expect(value[1]).toEqual('faa');
    });

    it('should use forceLanguage with multiple translation ids', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $translate(["FOO"], null, null, null, 'de').then(deferred.resolve);

      $rootScope.$digest();
      expect(value.FOO).toEqual('faa');
    });
  });

  describe('$translate#nestedObjectDelimeter()', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.nestedObjectDelimeter('_');
    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should return \'_\' if such delimiter is specified', function () {
      expect($translate.nestedObjectDelimeter()).toEqual('_');
    });
  });

  describe('$translate#use()', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('de_DE', translationMock)
        .translations('de_DE', {'YET_ANOTHER' : 'Hallo da!'})
        .translations('en_EN', {'YET_ANOTHER' : 'Hello there!'})
        .preferredLanguage('de_DE');
    }));

    var $translate, $rootScope, $STORAGE_KEY, $q;

    beforeEach(inject(function (_$translate_, _$rootScope_, _$STORAGE_KEY_, _$q_) {
      $translate = _$translate_;
      $rootScope = _$rootScope_;
      $STORAGE_KEY = _$STORAGE_KEY_;
      $q = _$q_;
    }));

    it('should be a function', function () {
      expect(typeof $translate.use).toBe('function');
    });

    it('should return a string', function () {
      expect(typeof $translate.use()).toBe('string');
    });

    it('should return language key', function () {
      expect($translate.use()).toEqual('de_DE');
    });

    it('should change language at runtime', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $translate.use('en_EN');
      $translate('YET_ANOTHER').then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('Hello there!');
    });

    it('should be overriden by forceLanguage', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $translate.use('en_EN');
      $translate('YET_ANOTHER', null, null, null, 'de_DE').then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('Hallo da!');
    });

  });

  describe('$translate#use() with aliases', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('en', {'YET_ANOTHER' : 'Hello there!'})
        .translations('tr_TR', {'YET_ANOTHER' : 'Selam millet! (tr_TR)'})
        .translations('tr', {'YET_ANOTHER' : 'Selam millet! (tr)'})
        .registerAvailableLanguageKeys(['en', 'tr', 'tr_TR'], {
          'en_EN' : 'en',
          'en_US' : 'en',
          'en_GB' : 'en',
          'tr_*' : 'tr'
        })
        .preferredLanguage('en_EN');
    }));

    var $translate, $rootScope, $STORAGE_KEY, $q;

    beforeEach(inject(function (_$translate_, _$rootScope_, _$STORAGE_KEY_, _$q_) {
      $translate = _$translate_;
      $rootScope = _$rootScope_;
      $STORAGE_KEY = _$STORAGE_KEY_;
      $q = _$q_;
    }));

    it('should respect the language aliases', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $translate.use('en_GB');

      expect($translate.use()).toEqual('en');

      $translate('YET_ANOTHER').then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('Hello there!');
    });

    it('should load the language with the exact match first even if a wildcard is used', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $translate.use('tr_TR');

      expect($translate.use()).toEqual('tr_TR');

      $translate('YET_ANOTHER').then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('Selam millet! (tr_TR)');
    });

    it('should load the correct language if a wildcard is used', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $translate.use('tr_TURKISH'); // Silly language name

      expect($translate.use()).toEqual('tr');

      $translate('YET_ANOTHER').then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('Selam millet! (tr)');
    });
  });

  // Spec for edge case: while preferred language is still loading,
  //                     another language will be requested and
  //                     is returning before the preferred one
  // t0 ~ 0.0s           (request ab_CD)
  // t1 ~ 0.5s           (request en_US)
  // t2 ~ 1.5s           (response en_US)
  // t3 ~ 2.0s           (response ab_CD)
  describe('$translate#use() with async loading and two unordered requests in parallel (1st win)', function () {

    var fastButRequestedSecond = 'en_US',
      slowButRequestedFirst = 'ab_CD',
      expectedTranslation = 'Hello World',
      notExpectedTranslation = 'foo bar bork bork bork',
      fastRequestTime = 1000,
      firstLanguageResponded = false,
      secondLanguageResponded = false;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $translateProvider.useLoader('customLoader');

      $translateProvider.preferredLanguage(slowButRequestedFirst);

      $provide.service('customLoader', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();
          var locale = options.key;

          if (locale === fastButRequestedSecond) {
            $timeout(function () {
              secondLanguageResponded = true;
              // t2
              deferred.resolve({
                greeting : expectedTranslation
              });
            }, fastRequestTime);
          }

          if (locale === slowButRequestedFirst) {
            $timeout(function () {
              firstLanguageResponded = true;
              // t3
              deferred.resolve({
                greeting : notExpectedTranslation
              });
            }, fastRequestTime * 2);
          }

          return deferred.promise;
        };
      });
    }));

    var $translate;

    beforeEach(inject(function ($timeout, _$translate_, $rootScope) {
      $translate = _$translate_;
      // t0 already happened

      $timeout(function () {
        // t1
        $translate.use(fastButRequestedSecond);
      }, fastRequestTime / 2);

      // t2
      $timeout.flush(10000);
      $rootScope.$digest();

      // t3
      $timeout.flush(10000);
    }));

    it('should be requested the first language', function () {
      expect(firstLanguageResponded).toEqual(true);
    });

    it('should be requested the second language', function () {
      expect(secondLanguageResponded).toEqual(true);
    });

    it('should set the language to be the most recently requested one, not the most recently responded one', inject(function ($rootScope, $q) {

      var value;

      $translate('greeting').then(function (translation) {
        value = translation;
      });

      $rootScope.$digest();
      expect(value).toEqual(expectedTranslation);
    }));
  });

  // Spec for edge case: while preferred language is still loading,
  //                     another language will be requested and
  //                     is returning after the preferred one
  // t0 ~ 0.0s           (request ab_CD)
  // t1 ~ 0.5s           (request en_US)
  // t2 ~ 2.0s           (response ab_CD)
  // t3 ~ 3.0s           (response en_US)
  describe('$translate#use() with async loading and two unordered requests in parallel (2nd win)', function () {

    var requestedSecond = 'en_US',
      requestedFirst = 'ab_CD',
      notExpectedTranslation = 'Hello World',
      expectedTranslation = 'foo bar bork bork bork',
      fastRequestTime = 1000,
      firstLanguageResponded = false,
      secondLanguageResponded = false;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $translateProvider.useLoader('customLoader');

      $translateProvider.preferredLanguage(requestedFirst);

      $provide.service('customLoader', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();
          var locale = options.key;

          if (locale === requestedSecond) {
            $timeout(function () {
              secondLanguageResponded = true;
              // t3
              deferred.resolve({
                greeting : expectedTranslation
              });
            }, fastRequestTime * 3);
          }

          if (locale === requestedFirst) {
            $timeout(function () {
              firstLanguageResponded = true;
              // t2
              deferred.resolve({
                greeting : notExpectedTranslation
              });
            }, fastRequestTime * 2);
          }

          return deferred.promise;
        };
      });
    }));

    var $translate;

    beforeEach(inject(function ($timeout, _$translate_, $rootScope) {
      $translate = _$translate_;
      // t0 already happened

      $timeout(function () {
        // t1
        $translate.use(requestedSecond);
      }, fastRequestTime / 2);

      // t2
      $timeout.flush();
      $rootScope.$digest();

      // t3
      $timeout.flush();
    }));

    it('should be requested the first language', function () {
      expect(firstLanguageResponded).toEqual(true);
    });

    it('should be requested the second language', function () {
      expect(secondLanguageResponded).toEqual(true);
    });

    it('should set the language to be the most recently requested one, not the most recently responded one', inject(function ($rootScope, $q) {

      var value;

      $translate('greeting').then(function (translation) {
        value = translation;
      });

      $rootScope.$digest();
      expect(value).toEqual(expectedTranslation);
    }));
  });

  // Spec for edge case: while preferred language is still loading,
  //                     another language will be requested and
  //                     is returning before the preferred one
  // t0 ~ 0.0s           (request ab_CD)
  // t1 ~ 0.5s           (request en_US)
  // t2 ~ 1.5s           (response en_US)
  // t3 ~ 2.0s           (response ab_CD)
  describe('$translate#use() with async loading and two unordered requests aborting the previous', function () {

    var fastButRequestedSecond = 'en_US',
      slowButRequestedFirst = 'ab_CD',
      expectedTranslation = 'Hello World',
      notExpectedTranslation = 'foo bar bork bork bork',
      fastRequestTime = 1000,
      firstLanguageResponded = false,
      secondLanguageResponded = false;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $translateProvider.useStaticFilesLoader({
        prefix : 'foo/bar/',
        suffix : '.json'
      });

    }));

    var $translate;

    beforeEach(inject(function ($timeout, _$translate_, $rootScope, $httpBackend, $q) {
      $translate = _$translate_;

      var firstDeferred = $q.defer();
      $httpBackend.whenAsync('GET', 'foo/bar/ab_CD.json').respond(firstDeferred.promise);
      $timeout(function () {
        firstLanguageResponded = true;
        // t1
        firstDeferred.resolve([200, {
          greeting : notExpectedTranslation
        }]);
      }, fastRequestTime * 2);

      var secondDeferred = $q.defer();
      $httpBackend.whenAsync('GET', 'foo/bar/en_US.json').respond(secondDeferred.promise);
      $timeout(function () {
        secondLanguageResponded = true;
        // t2
        secondDeferred.resolve([200, {
          greeting : expectedTranslation
        }]);
      }, fastRequestTime);

      $timeout(function () {
        // t0
        $translate.use(slowButRequestedFirst);
      });

      $timeout(function () {
        // t1
        $translate.use(fastButRequestedSecond);
      });

      // t2
      $timeout.flush(fastRequestTime);

      // t3
      $timeout.flush(fastRequestTime);
    }));

    it('should be requested the first language', function () {
      expect(firstLanguageResponded).toEqual(true);
    });

    it('should be requested the second language', function () {
      expect(secondLanguageResponded).toEqual(true);
    });

    it('should set the language to be the most recently requested one, not the most recently responded one', inject(function ($rootScope, $q) {

      var value;

      $translate('greeting').then(function (translation) {
        value = translation;
      });

      $rootScope.$digest();
      expect(value).toEqual(expectedTranslation);
    }));
  });

  // Spec for edge case: while preferred language is still loading,
  //                     another language will be requested as fallback
  //                     and is returning before the preferred one
  // t0 ~ 0.0s           (request ab_CD)
  // t1 ~ 0.5s           (request en_US)
  // t2 ~ 1.5s           (response en_US)
  // t3 ~ 2.0s           (response ab_CD)
  describe('$translate#use() with async loading and two unordered requests in parallel (+fallback)', function () {

    var fastButRequestedSecond = 'en_US',
      slowButRequestedFirst = 'ab_CD',
      expectedTranslation = 'Hello World',
      notExpectedTranslation = 'foo bar bork bork bork',
      fastRequestTime = 1000,
      firstLanguageResponded = false,
      secondLanguageResponded = false;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $translateProvider.useLoader('customLoader');

      $translateProvider.preferredLanguage(slowButRequestedFirst);
      $translateProvider.fallbackLanguage(fastButRequestedSecond);

      $provide.service('customLoader', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();
          var locale = options.key;

          if (locale === fastButRequestedSecond) {
            $timeout(function () {
              secondLanguageResponded = true;
              deferred.resolve({
                greeting : expectedTranslation
              });
            }, fastRequestTime);
          }

          if (locale === slowButRequestedFirst) {
            $timeout(function () {
              firstLanguageResponded = true;
              deferred.resolve({
                greeting : notExpectedTranslation
              });
            }, fastRequestTime * 2);
          }

          return deferred.promise;
        };
      });
    }));

    var $translate;

    beforeEach(inject(function ($timeout, _$translate_, $rootScope) {
      $translate = _$translate_;

      $timeout(function () {
        $translate.use(fastButRequestedSecond);
      }, fastRequestTime / 2);

      $timeout.flush();
      $rootScope.$digest();
    }));

    it('should be requested the first language', function () {
      expect(firstLanguageResponded).toEqual(true);
    });

    it('should be requested the second language', function () {
      expect(secondLanguageResponded).toEqual(true);
    });

    it('should set the language to be the most recently requested one, not the most recently responded one', inject(function ($rootScope, $q) {

      var value;

      $translate('greeting').then(function (translation) {
        value = translation;
      });

      $rootScope.$digest();
      expect(value).toEqual(expectedTranslation);
    }));
  });

  describe('$translate#use() with async loading and two requests to the same key', function () {

    var $translate, $httpBackend, $timeout;

    beforeEach(module('pascalprecht.translate', function ($provide, $translateProvider) {
      enableUnhandledRejectionTracing($provide);
      $translateProvider.useStaticFilesLoader({
        prefix : 'lang_',
        suffix : '.json'
      });
    }));

    beforeEach(inject(function (_$translate_, _$httpBackend_, _$timeout_) {
      $httpBackend = _$httpBackend_;
      $translate = _$translate_;
      $timeout = _$timeout_;

      $httpBackend.when('GET', 'lang_de_DE.json').respond({HEADER : 'Ueberschrift'});
      $httpBackend.when('GET', 'lang_nt_VD.json').respond(404);
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('running the second request AFTER the first one was finished', function () {

      it('should resolve the first promise, keep the result in cache and resolve the second promise', function () {
        var fn = {
          resolved1 : jasmine.createSpy('1st request resolved'),
          rejected1 : jasmine.createSpy('1st request rejected'),
          resolved2 : jasmine.createSpy('2nd request resolved'),
          rejected2 : jasmine.createSpy('2nd request rejected')
        };

        expect(fn.resolved1).not.toHaveBeenCalled();
        expect(fn.rejected1).not.toHaveBeenCalled();

        $translate.use('de_DE').then(fn.resolved1, fn.rejected1);
        $timeout.flush();
        expect(fn.resolved1).toHaveBeenCalled();
        expect(fn.rejected1).not.toHaveBeenCalled();

        $translate.use('de_DE').then(fn.resolved2, fn.rejected2);
        $timeout.flush();
        expect(fn.resolved2).toHaveBeenCalled();
        expect(fn.rejected2).not.toHaveBeenCalled();
      });

      it('should reject the first promise, try to load the file again and reject the second promise', function () {
        var fn = {
          resolved1 : jasmine.createSpy('1st request resolved'),
          rejected1 : jasmine.createSpy('1st request rejected'),
          resolved2 : jasmine.createSpy('2nd request resolved'),
          rejected2 : jasmine.createSpy('2nd request rejected')
        };

        expect(fn.resolved1).not.toHaveBeenCalled();
        expect(fn.rejected1).not.toHaveBeenCalled();

        $translate.use('nt_VD').then(fn.resolved1, fn.rejected1);
        $timeout.flush();
        expect(fn.resolved1).not.toHaveBeenCalled();
        expect(fn.rejected1).toHaveBeenCalled();

        $translate.use('nt_VD').then(fn.resolved2, fn.rejected2);
        $timeout.flush();
        expect(fn.resolved2).not.toHaveBeenCalled();
        expect(fn.rejected2).toHaveBeenCalled();
      });
    });

    describe('running the second request BEFORE the first one was finished', function () {

      it('should resolve both promises', function () {
        var fn = {
          resolved1 : jasmine.createSpy('1st request resolved'),
          rejected1 : jasmine.createSpy('1st request rejected'),
          resolved2 : jasmine.createSpy('2nd request resolved'),
          rejected2 : jasmine.createSpy('2nd request rejected')
        };

        $translate
          .use('de_DE')
          .then(fn.resolved1, fn.rejected1);
        $translate
          .use('de_DE')
          .then(fn.resolved2, fn.rejected2);

        expect(fn.resolved1).not.toHaveBeenCalled();
        expect(fn.rejected1).not.toHaveBeenCalled();
        expect(fn.resolved2).not.toHaveBeenCalled();
        expect(fn.rejected2).not.toHaveBeenCalled();

        $timeout.flush();

        expect(fn.resolved1).toHaveBeenCalled();
        expect(fn.rejected1).not.toHaveBeenCalled();
        expect(fn.resolved2).toHaveBeenCalled();
        expect(fn.rejected2).not.toHaveBeenCalled();
      });

      it('should reject both promises', function () {
        var fn = {
          resolved1 : jasmine.createSpy('1st request resolved'),
          rejected1 : jasmine.createSpy('1st request rejected'),
          resolved2 : jasmine.createSpy('2nd request resolved'),
          rejected2 : jasmine.createSpy('2nd request rejected')
        };

        $translate
          .use('nt_VD')
          .then(fn.resolved1, fn.rejected1);
        $translate
          .use('nt_VD')
          .then(fn.resolved2, fn.rejected2);

        expect(fn.resolved1).not.toHaveBeenCalled();
        expect(fn.rejected1).not.toHaveBeenCalled();
        expect(fn.resolved2).not.toHaveBeenCalled();
        expect(fn.rejected2).not.toHaveBeenCalled();

        $timeout.flush();

        expect(fn.resolved1).not.toHaveBeenCalled();
        expect(fn.rejected1).toHaveBeenCalled();
        expect(fn.resolved2).not.toHaveBeenCalled();
        expect(fn.rejected2).toHaveBeenCalled();
      });
    });
  });

  describe('$translate() used with a forceLanguage', function () {

    var fastButRequestedSecond = 'en_US',
      slowButRequestedFirst = 'ab_CD',
      expectedTranslation = 'Hello World',
      notExpectedTranslation = 'foo bar bork bork bork',
      fastRequestTime = 100,
      firstLanguageResponded = false,
      secondLanguageResponded = false;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $translateProvider.useLoader('customLoader');

      $translateProvider.preferredLanguage(slowButRequestedFirst);

      $provide.service('customLoader', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();
          var locale = options.key;

          if (locale === fastButRequestedSecond) {
            $timeout(function () {
              secondLanguageResponded = true;
              // t2
              deferred.resolve({
                greeting : expectedTranslation
              });
            }, fastRequestTime);
          }

          if (locale === slowButRequestedFirst) {
            $timeout(function () {
              firstLanguageResponded = true;
              // t3
              deferred.resolve({
                greeting : notExpectedTranslation
              });
            }, fastRequestTime * 2);
          }

          return deferred.promise;
        };
      });
    }));

    var $translate;
    var data = {};

    beforeEach(inject(function ($timeout, _$translate_, $rootScope) {
      $translate = _$translate_;
      $timeout.flush();
      $rootScope.$digest();
    }));

    it('should wait for this', inject(function ($rootScope, $q, $timeout) {

      var value;

      $translate('greeting', undefined, undefined, undefined, fastButRequestedSecond).then(function (translation) {
        console.log('Translation!!!', translation);
        value = translation;
      });

      $timeout.flush();
      $rootScope.$digest();

      $rootScope.$digest();
      expect(value).toEqual(expectedTranslation);
    }));
  });

  describe('$translate#storageKey()', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.storageKey('foo');
    }));

    var $translate, $STORAGE_KEY;

    beforeEach(inject(function (_$translate_, _$STORAGE_KEY_) {
      $translate = _$translate_;
      $STORAGE_KEY = _$STORAGE_KEY_;
    }));

    it('should allow to change the storage key during config', function () {
      expect($translate.storageKey()).not.toEqual($STORAGE_KEY);
    });

    it('shouldn\'t allow to change the storage key during runtime', function () {
      var prevKey = $translate.storageKey();
      $translate.storageKey(prevKey + "somestring");
      expect($translate.storageKey()).toEqual(prevKey);
    });
  });

  describe('$translateService#preferredLanguage()', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.preferredLanguage('de_DE');
    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should return a string if language is specified', function () {
      expect(typeof $translate.preferredLanguage()).toBe('string');
    });

    it('should return a correct language code', function () {
      expect($translate.preferredLanguage()).toEqual('de_DE');
    });
  });

  describe('$translateProvider#preferredLanguage()', function () {
    var translateProvider;

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      translateProvider = $translateProvider;
      translateProvider.preferredLanguage('de_DE');
    }));

    it('should return a string if language is specified', inject(function () {
      expect(typeof translateProvider.preferredLanguage()).toBe('string');
    }));

    it('should return a correct language code', inject(function () {
      expect(translateProvider.preferredLanguage()).toEqual('de_DE');
    }));
  });

  describe('$translate#fallbackLanguage()', function () {

    describe('single fallback language', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider
          .translations('de_DE', translationMock)
          .translations('en_EN', {'TRANSLATION__ID' : 'bazinga', 'NULL' : 'yowza'})
          .fallbackLanguage('en_EN')
          .preferredLanguage('de_DE');
      }));

      var $translate, $q, $rootScope;

      beforeEach(inject(function (_$translate_, _$q_, _$rootScope_) {
        $translate = _$translate_;
        $q = _$q_;
        $rootScope = _$rootScope_;
      }));

      it('should return a string if language is specified', function () {
        expect(typeof $translate.fallbackLanguage()).toBe('string');
      });

      it('should return a correct language code', function () {
        expect($translate.fallbackLanguage()).toEqual('en_EN');
      });

      it('should use fallback language if translation id doesn\'t exist', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translation) {
          value = translation;
        });
        $translate(['TRANSLATION__ID', 'NULL']).then(function (translation) {
          deferred.resolve(translation);
        });

        $rootScope.$digest();
        expect(value.TRANSLATION__ID).toEqual('bazinga');
        expect(value.NULL).toEqual('yowza');
      });

      it('should use fallback language when forceLanguage if translation id doesn\'t exist', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translation) {
          value = translation;
        });
        $translate('TRANSLATION__ID', null, null, null, 'de_DE').then(function (translation) {
          deferred.resolve(translation);
        });

        $rootScope.$digest();
        expect(value).toEqual('bazinga');
      });
    });

    describe('even if fallback translation is an empty string', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider
          .translations('de_DE', translationMock)
          .translations('en_EN', {'FALLBACK' : ''})
          .fallbackLanguage('en_EN')
          .preferredLanguage('de_DE');
      }));

      var $translate, $q, $rootScope;

      beforeEach(inject(function (_$translate_, _$q_, _$rootScope_) {
        $translate = _$translate_;
        $q = _$q_;
        $rootScope = _$rootScope_;
      }));

      it('should use translation of fallback language', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value = 'NOT_VALID';

        promise.then(function (translation) {
          value = translation;
        });
        $translate('FALLBACK', null, null, null, 'de_DE').then(function (translation) {
          deferred.resolve(translation);
        });

        $rootScope.$digest();
        expect(value).toEqual('');
      });
    });

    describe('translate returns handler result', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

        enableUnhandledRejectionTracing($provide);

        $translateProvider
          .translations('de_DE', translationMock)
          .preferredLanguage('de_DE');

        // factory provides a default fallback text being defined in the factory
        // gives a maximum of flexibility
        $provide.factory('elementReturningTranslationHandler', function () {
          return function (translationID, uses) {
            return '<nkf>' + translationID + '</nkf>';
          };
        });
        $translateProvider.useMissingTranslationHandler('elementReturningTranslationHandler');
      }));

      var $translate, $rootScope, $q;

      beforeEach(inject(function (_$translate_, _$rootScope_, _$q_) {
        $translate = _$translate_;
        $rootScope = _$rootScope_;
        $q = _$q_;
      }));

      it('when instant translate', function () {
        expect($translate.instant('false.key')).toBe('<nkf>false.key</nkf>');
      });
    });

    describe('multi fallback language', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        enableUnhandledRejectionTracing($provide);
        $translateProvider
          .translations('de_DE', translationMock)
          .translations('en_EN', {'TRANSLATION__ID' : 'bazinga'})
          .translations('fr_FR', {'SUPERTEST' : 'it works!'})
          .translations('en_UK', {'YAY' : 'it really does!'})
          .fallbackLanguage(['en_EN', 'fr_FR', 'en_UK'])
          .preferredLanguage('de_DE');

        // factory provides a default fallback text being defined in the factory
        // gives a maximum of flexibility
        $provide.factory('customTranslationHandler', function () {
          return function (translationID, uses) {
            return 'NO KEY FOUND';
          };
        });
        $translateProvider.useMissingTranslationHandler('customTranslationHandler');
      }));

      var $translate, $rootScope, $q;

      beforeEach(inject(function (_$translate_, _$rootScope_, _$q_) {
        $translate = _$translate_;
        $rootScope = _$rootScope_;
        $q = _$q_;
      }));

      it('should return an array', function () {
        expect($translate.fallbackLanguage().length).toBeDefined();
      });

      it('should use fallback languages in given order', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translations) {
          value = translations;
        });

        $q.all([
          $translate('EXISTING_TRANSLATION_ID'),
          $translate('TRANSLATION__ID'),
          $translate('SUPERTEST'),
          $translate('YAY')
        ]).then(function (translations) {
          deferred.resolve(translations);
        });

        $rootScope.$digest();
        expect(value[0]).toEqual('foo');
        expect(value[1]).toEqual('bazinga');
        expect(value[2]).toEqual('it works!');
        expect(value[3]).toEqual('it really does!');
      });


      it('should use fallback languages and miss one of the translation keys', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translations) {
          value = translations;
        });

        $q.all([
          $translate('EXISTING_TRANSLATION_ID'),
          $translate('TRANSLATION__ID'),
          $translate('SUPERTEST'),
          $translate('YAY'),
          $translate('NOT_EXISTING')
        ]).then(function (translations) {
          deferred.resolve(translations);
        });

        $rootScope.$digest();

        expect(value[0]).toEqual('foo');
        expect(value[1]).toEqual('bazinga');
        expect(value[2]).toEqual('it works!');
        expect(value[3]).toEqual('it really does!');
        expect(value[4]).toEqual('NO KEY FOUND');
      });

      it('should use fallback languages and return a default value for one of the translation keys', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translations) {
          value = translations;
        });

        $q.all([
          $translate('EXISTING_TRANSLATION_ID'),
          $translate('TRANSLATION__ID'),
          $translate('SUPERTEST'),
          $translate('YAY'),
          $translate('NOT_EXISTING', undefined, undefined, 'Defaultvalue')
        ]).then(function (translations) {
          deferred.resolve(translations);
        });

        $rootScope.$digest();

        expect(value[0]).toEqual('foo');
        expect(value[1]).toEqual('bazinga');
        expect(value[2]).toEqual('it works!');
        expect(value[3]).toEqual('it really does!');
        expect(value[4]).toEqual('Defaultvalue');
      });
    });


    describe('registered loader', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        enableUnhandledRejectionTracing($provide);
        $translateProvider
          .useLoader('customLoader')
          .fallbackLanguage(['de_DE'])
          .preferredLanguage('en_EN');

        $provide.factory('customLoader', ['$q', function ($q) {
          return function (options) {
            var deferred = $q.defer();

            switch (options.key) {
              case 'en_EN':
                deferred.resolve({
                  'FOO' : 'BAR'
                });
                break;
              case 'de_DE':
                deferred.resolve({
                  'BOOYA' : 'KA'
                });
                break;
            }

            return deferred.promise;
          };
        }]);
      }));

      var $rootScope, $translate, $timeout, $q;

      beforeEach(inject(function (_$rootScope_, _$translate_, _$timeout_, _$q_) {
        $rootScope = _$rootScope_;
        $translate = _$translate_;
        $timeout = _$timeout_;
        $q = _$q_;
      }));

      it('should use fallback language', function () {
        var resolvedValue;

        $translate('BOOYA').then(function (translation) {
          resolvedValue = translation;
        });

        $rootScope.$apply();

        expect(resolvedValue).toEqual('KA');
      });
    });

    describe('fallback if preferred language is low to respond and fails', function () {

      var preferredButFails = 'ab_CD',
        notPreferredButSucceeds = 'en_US',
        expectedTranslation = 'Hello World',
        fastRequestTime = 1000,
        preferredLanguageResponded = false,
        fallbackLanguageResponded = false;

      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        enableUnhandledRejectionTracing($provide);
        $translateProvider.useStaticFilesLoader({
          prefix : 'foo/bar/',
          suffix : '.json'
        });

        $translateProvider
          .preferredLanguage(preferredButFails)
          .fallbackLanguage(notPreferredButSucceeds);

      }));

      var $translate;

      beforeEach(inject(function ($timeout, _$translate_, $rootScope, $httpBackend, $q) {
        $translate = _$translate_;

        var firstDeferred = $q.defer();
        $httpBackend.whenAsync('GET', 'foo/bar/ab_CD.json').respond(firstDeferred.promise);
        $timeout(function () {
          preferredLanguageResponded = true;
          // t1
          firstDeferred.resolve([404, {
            msg : 'this language does not exist'
          }]);
        }, fastRequestTime * 2);

        var secondDeferred = $q.defer();
        $httpBackend.whenAsync('GET', 'foo/bar/en_US.json').respond(secondDeferred.promise);
        $timeout(function () {
          fallbackLanguageResponded = true;
          // t2
          secondDeferred.resolve([200, {
            greeting : expectedTranslation
          }]);
        }, fastRequestTime);

        // t2
        $timeout.flush(fastRequestTime);

        // t3
        $timeout.flush(fastRequestTime);
      }));

      it('should be requested the preferred language', function () {
        expect(preferredLanguageResponded).toEqual(true);
      });

      it('should be requested the fallback language', function () {
        expect(fallbackLanguageResponded).toEqual(true);
      });

      it('should set the fallback language as the preferred one', inject(function ($rootScope) {

        var value;

        $translate('greeting').then(function (translation) {
          value = translation;
        });

        $rootScope.$digest();
        expect(value).toEqual(expectedTranslation);
      }));
    });

  });

  describe('$translateProvider#translationNotFoundIndicator', function () {

    describe('setting both indicators implicitly', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider.translationNotFoundIndicator('✘');
      }));

      var $translate, $q, $rootScope;

      beforeEach(inject(function (_$translate_, _$q_, _$rootScope_) {
        $translate = _$translate_;
        $q = _$q_;
        $rootScope = _$rootScope_;
      }));

      it('should inject indicators for not found translations', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translation) {
          value = translation;
        });

        $translate('NOT_FOUND').then(null, function (translation) {
          deferred.resolve(translation);
        });
        $rootScope.$digest();
        expect(value).toEqual('✘ NOT_FOUND ✘');
      });
    });

    describe('setting left indicator explicitly', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider.translationNotFoundIndicatorLeft('✘');
      }));

      var $translate, $q, $rootScope;

      beforeEach(inject(function (_$translate_, _$q_, _$rootScope_) {
        $translate = _$translate_;
        $q = _$q_;
        $rootScope = _$rootScope_;
      }));

      it('should inject left indicator for not found translations', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translation) {
          value = translation;
        });

        $translate('NOT_FOUND').then(null, function (translation) {
          deferred.resolve(translation);
        });
        $rootScope.$digest();
        expect(value).toEqual('✘ NOT_FOUND');
      });
    });

    describe('setting right indicator explicitly', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider.translationNotFoundIndicatorRight('✘');
      }));

      var $translate, $q, $rootScope;

      beforeEach(inject(function (_$translate_, _$q_, _$rootScope_) {
        $translate = _$translate_;
        $q = _$q_;
        $rootScope = _$rootScope_;
      }));

      it('should inject right indicator for not found translations', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translation) {
          value = translation;
        });

        $translate('NOT_FOUND').then(null, function (translation) {
          deferred.resolve(translation);
        });
        $rootScope.$digest();
        expect(value).toEqual('NOT_FOUND ✘');
      });
    });
  });

  describe('$translateProvider#useLoader', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
      enableUnhandledRejectionTracing($provide);
      $translateProvider
        .useLoader('customLoader')
        .preferredLanguage('en');
      $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();

          $timeout(function () {
            deferred.resolve({
              FOO : 'bar'
            });
          }, 1000);

          return deferred.promise;
        };
      }]);
    }));

    it('should use custom loader', function () {
      inject(function ($translate, $timeout, $q) {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translation) {
          value = translation;
        });

        $translate('FOO').then(function (translation) {
          deferred.resolve(translation);
        }, function () {
          deferred.resolve('foo');
        });
        $timeout.flush();
        expect(value).toEqual('bar');
      });
    });
  });

  describe('$translateProvider#useMessageFormatInterpolation()', function () {


    beforeEach(module('pascalprecht.translate', function ($translateProvider) {

      $translateProvider
        .translations('en', {
          'REPLACE_VARS' : 'Foo bar {value}',
          'SELECT_FORMAT' : '{GENDER, select, male{He} female{She} other{They}} liked this.',
          'PLURAL_FORMAT' : 'There {NUM_RESULTS, plural, one{is one result} other{are # results}}.',
          'PLURAL_FORMAT_OFFSET' : 'You {NUM_ADDS, plural, offset:1' +
          '=0{didnt add this to your profile}' +
          'one{and one other person added this to their profile}' +
          'other{and # others added this to their profiles}' +
          '}.'
        })
        .useMessageFormatInterpolation()
        .preferredLanguage('en');
    }));

    var $translate, $q, $rootScope;

    beforeEach(inject(function (_$translate_, _$rootScope_, _$q_) {
      $translate = _$translate_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    it('should replace interpolateParams with concrete values', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });
      $translate('REPLACE_VARS', {value : 5}).then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('Foo bar 5');
    });

    it('should support SelectFormat', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });
      $translate('SELECT_FORMAT', {GENDER : 'male'}).then(function (translation) {
        deferred.resolve(translation);
      });

      $rootScope.$digest();
      expect(value).toEqual('He liked this.');
    });

    it('should support PluralFormat', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });
      $translate('PLURAL_FORMAT', {'NUM_RESULTS' : 0}).then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('There are 0 results.');
    });

    it('should support PluralFormat - offset extension', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });
      $translate('PLURAL_FORMAT_OFFSET', {'NUM_ADDS' : 0}).then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('You didnt add this to your profile.');
    });
  });

  describe('$translateProvider#addInterpolation', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $provide.factory('customInterpolation', function () {

        var translateInterpolator = {},
          $locale;

        // provide a method to set locale
        translateInterpolator.setLocale = function (locale) {
          $locale = locale;
        };

        // provide a method to return an interpolation identifier
        translateInterpolator.getInterpolationIdentifier = function () {
          return 'custom';
        };

        // defining the actual interpolate function
        translateInterpolator.interpolate = function (value, interpolationParams, context, sanitizeStrategy, translationId) {
          if ($locale === 'de') {
            return 'foo';
          } else {
            return 'custom interpolation';
          }
        };

        return translateInterpolator;
      });

      // tell angular-translate to optionally use customInterpolation
      $translateProvider
        .addInterpolation('customInterpolation')
        .translations('en', {'FOO' : 'Some text'})
        .translations('de', {
          'FOO' : 'Irgendwas',
          'BAR' : 'yupp'
        })
        .fallbackLanguage('de')
        .preferredLanguage('en');
    }));

    var $translate, $rootScope, $q;

    beforeEach(inject(function (_$translate_, _$rootScope_, _$q_) {
      $translate = _$translate_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $rootScope.$apply();
    }));

    it('should translate', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });
      $translate('FOO').then(function (translation) {
        deferred.resolve(translation);
      });

      $rootScope.$digest();
      expect(value).toEqual('Some text');
    });

    it('should use custom interpolation', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });
      $translate('FOO', {}, 'custom').then(function (translation) {
        deferred.resolve(translation);
      });

      $rootScope.$digest();
      expect(value).toEqual('custom interpolation');
    });

    it('should use fallback language, if configured', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (translation) {
        value = translation;
      });

      $translate('BAR', {}, 'custom').then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('foo');
    });
  });

  describe('$translateProvider#addInterpolation', function () {

    var customInterpolatorFactory = function () {

      var interpolator = {},
        $locale;

      // provide a method to set locale
      interpolator.setLocale = function (locale) {
        $locale = locale;
      };

      // provide a method to return an interpolation identifier
      interpolator.getInterpolationIdentifier = function () {
        return 'custom';
      };

      // defining the actual interpolate function
      interpolator.interpolate = function (value, interpolationParams, context, sanitizeStrategy, translationId) {
        console.log(arguments);
        if ($locale === 'de') {
          return 'foo';
        } else {
          return 'custom interpolation';
        }
      };

      return interpolator;
    };

    var customInterpolator = customInterpolatorFactory();

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      spyOn(customInterpolator, 'interpolate');
      $provide.factory('customInterpolation', function () {
        return customInterpolator;
      });

      // tell angular-translate to optionally use customInterpolation
      $translateProvider
        .addInterpolation('customInterpolation')
        .translations('en', {'FOO' : 'Some text'})
        .preferredLanguage('en');
    }));

    var $translate, $rootScope, $q;

    beforeEach(inject(function (_$translate_, _$rootScope_, _$q_) {
      $translate = _$translate_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $rootScope.$apply();
    }));
    it('should provide correct arguments in interpolate()', function () {
      $translate('FOO', {x : 1}, 'custom').then(function () {
      });
      $rootScope.$digest();
      expect(customInterpolator.interpolate).toHaveBeenCalledWith('Some text', Object({x : 1}), 'service', undefined, 'FOO');
    });
  });

  describe('$translate#proposedLanguage', function () {

    var $translate;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $provide.factory('customLoader', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();

          $timeout(function () {
            deferred.resolve({});
          }, 1000);

          return deferred.promise;
        };
      });

      $translateProvider
        .useLoader('customLoader')
        .preferredLanguage('en');
    }));

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should have a method proposedLanguage()', function () {
      expect($translate.proposedLanguage).toBeDefined();
    });

    it('should be a use function ', function () {
      expect(typeof $translate.proposedLanguage).toBe('function');
    });

    it('should return a string', function () {
      expect(typeof $translate.proposedLanguage()).toBe('string');
    });

    it('should return proposedLanguage', function () {
      expect($translate.proposedLanguage()).toEqual('en');
    });

    it('should be undefine when no there\'s no pending loader', function () {
      inject(function ($timeout) {
        $timeout.flush();
        expect($translate.proposedLanguage()).toBeUndefined();
      });
    });
  });

  describe('$translateProvider#useMissingTranslationHandler', function () {

    var missingTranslations = {};

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
      enableUnhandledRejectionTracing($provide);
      $translateProvider
        .translations('en', translationMock)
        .preferredLanguage('en')
        .useMissingTranslationHandler('customHandler');

      $provide.factory('customHandler', function () {
        return function (translationId, language, params, defaultTranslation) {
          missingTranslations[translationId] = {
            lang : language,
            params : params,
            defaultTranslation : defaultTranslation
          };
        };
      });

    }));

    var $translate,
      $rootScope;

    beforeEach(inject(function (_$translate_, _$rootScope_) {
      $translate = _$translate_;
      $rootScope = _$rootScope_;
    }));

    it('should not invoke missingTranslationHandler if translation id exists', function () {
      $translate('TRANSLATION_ID');
      expect(missingTranslations).toEqual({});
    });

    it('should invoke missingTranslationHandler if set and translation id doesn\'t exist', function () {
      $translate('NOT_EXISTING_TRANSLATION_ID', {});
      expect(missingTranslations).toEqual({
        'NOT_EXISTING_TRANSLATION_ID' : {
          lang : 'en',
          params : {},
          defaultTranslation : undefined
        }
      });
    });

    it('should pass on interpolationParams to missingTranslationHandler', function () {
      $translate('NOT_EXISTING_TRANSLATION_ID', {name : 'name'});
      expect(missingTranslations).toEqual({
        'NOT_EXISTING_TRANSLATION_ID' : {
          lang : 'en',
          params : {
            name : 'name'
          },
          defaultTranslation : undefined
        }
      });
    });

    it('should pass on defaultTranslationText to missingTranslationHandler', function () {
      $translate('NOT_EXISTING_TRANSLATION_ID', {name : 'name'}, '', 'DEFAULT');
      expect(missingTranslations).toEqual({
        'NOT_EXISTING_TRANSLATION_ID' : {
          lang : 'en',
          params : {
            name : 'name'
          },
          defaultTranslation : 'DEFAULT'
        }
      });
    });

    it('should reject promise if translation doesn\'t exist and handler returns undefined', function () {
      var wasResolved = false,
        wasRejected = false,
        promise = $translate('NOT_EXISTING_TRANSLATION_ID');
      promise.then(resolved, rejected);

      $rootScope.$digest();
      expect(wasResolved).toEqual(false);
      expect(wasRejected).toEqual(true);

      function resolved() {
        wasResolved = true;
      }

      function rejected() {
        wasRejected = true;
      }
    });
  });

  describe('$translate#refresh', function () {

    describe('no loader registered', function () {

      beforeEach(module('pascalprecht.translate'));

      var $translate;

      beforeEach(inject(function (_$translate_) {
        $translate = _$translate_;
      }));

      it('should be a function', function () {
        expect(typeof $translate.refresh).toBe('function');
      });

      it('should throw an error', function () {
        expect(function () {
          $translate.refresh();
        }).toThrowError('Couldn\'t refresh translation table, no loader registered!');
      });
    });

    describe('loader registered', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        enableUnhandledRejectionTracing($provide);
        $translateProvider
          .translations('de_DE', translationMock)
          .translations('en_EN', translationMock)
          .preferredLanguage('en_EN')
          .useLoader('customLoader');

        $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {

          return function (options) {
            var deferred = $q.defer();

            $timeout(function () {
              deferred.resolve({
                'FOO' : 'bar'
              });
            });

            return deferred.promise;
          };
        }]);
      }));

      var $translate, $timeout, $rootScope, $q;

      beforeEach(inject(function (_$translate_, _$timeout_, _$rootScope_, _$q_) {
        $translate = _$translate_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        $q = _$q_;
      }));

      it('should return a promise', function () {
        expect($translate.refresh().then).toBeDefined();
      });

      it('should refresh the translation table', function () {
        var oldValue, newValue;

        function fetchTranslation() {
          $translate(['EXISTING_TRANSLATION_ID', 'FOO']).then(function (translations) {
            oldValue = translations.EXISTING_TRANSLATION_ID;
            newValue = translations.FOO;
          });
          $rootScope.$digest();
        }

        fetchTranslation();
        expect(oldValue).toEqual('foo');
        expect(newValue).toEqual('FOO'); // not found

        $translate.refresh();
        $timeout.flush();
        $rootScope.$digest();

        fetchTranslation();
        expect(oldValue).toEqual('EXISTING_TRANSLATION_ID'); // not found
        expect(newValue).toEqual('bar');
      });

      it('should clear completely inactive translation tables', function () {
        var value;

        function setValue(answer) {
          value = answer;
        }

        function fetchTranslation() {
          $translate('EXISTING_TRANSLATION_ID').then(setValue, setValue);
          $rootScope.$digest();
        }

        function changeLanguage(lang) {
          $translate.use(lang);
          $rootScope.$digest();
        }

        changeLanguage('de_DE');
        fetchTranslation();
        expect(value).toEqual('foo'); // found

        changeLanguage('en_EN');
        $translate.refresh();
        $timeout.flush();
        $rootScope.$digest();

        changeLanguage('de_DE');
        $timeout.flush(); // Expect the `de_DE` language to be loaded
        $rootScope.$digest();

        fetchTranslation();
        expect(value).toEqual('EXISTING_TRANSLATION_ID'); // not found
      });

      it('should emit $translateRefreshStart event', function () {
        spyOn($rootScope, '$emit');
        $translate.refresh();
        $timeout.flush();
        expect($rootScope.$emit).toHaveBeenCalledWith('$translateRefreshStart', {language : undefined});
      });

      it('should emit $translateRefreshEnd', function () {
        spyOn($rootScope, '$emit');
        $translate.refresh();
        $timeout.flush();
        expect($rootScope.$emit).toHaveBeenCalledWith('$translateRefreshEnd', {language : undefined});
      });

      it('should emit $translateChangeSuccess event', function () {
        spyOn($rootScope, '$emit');
        $translate.refresh();
        $timeout.flush();
        expect($rootScope.$emit).toHaveBeenCalledWith('$translateChangeSuccess', {language : 'en_EN'});
      });
    });

    describe('loader registered:', function () {
      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        enableUnhandledRejectionTracing($provide);
        $translateProvider
          .preferredLanguage('en_EN')
          .useLoader('customLoader');
        $provide.factory('customLoader', function ($q, $timeout) {
          var alreadyLoaded = {};
          return function (options) {
            var deferred = $q.defer();
            $timeout(function () {
              if (options.key === 'en_EN' || !alreadyLoaded[options.key]) {
                alreadyLoaded[options.key] = true;
                deferred.resolve({
                  'FOO' : 'bar:' + options.key
                });
              } else {
                deferred.reject({});
              }
            });
            return deferred.promise;
          };
        });
      }));

      var $translate, $timeout, $rootScope, $q;

      beforeEach(inject(function (_$translate_, _$timeout_, _$rootScope_, _$q_) {
        $translate = _$translate_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        $q = _$q_;
      }));

      it('2 refresh job succeed, 0 refresh job failed', function () {
        var results = {ok : 0, err : 0};
        $translate.refresh().then(function () {
          results.ok++;
        }, function () {
          results.err++;
        });
        $timeout.flush();
        expect(results.ok).toEqual(1);
        expect(results.err).toEqual(0);
      });

      it('1 refresh job succeed, 1 refresh job failed', function () {
        var results = {ok : 0, err : 0};
        $translate.use('notavalidone');
        $timeout.flush();
        $translate.refresh().then(function () {
          results.ok++;
        }, function () {
          results.err++;
        });
        $timeout.flush();
        expect(results.ok).toEqual(0);
        expect(results.err).toEqual(1);
      });
    });
  });

  describe('$translate.instant', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('en', translationMock)
        .translations('en', {
          'FOO' : 'bar',
          'BAR' : 'foo',
          'NULL' : null,
          'FOOBAR' : 'Foo bar {{value}}',
        })
        .translations('de', {
          'FOO' : 'faa'
        })
        .useSanitizeValueStrategy('escape')
        .preferredLanguage('en');
    }));

    var $translate, $STORAGE_KEY, $q, $rootScope;

    beforeEach(inject(function (_$translate_, _$STORAGE_KEY_, _$q_, _$rootScope_) {
      $translate = _$translate_;
      $STORAGE_KEY = _$STORAGE_KEY_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    it('should return translation if translation id exist', function () {
      expect($translate.instant('FOO')).toEqual('bar');
    });

    it('should return translation id if translation id not exist', function () {
      expect($translate.instant('FOO2')).toEqual('FOO2');
    });

    it('should return empty string if translated string is empty', function () {
      expect($translate.instant('BLANK_VALUE')).toEqual('');
    });

    it('should handle null values as if not exists', function () {
      expect($translate.instant('NULL')).toEqual('NULL');
    });

    it('should return translations of multiple translation ids', function () {
      var result = $translate.instant(['FOO', 'FOO2', 'BLANK_VALUE']);
      expect(result.FOO).toEqual('bar');
      expect(result.FOO2).toEqual('FOO2');
      expect(result.BLANK_VALUE).toEqual('');
    });

    it('should use forceLanguage', function () {
      expect($translate.instant('FOO', null, null, 'de')).toEqual('faa');
    });

    it('should use forceLanguage with multiple translation ids', function () {
      expect($translate.instant(['FOO'], null, null, 'de').FOO).toEqual('faa');
    });

    it('should override sanitize strategy for one call', function () {
      expect($translate.instant('FOOBAR', {value : '<p>value</p>'}, null, null, null))
        .toEqual('Foo bar <p>value</p>');
    });
  });

  describe('$translate.instant (with fallback)', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
      enableUnhandledRejectionTracing($provide);
      $translateProvider
        .useLoader('customLoader')
        .translations('en', {
          'FOO' : 'bar',
          'BAR' : 'foo',
          'BARE' : '',
          'NULL' : null,
          'FOOBAR' : 'Foo bar {{value}}',
        })
        .translations('de', {
          'FOO2' : 'bar2'
        })
        .translations('fr', {
          'BARE' : 'bare'
        })
        .useSanitizeValueStrategy('escape')
        .fallbackLanguage('en')
        .preferredLanguage('de');

      $provide.factory('customLoader', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();

          $timeout(function () {
            deferred.resolve({});
          }, 1000);

          return deferred.promise;
        };
      });
    }));

    var $translate, $STORAGE_KEY, $q, $rootScope;

    beforeEach(inject(function (_$translate_, _$STORAGE_KEY_, _$q_, _$rootScope_) {
      $translate = _$translate_;
      $STORAGE_KEY = _$STORAGE_KEY_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    it('should return translation if translation id exist', function () {
      expect($translate.instant('FOO')).toEqual('bar');
      expect($translate.instant('FOO2')).toEqual('bar2');
      expect($translate.instant('BARE')).toEqual('');
    });

    it('should return translation if translation id exist' +
      'in a fallback language and skip sanitize if a' +
      'null value is passed', function () {
      expect($translate.instant('FOOBAR', {value : '<p>value</p>'}, null, null, null)).toEqual('Foo bar <p>value</p>');
    });

    it('should return translation id if translation id nost exist', function () {
      expect($translate.instant('FOO3')).toEqual('FOO3');
    });

    it('should return the first translation if multiple fallbacks exist', function () {
      expect($translate.instant('BARE')).toEqual('');
    });

    it('should return translation id with default interpolator if translation id nost exist', function () {
      expect($translate.instant('FOO4 {{value}}', {'value' : 'PARAM'})).toEqual('FOO4 PARAM');
    });

    it('should return translation id with default interpolator' +
      'if translation id nost exist and don\'t sanitize if' +
      'the sanitize strategy is overriden', function () {
      expect($translate.instant('FOO4 {{value}}', {value : '<p>value</p>'}, null, null, null)).toEqual('FOO4 <p>value</p>');
    });

    it('should return translation id if translation id exist with forceLanguage', function () {
      expect($translate.instant('FOO', null, null, 'de')).toEqual('bar');
    });

    it('should return translation id if translation id exist with forceLanguage' +
      'and don\'t sanitize when sanitize strategy is overriden to null', function () {
      expect($translate.instant('FOOBAR', {value : '<p>value</p>'}, null, 'de', null)).toEqual('Foo bar <p>value</p>');
    });
  });

  describe('$translate.instant (with fallback and not found indicators)', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
      enableUnhandledRejectionTracing($provide);
      $translateProvider
        .useLoader('customLoader')
        .translations('en', {
          'FOO' : 'bar'
        })
        .translations('de', {
          'FOO2' : 'bar2'
        })
        .fallbackLanguage('en')
        .preferredLanguage('de')
        .translationNotFoundIndicator('-+-+');

      $provide.factory('customLoader', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();

          $timeout(function () {
            deferred.resolve({});
          }, 1000);

          return deferred.promise;
        };
      });
    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should return translation if translation id exist', function () {
      expect($translate.instant('FOO')).toEqual('bar');
      expect($translate.instant('FOO2')).toEqual('bar2');
    });

    it('should return translation id wrapped into not found indicators if translation id does not exist', function () {
      expect($translate.instant('FOO3')).toEqual('-+-+ FOO3 -+-+');
    });
  });

  describe('$translate#determineTranslation with fallback for shortcuts', function () {

    var missingTranslations = {};

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
      enableUnhandledRejectionTracing($provide);
      $translateProvider
        .translations('en', {
          'NAMESPACE1' : {
            'SUBSPACE1' : {
              'FOO' : 'Translation1',
              'BAR' : 'Translation2',
              'SUBSPACE1' : 'Subtrans'
            }
          }
        })
        .translations('de', {
          'FOO' : 'Ich bin ein Foo'
        })
        .translations('fr', {
          'NAMESPACE1' : {
            'SUBSPACE1' : {
              'FOO' : 'Translation1 Francais',
              'BAR' : 'Translation2 Francais',
              'SUBSPACE1' : 'Subtrans',
              'SUBSPACE2' : 'Subtrans un a deux'
            },
            'SUBSPACE_FR' : {
              'SUBSPACE_FR' : 'Francais angular'
            },
            'FALLBACK' : '@:NAMESPACE1.SUBSPACE1.FOO'
          }
        })
        .fallbackLanguage(['de', 'fr'])
        .preferredLanguage('en');


    }));

    var $translate, $q, $rootScope;

    beforeEach(inject(function (_$translate_, _$q_, _$rootScope_) {
      $translate = _$translate_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    it('should invoke the translation method and return the shortcut translation value', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (foo) {
        value = foo;
      });
      $translate('NAMESPACE1.SUBSPACE1').then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('Subtrans');
    });

    it('should invoke the translation fallback stack and return the resolved French shortcut', function () {
      var deferred = $q.defer(),
        promise = deferred.promise,
        value;

      promise.then(function (foo) {
        value = foo;
      });
      $translate('NAMESPACE1.SUBSPACE_FR').then(function (translation) {
        deferred.resolve(translation);
      });
      $rootScope.$digest();
      expect(value).toEqual('Francais angular');
    });

    it('should invoke the translation fallback stack and return the resolved at syntax based shortcut', function () {
      expect($translate.instant('NAMESPACE1.FALLBACK')).toBe('Translation1 Francais');
    });

  });

  describe('$translateProvider.forceAsyncReload', function () {

    describe('Enabled', function () {
      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        enableUnhandledRejectionTracing($provide);
        $translateProvider
          .translations('en', {
            'FOO' : 'bar'
          })
          .forceAsyncReload(true)
          .useLoader('customLoader');

        $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {
          return function (options) {
            var deferred = $q.defer();

            $timeout(function () {
              deferred.resolve({
                'BAR' : 'foo'
              });
            });

            return deferred.promise;
          };
        }]);
      }));

      var $translate, $timeout, $rootScope;

      beforeEach(inject(function (_$translate_, _$timeout_, _$rootScope_) {
        $translate = _$translate_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
      }));

      it('should have forceAsyncReload enabled', function () {
        expect($translate.isForceAsyncReloadEnabled()).toBe(true);
      });

      it('should return translation if translation id exist', function () {
        var firstValue, secondValue;

        function fetchTranslation() {
          $translate(['FOO', 'BAR']).then(function (translations) {
            firstValue = translations.FOO;
            secondValue = translations.BAR;
          });
        }

        function changeLanguage(lang) {
          $translate.use(lang);
        }

        changeLanguage('en');
        $timeout.flush(); // Expect the `en` language to be loaded
        $rootScope.$digest();

        fetchTranslation();
        $rootScope.$digest();
        expect(firstValue).toEqual('bar'); // found
        expect(secondValue).toEqual('foo'); // found
      });
    });

    describe('Disabled (default)', function () {
      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        enableUnhandledRejectionTracing($provide);
        $translateProvider
          .translations('en', {
            'FOO' : 'bar'
          })
          .useLoader('customLoader');

        $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {
          return function (options) {
            var deferred = $q.defer();

            $timeout(function () {
              deferred.resolve({
                'BAR' : 'foo'
              });
            });

            return deferred.promise;
          };
        }]);
      }));

      var $translate, $rootScope;

      beforeEach(inject(function (_$translate_, _$rootScope_) {
        $translate = _$translate_;
        $rootScope = _$rootScope_;
      }));

      it('should have forceAsyncReload disabled', function () {
        expect($translate.isForceAsyncReloadEnabled()).toBe(false);
      });

      it('should return translation if translation id exist', function () {
        var firstValue, secondValue;

        function fetchTranslation() {
          $translate(['FOO', 'BAR']).then(function (translations) {
            firstValue = translations.FOO;
            secondValue = translations.BAR;
          });
        }

        function changeLanguage(lang) {
          $translate.use(lang);
        }

        changeLanguage('en');
        $rootScope.$digest();

        fetchTranslation();
        $rootScope.$digest();
        expect(firstValue).toEqual('bar'); // found
        expect(secondValue).toEqual('BAR'); // not found
      });
    });
  });

  describe('$translate#use() being changed to a fallback while having a fallback stack also async loaded', function () {

    var fastButRequestedSecond = 'en_US',
      slowButRequestedFirst = 'ab_CD',
      expectedTranslation = 'Hello World',
      notExpectedTranslation = 'foo bar bork bork bork',
      onlyFirstTranslation = 'Only In First',
      onlySecondTranslation = 'Only In Second',
      fastRequestTime = 1000,
      firstLanguageResponded = false,
      secondLanguageResponded = false;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $translateProvider.useLoader('customLoader');

      $translateProvider.preferredLanguage(slowButRequestedFirst);
      $translateProvider.fallbackLanguage(fastButRequestedSecond);

      $provide.service('customLoader', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();
          var locale = options.key;

          if (locale === fastButRequestedSecond) {
            $timeout(function () {
              secondLanguageResponded = true;
              deferred.resolve({
                greeting : expectedTranslation,
                onlySecond : onlySecondTranslation
              });
            }, fastRequestTime);
          }

          if (locale === slowButRequestedFirst) {
            $timeout(function () {
              firstLanguageResponded = true;
              deferred.resolve({
                greeting : notExpectedTranslation,
                onlyFirst : onlyFirstTranslation
              });
            }, fastRequestTime * 4);
          }

          return deferred.promise;
        };
      });
    }));

    var $translate;

    beforeEach(inject(function ($timeout, _$translate_, $rootScope) {
      $translate = _$translate_;

      $timeout(function () {
        $translate.use(slowButRequestedFirst);
      }, fastRequestTime / 2);

      $timeout.flush();
      $rootScope.$digest();
    }));

    it('should be requested the first language', function () {
      expect(firstLanguageResponded).toEqual(true);
    });

    it('should be requested the second language', function () {
      expect(secondLanguageResponded).toEqual(true);
    });

    it('should set the language to be the most recently requested one, not the most recently responded one', inject(function ($rootScope, $q, $timeout) {

      var value, firstValue, secondValue;

      $timeout(function () {
        $translate.use(fastButRequestedSecond).then(function (result) {
          $translate('greeting').then(function (translation) {
            value = translation;
          });

          $translate('onlyFirst').then(function (translation) {
            firstValue = translation;
          });

          $translate('onlySecond').then(function (translation) {
            secondValue = translation;
          });
        });


      }, fastRequestTime / 2);
      $timeout.flush();
      $rootScope.$digest();

      $rootScope.$digest();
      expect(value).toEqual(expectedTranslation);
      expect(firstValue).toEqual(onlyFirstTranslation);
      expect(secondValue).toEqual(onlySecondTranslation);
    }));
  });

  describe('$translate#getAvailableLanguageKeys()', function () {

    var availKeys = [
      {'de-de' : 'DE'},
      {'en-gb' : 'EN'},
      {'*' : 'EN'}
    ];

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.registerAvailableLanguageKeys(availKeys);
    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should have the configured array as a return value', function () {
      expect($translate.getAvailableLanguageKeys()).toEqual(availKeys);
    });

  });

  describe('$translate#getTranslationTable()', function () {
    var ru_RU_translationMock = {'HI' : 'Всем  привет!'};
    var en_EN_translationMock = {'HI' : 'Hello there!'};

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('ru_RU', ru_RU_translationMock)
        .translations('en_EN', en_EN_translationMock)
        .preferredLanguage('ru_RU');
    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should return translation table which is curently in use if no params', function () {
      expect(angular.equals($translate.getTranslationTable(), ru_RU_translationMock)).toBe(true);
    });

    it('should return translation table by translation Id', function () {
      expect(angular.equals($translate.getTranslationTable('en_EN'), en_EN_translationMock)).toBe(true);
    });

    it('should return a copy of translation table', function () {
      var copy = $translate.getTranslationTable('en_EN');
      copy.HI = "what's up";
      expect(angular.equals($translate.getTranslationTable('en_EN'), en_EN_translationMock)).toBe(true);
    });

    it('should return null if translation table with translation Id does not exist', function () {
      expect($translate.getAvailableLanguageKeys('NOT_EXISTING_TRANSLATION_ID')).toEqual(null);
    });

  });

  describe('$translate#postprocess() with an enabled fallback language', function () {

    describe('single post processDemo', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider
        //.translations('de_DE', translationMock)
          .translations('de_DE', {'ONLY_GERMAN' : 'DE_TRANS', 'BOTH' : 'BOTH_DE'})
          .translations('en_EN', {'TRANSLATION__ID' : 'bazinga', 'BOTH' : 'BOTH_EN'})
          .fallbackLanguage('en_EN')
          .preferredLanguage('de_DE')
          .postProcess(function (translationId, translation, interpolatedTranslation, params, lang) {
            return translationId + ',' + lang + ',' + (interpolatedTranslation ? interpolatedTranslation : translation);
          });
      }));

      var $translate, $q, $rootScope;

      beforeEach(inject(function (_$translate_, _$q_, _$rootScope_) {
        $translate = _$translate_;
        $q = _$q_;
        $rootScope = _$rootScope_;
      }));

      it('should return a formatted postprocessed string on fallback language', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translation) {
          value = translation;
        });
        $translate('TRANSLATION__ID').then(function (translation) {
          deferred.resolve(translation);
        });

        $rootScope.$digest();
        expect(value).toEqual('TRANSLATION__ID,en_EN,bazinga');
      });
      it('should return a formatted postprocessed string on preferred language', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translation) {
          value = translation;
        });
        $translate('ONLY_GERMAN').then(function (translation) {
          deferred.resolve(translation);
        });

        $rootScope.$digest();
        expect(value).toEqual('ONLY_GERMAN,de_DE,DE_TRANS');
      });
      it('should return a formatted postprocessed string on preferred language', function () {
        var deferred = $q.defer(),
          promise = deferred.promise,
          value;

        promise.then(function (translation) {
          value = translation;
        });
        $translate('BOTH').then(function (translation) {
          deferred.resolve(translation);
        });

        $rootScope.$digest();
        expect(value).toEqual('BOTH,de_DE,BOTH_DE');
      });
      it('should return a formatted postprocessed string on preferred language with instant', function () {
        var value;
        value = $translate.instant('BOTH');
        expect(value).toEqual('BOTH,de_DE,BOTH_DE');
      });
    });
  });

  // Spec for edge case: preferred language is not found
  //                     but another fallback language has a translation file available
  //                     or any other async case
  describe('$translate with async loading having an invalid preferredLang and one fallbackLang existing', function () {

    var theFallbackLangKey = 'en_US',
      thePreferredLangKey = 'ab_CD',
      expectedTranslation = 'foo bar bork bork bork',
      firstLanguageResponded = false,
      secondLanguageResponded = false;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $translateProvider.useLoader('customLoader');

      $translateProvider.preferredLanguage(thePreferredLangKey);
      $translateProvider.fallbackLanguage(theFallbackLangKey);

      $provide.service('customLoader', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();
          var locale = options.key;

          if (locale === theFallbackLangKey) {
            secondLanguageResponded = true;
            deferred.resolve({
              greeting : expectedTranslation
            });
          }

          if (locale === thePreferredLangKey) {
            deferred.reject(thePreferredLangKey);
          }

          return deferred.promise;
        };
      });
    }));

    var $translate;

    beforeEach(inject(function ($timeout, _$translate_, $rootScope) {
      $translate = _$translate_;
      $rootScope.$digest();

    }));

    it('should set the language to be the most recently requested one, not the most recently responded one', inject(function ($rootScope, $q) {

      var value;

      $translate('greeting').then(function (translation) {
        value = translation;
      });

      $rootScope.$digest();
      expect(value).toEqual(expectedTranslation);
      expect(secondLanguageResponded).toEqual(true);
    }));
  });

  // Spec for edge case: preferred and fallback language are not found
  describe('$translate with async loading having an invalid preferredLang and one fallbackLang existing', function () {

    var theFallbackLangKey = 'ef_GH',
      thePreferredLangKey = 'ab_CD';

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      enableUnhandledRejectionTracing($provide);

      $translateProvider.useLoader('customLoader');

      $translateProvider.preferredLanguage(thePreferredLangKey);
      $translateProvider.fallbackLanguage(theFallbackLangKey);

      $provide.service('customLoader', function ($q) {
        return function (options) {
          var locale = options.key;
          return $q.reject(locale);
        };
      });
    }));

    var $translate;

    beforeEach(inject(function ($timeout, _$translate_, $rootScope) {
      $translate = _$translate_;
      $rootScope.$digest();
    }));

    it('should fail without going into infinite loop', inject(function ($rootScope) {

      var failed = false;

      $translate('greeting').catch(function () {
        failed = true;
      });

      $rootScope.$digest();
      expect(failed).toEqual(true);
    }));
  });

  describe('$translate with sce activated', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('en', {
          'FOO' : 'foo',
          'BAR' : 'Bar'
        })
        .translations('de', {
          'FOO' : 'foo'
        })
        .useSanitizeValueStrategy('sce')
        .fallbackLanguage('en')
        .preferredLanguage('de');
    }));

    it('should handle TrustedValueHolderType inner-results', inject(function ($translate) {
      expect($translate.instant('BAR').$$unwrapTrustedValue()).toEqual('Bar');
    }));
  });
});
