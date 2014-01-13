describe('pascalprecht.translate', function () {

  var translationMock = {
    'EXISTING_TRANSLATION_ID': 'foo',
    'BLANK_VALUE': '',
    'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
    'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
    'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
    'DOCUMENT': {
      'HEADER': {
        'TITLE': 'Header'
      },
      'SUBHEADER': {
        'TITLE': '2. Header'
      }
    }
  };

  describe('$translate', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations(translationMock)
        .translations({
          'FOO': 'bar',
          'BAR': 'foo'
        });
    }));

    var $translate, $STORAGE_KEY;

    beforeEach(inject(function (_$translate_, _$STORAGE_KEY_) {
      $translate = _$translate_;
      $STORAGE_KEY = _$STORAGE_KEY_;
    }));

    it('should be defined', function () {
      expect($translate).toBeDefined();
    });

    it('should be a function object', function () {
      expect(typeof $translate).toBe("function");
    });

    it('should have a method uses()', function () {
      expect($translate.uses).toBeDefined();
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

    describe('$translate#preferredLanguage()', function () {

      it('should be a function', function () {
        expect(typeof $translate.preferredLanguage).toBe('function');
      });

      it('should return undefined if no language is specified', function () {
        expect($translate.preferredLanguage()).toBeUndefined();
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

    it('should return translation id if translation doesn\'t exist', function () {
      var translationId = 'NOT_EXISTING_TRANSLATION_ID';
      expect($translate(translationId)).toEqual(translationId);
    });

    it('should return translation if translation id if exists', function () {
      expect($translate("EXISTING_TRANSLATION_ID")).toEqual('foo');
      expect($translate("BLANK_VALUE")).toEqual('');
    });

    it('should return translation, if translation id exists with whitespace', function () {
      expect($translate("EXISTING_TRANSLATION_ID\t        \n")).toEqual('foo');
      expect($translate("\t        \nEXISTING_TRANSLATION_ID")).toEqual('foo');
      expect($translate("BLANK_VALUE\t        \n")).toEqual('');
      expect($translate("\t        \nBLANK_VALUE")).toEqual('');
    });

    it('should use $interpolate service', function () {
        expect($translate('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
        expect($translate('TRANSLATION_ID', {
          value: 'foo'
        })).toEqual('Lorem Ipsum foo');
        expect($translate('TRANSLATION_ID_2', {
          value: 'foo'
        })).toEqual('Lorem Ipsum foo + foo');
        expect($translate('TRANSLATION_ID_3', {
          value: 'foo'
        })).toEqual('Lorem Ipsum foofoo');
        expect($translate('TRANSLATION_ID_3', {
          value: '3'
        })).toEqual('Lorem Ipsum 33');
        expect($translate('TRANSLATION_ID_3', {
          value: 3
        })).toEqual('Lorem Ipsum 6');
    });

    it('should extend translation table rather then overwriting it', function () {
      expect($translate('FOO')).toEqual('bar');
      expect($translate('BAR')).toEqual('foo');
    });

    it('should support namespaces in translation ids', function () {
      expect($translate('DOCUMENT.HEADER.TITLE')).toEqual('Header');
      expect($translate('DOCUMENT.SUBHEADER.TITLE')).toEqual('2. Header');
    });
  });

  describe('$translate#uses()', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('de_DE', translationMock)
        .translations('de_DE', { 'YET_ANOTHER': 'Hallo da!' })
        .translations('en_EN', { 'YET_ANOTHER': 'Hello there!' })
        .preferredLanguage('de_DE');
    }));

    var $translate, $rootScope, $STORAGE_KEY;

    beforeEach(inject(function (_$translate_, _$rootScope_, _$STORAGE_KEY_) {
      $translate = _$translate_;
      $rootScope = _$rootScope_;
      $STORAGE_KEY = _$STORAGE_KEY_;
    }));

    it('should be a function', function () {
      expect(typeof $translate.uses).toBe('function');
    });

    it('should return a string', function () {
      expect(typeof $translate.uses()).toBe('string');
    });

    it('should return language key', function () {
      expect($translate.uses()).toEqual('de_DE');
    });

    it('should change language at runtime', function () {
      expect($translate('YET_ANOTHER')).toEqual('Hallo da!');
      $translate.uses('en_EN');
      $rootScope.$apply();
      expect($translate('YET_ANOTHER')).toEqual('Hello there!');
    });
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
      expect($translate.storageKey()).toNotEqual($STORAGE_KEY);
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

  describe('$translate#fallbackLanguage()', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('de_DE', translationMock)
        .translations('en_EN', { 'TRANSLATION__ID': 'bazinga' })
        .preferredLanguage('de_DE')
        .fallbackLanguage('en_EN');
    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should return a string if language is specified', function () {
      expect(typeof $translate.fallbackLanguage()).toBe('string');
    });

    it('should return a correct language code', function () {
      expect($translate.fallbackLanguage()).toEqual('en_EN');
    });

    it('should use fallback language if translation id doesn\'t exist', function () {
      expect($translate('TRANSLATION__ID')).toEqual('bazinga');
    });
  });

  describe('$translateProvider#translationNotFoundIndicator', function () {

    describe('setting both indicators implicitly', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider.translationNotFoundIndicator('✘');
      }));

      it('should inject indicators for not found translations', function () {
        inject(function ($translate) {
          expect($translate('NOT_FOUND')).toEqual('✘ NOT_FOUND ✘');
        });
      });
    });

    describe('setting left indicator explicitly', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider.translationNotFoundIndicatorLeft('✘');
      }));

      it('should inject left indicator for not found translations', function () {
        inject(function ($translate) {
          expect($translate('NOT_FOUND')).toEqual('✘ NOT_FOUND');
        });
      });
    });

    describe('setting right indicator explicitly', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider.translationNotFoundIndicatorRight('✘');
      }));

      it('should inject right indicator for not found translations', function () {
        inject(function ($translate) {
          expect($translate('NOT_FOUND')).toEqual('NOT_FOUND ✘');
        });
      });
    });
  });

  describe('$translateProvider#useLoader', function () {

    beforeEach(module('pascalprecht.translate', function($translateProvider, $provide) {
      $translateProvider.useLoader('customLoader');
      $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {
        return function (options) {
          var deferred = $q.defer();

          $timeout(function () {
            deferred.resolve({
              FOO: 'bar'
            });
          }, 1000);

          return deferred.promise;
        };
      }]);
    }));

    it('should use custom loader', function () {
      inject(function ($translate, $timeout) {
        $translate.uses('en');
        $timeout.flush();
        expect($translate('FOO')).toEqual('bar');
      });
    });
  });

  describe('$translateProvider#useMessageFormatInterpolation()', function () {

    var $translate;

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {

      $translateProvider
        .translations('en', {
          'REPLACE_VARS': 'Foo bar {value}',
          'SELECT_FORMAT': '{GENDER, select, male{He} female{She} other{They}} liked this.',
          'PLURAL_FORMAT': 'There {NUM_RESULTS, plural, one{is one result} other{are # results}}.',
          'PLURAL_FORMAT_OFFSET': 'You {NUM_ADDS, plural, offset:1' +
                                    '=0{didnt add this to your profile}' + // Number literals, with a `=` do **NOT** use
                                    'zero{added this to your profile}' +   //   the offset value
                                    'one{and one other person added this to their profile}' +
                                    'other{and # others added this to their profiles}' +
                                  '}.'
        })
        .useMessageFormatInterpolation()
        .preferredLanguage('en');
    }));

    beforeEach(inject(function (_$translate_, $rootScope) {
      $translate = _$translate_;
    }));

    it('should replace interpolateParams with concrete values', function () {
      expect($translate('REPLACE_VARS', { value: 5 })).toEqual('Foo bar 5');
    });

    it('should support SelectFormat', function () {
      expect($translate('SELECT_FORMAT', { GENDER: 'male'})).toEqual('He liked this.');
      expect($translate('SELECT_FORMAT', { GENDER: 'female'})).toEqual('She liked this.');
      expect($translate('SELECT_FORMAT')).toEqual('They liked this.');
    });

    it('should support PluralFormat', function () {
      expect($translate('PLURAL_FORMAT', { 'NUM_RESULTS': 0 })).toEqual('There are 0 results.');
      expect($translate('PLURAL_FORMAT', { 'NUM_RESULTS': 1 })).toEqual('There is one result.');
      expect($translate('PLURAL_FORMAT', { 'NUM_RESULTS': 100 })).toEqual('There are 100 results.');
    });

    it('should support PluralFormat - offset extension', function () {
      expect($translate('PLURAL_FORMAT_OFFSET', { 'NUM_ADDS': 0 })).toEqual('You didnt add this to your profile.');
      expect($translate('PLURAL_FORMAT_OFFSET', { 'NUM_ADDS': 2 })).toEqual('You and one other person added this to their profile.');
      expect($translate('PLURAL_FORMAT_OFFSET', { 'NUM_ADDS': 3 })).toEqual('You and 2 others added this to their profiles.');
    });
  });

  describe('$translateProvider#addInterpolation', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

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
        translateInterpolator.interpolate = function (string, interpolateParams) {
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
        .translations('en', { 'FOO': 'Some text' })
        .translations('de', {
          'FOO': 'Irgendwas',
          'BAR': 'yupp'
        })
        .preferredLanguage('en')
        .fallbackLanguage('de');
    }));

    var $translate, $rootScope;

    beforeEach(inject(function (_$translate_, _$rootScope_) {
      $translate = _$translate_;
      $rootScope = _$rootScope_;
      $rootScope.$apply();
    }));

    it('should translate', function () {
      expect($translate('FOO')).toEqual('Some text');
    });

    it('should use custom interpolation', function () {
      expect($translate('FOO', {}, 'custom')).toEqual('custom interpolation');
    });

    it('should inform custom interpolation when language has been changed', function () {
      expect($translate('FOO', {}, 'custom')).toEqual('custom interpolation');
      $translate.uses('de');
      $rootScope.$apply();
      expect($translate('FOO', {}, 'custom')).toEqual('foo');
    });

    it('should use fallback language, if configured', function () {
      expect($translate('BAR', {}, 'custom')).toEqual('foo');
      expect($translate('FOO', {}, 'custom')).toEqual('custom interpolation');
    });
  });

  describe('$translate#proposedLanguage', function () {

    var $translate;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

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
      $translateProvider
        .translations(translationMock)
        .useMissingTranslationHandler('customHandler');

      $provide.factory('customHandler', function () {
        return function (translationId, language) {
          missingTranslations[translationId] = { lang: language };
        };
      });

    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));

    it('should not invoke missingTranslationHandler if translation id exists', function () {
      $translate('TRANSLATION_ID');
      expect(missingTranslations).toEqual({});
    });

    it('should invoke missingTranslationHandler if set and translation id doesn\'t exist', function () {
      $translate('NOT_EXISTING_TRANSLATION_ID');
      expect(missingTranslations).toEqual({
        'NOT_EXISTING_TRANSLATION_ID': {
          lang: undefined
        }
      });
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
        }).toThrow('Couldn\'t refresh translation table, no loader registered!');
      });
    });

    describe('loader registered', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        $translateProvider
          .translations('de_DE', translationMock)
          .preferredLanguage('de_DE')
          .fallbackLanguage('en_EN')
          .useLoader('customLoader');

        $provide.factory('customLoader', ['$q', '$timeout', function ($q, $timeout) {

          return function (options) {
            var deferred = $q.defer();

            $timeout(function () {
              deferred.resolve({
                'FOO': 'bar'
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

      it('should return a promise', function () {
        expect($translate.refresh().then).toBeDefined();
      });

      it('should refresh the translation table', function () {
        expect($translate('EXISTING_TRANSLATION_ID')).toEqual('foo');
        expect($translate('FOO')).toEqual('FOO');
        $translate.refresh();
        $timeout.flush();
        expect($translate('EXISTING_TRANSLATION_ID')).toEqual('EXISTING_TRANSLATION_ID');
        expect($translate('FOO')).toEqual('bar');
      });

      it('should emit $translateRefreshStart event', function () {
        spyOn($rootScope, '$emit');
        $translate.refresh();
        $timeout.flush();
        expect($rootScope.$emit).toHaveBeenCalledWith('$translateRefreshStart');
      });

      it('should emit $translateRefreshEnd', function () {
        spyOn($rootScope, '$emit');
        $translate.refresh();
        $timeout.flush();
        expect($rootScope.$emit).toHaveBeenCalledWith('$translateRefreshEnd');
      });

      it('should emit $translateChangeSuccess event', function() {
        spyOn($rootScope, '$emit');
        $translate.refresh();
        $timeout.flush();
        expect($rootScope.$emit).toHaveBeenCalledWith('$translateChangeSuccess');
      });

      it('should refresh fallback languages', function () {
        $translate.refresh();
        $timeout.flush();
        $translate.uses('en_EN');
        $rootScope.$apply();
        expect($translate('FOO')).toEqual('bar');
      });
    });
  });

  describe('$translateProvider#determinePreferredLanguage()', function () {

    describe('without locale negotiation', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider
          .translations('en_US', { FOO: 'bar' })
          .translations('de_DE', { FOO: 'foo' })
          .determinePreferredLanguage(function () {
            // mocking
            // Work's like `window.navigator.lang = 'en_US'`
            var nav = {
              language: 'en_US'
            };
            return ((
              nav.language ||
              nav.browserLanguage ||
              nav.systemLanguage ||
              nav.userLanguage
            ) || '').split('-').join('_');
          });
      }));

      it('should determine browser language', function () {
        inject(function ($translate) {
          expect($translate('FOO')).toEqual('bar');
        });
      });
    });

    describe('with locale negotiation', function () {

      beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider
          .translations('en', { FOO: 'bar' })
          .translations('de', { FOO: 'foo' })
          .registerAvailableLanguageKeys(['en', 'de'], {
            'en_US': 'en',
            'de_DE': 'de'
          })
          .determinePreferredLanguage(function () {
            // mocking
            // Work's like `window.navigator.lang = 'en_US'`
            var nav = {
              language: 'en_US'
            };
            return ((
              nav.language ||
              nav.browserLanguage ||
              nav.systemLanguage ||
              nav.userLanguage
            ) || '').split('-').join('_');
          });
      }));

      it('should determine browser language', function () {
        inject(function ($translate) {
          expect($translate('FOO')).toEqual('bar');
        });
      });
    });
  });
});
