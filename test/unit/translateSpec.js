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

    it('should have a method rememberLanguage()', function () {
      inject(function ($translate) {
        expect($translate.rememberLanguage).toBeDefined();
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
  });

  describe('$translateService (single-lang)', function () {

    beforeEach(module('ngTranslate', function ($translateProvider) {
      $translateProvider.translations({
        'EXISTING_TRANSLATION_ID': 'foo',
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
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
      $translateProvider.translations('en_EN', {
        'YET_ANOTHER': 'Hello there!'
      });
      $translateProvider.uses('de_DE');
      $translateProvider.rememberLanguage(true);
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

    describe('$translateService#rememberLanguage()', function () {

      it('should have a method rememberLanguage()', function () {
        inject(function ($translate) {
          expect($translate.rememberLanguage).toBeDefined();
        });
      });

      it('should be a function', function () {
        inject(function ($translate) {
          expect(typeof $translate.rememberLanguage).toBe('function');
        });
      });

      it('should return true if remmemberLanguage() is set to true', function () {
        inject(function ($translate) {
          expect($translate.rememberLanguage()).toBe(true);
        });
      });

      it('should use fallback language if no language is stored in $cookieStore', function () {
        inject(function ($cookieStore, $COOKIE_KEY) {
          expect($cookieStore.get($COOKIE_KEY)).toBe('de_DE');
        });
      });

      it('should remember when the language switched', function () {
        inject(function ($translate, $rootScope, $cookieStore, $COOKIE_KEY) {
          expect($translate('YET_ANOTHER')).toBe('Hallo da!');
          $translate.uses('en_EN');
          $rootScope.$digest();
          expect($translate('YET_ANOTHER')).toBe('Hello there!');
          expect($cookieStore.get($COOKIE_KEY)).toBe('en_EN');
        });
      });
    });

  });

  describe('$translateFilter (single-lang)', function () {

    beforeEach(module('ngTranslate', function ($translateProvider) {
      $translateProvider.translations({
        'EXISTING_TRANSLATION_ID': 'foo',
        'ANOTHER_ONE': 'bar',
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
        'YET_ANOTHER': 'Hallo da!',
        'TEXT': 'this is a text',
        'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
        'HOW_ABOUT_THIS': '{{value}} + {{value}}',
        'AND_THIS': '{{value + value}}'
      });
    }));

    it('should be a function object', function () {
      inject(function ($filter) {
        expect(typeof $filter('translate')).toBe("function");
      });
    });

    it('should return translation id if translation doesn\'t exist', function () {
      inject(function ($filter) {
        expect($filter('translate')('WOOP')).toEqual('WOOP');
      });
    });

    it('should return translation if translation id exist', function () {
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      });
    });

    it('should replace interpolate directives with empty string if no values given', function () {
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      });
    });

    it('should replace interpolate directives with given values', function () {
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID', { value: 'foo'})).toEqual('Lorem Ipsum foo');
        expect($filter('translate')('TRANSLATION_ID_2', { value: 'foo'})).toEqual('Lorem Ipsum foo + foo');
        expect($filter('translate')('TRANSLATION_ID_3', { value: 'foo'})).toEqual('Lorem Ipsum foofoo');
        expect($filter('translate')('TRANSLATION_ID_3', { value: '3'})).toEqual('Lorem Ipsum 33');
        expect($filter('translate')('TRANSLATION_ID_3', { value: 3})).toEqual('Lorem Ipsum 6');
      });
    });

    it('should replace interpolate directives with given values as string expression', function () {
      inject(function ($filter) {
        expect($filter('translate')('TEXT')).toEqual('this is a text');
        expect($filter('translate')('TEXT_WITH_VALUE')).toEqual('This is a text with given value: ');
        expect($filter('translate')('TEXT_WITH_VALUE', "{'value': 'dynamic value'}")).toEqual('This is a text with given value: dynamic value');
        expect($filter('translate')('TEXT_WITH_VALUE', "{'value': '3'}")).toEqual('This is a text with given value: 3');
        expect($filter('translate')('HOW_ABOUT_THIS', "{'value': '4'}")).toEqual('4 + 4');
        expect($filter('translate')('AND_THIS', "{'value': 5}")).toEqual('10');
        expect($filter('translate')('AND_THIS', "{'value': '5'}")).toEqual('55');
      });
    });
  });

  describe('$translateFilter (multi-lang)', function () {

    beforeEach(module('ngTranslate', function ($translateProvider) {
      $translateProvider.translations('en_EN', {
        'EXISTING_TRANSLATION_ID': 'foo',
        'ANOTHER_ONE': 'bar',
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
        'YET_ANOTHER': 'Hallo da!',
        'TEXT': 'this is a text',
        'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
        'HOW_ABOUT_THIS': '{{value}} + {{value}}',
        'AND_THIS': '{{value + value}}'
      });

      $translateProvider.uses('en_EN');
    }));

    it('should return translation id if translation doesn\'t exist and language is given', function () {
      inject(function ($filter) {
        expect($filter('translate')('WOOP')).toEqual('WOOP');
      });
    });

    it('should return translation if translation id exist and language is given', function () {
      inject(function ($filter) {
        expect($filter('translate')('EXISTING_TRANSLATION_ID')).toEqual('foo');
      });
    });

    it('should replace interpolate directives with empty string if no values given and language is specified', function () {
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      });
    });

    it('should replace interpolate directives with given values and language is specified', function () {
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID', { value: 'foo'})).toEqual('Lorem Ipsum foo');
        expect($filter('translate')('TRANSLATION_ID_2', { value: 'foo'})).toEqual('Lorem Ipsum foo + foo');
        expect($filter('translate')('TRANSLATION_ID_3', { value: 'foo'})).toEqual('Lorem Ipsum foofoo');
        expect($filter('translate')('TRANSLATION_ID_3', { value: '3'})).toEqual('Lorem Ipsum 33');
        expect($filter('translate')('TRANSLATION_ID_3', { value: 3})).toEqual('Lorem Ipsum 6');
      });
    });

    it('should replace interpolate directives with given values as string expression and given language', function () {
      inject(function ($filter) {
        expect($filter('translate')('TEXT')).toEqual('this is a text');
        expect($filter('translate')('TEXT_WITH_VALUE')).toEqual('This is a text with given value: ');
        expect($filter('translate')('TEXT_WITH_VALUE', "{'value': 'dynamic value'}")).toEqual('This is a text with given value: dynamic value');
        expect($filter('translate')('TEXT_WITH_VALUE', "{'value': '3'}")).toEqual('This is a text with given value: 3');
        expect($filter('translate')('HOW_ABOUT_THIS', "{'value': '4'}")).toEqual('4 + 4');
        expect($filter('translate')('AND_THIS', "{'value': 5}")).toEqual('10');
        expect($filter('translate')('AND_THIS', "{'value': '5'}")).toEqual('55');
      });
    });
  });

  describe('$translateDirective (single-lang)', function () {

    var element;

    beforeEach(module('ngTranslate', function ($translateProvider) {
      $translateProvider.translations({
        'EXISTING_TRANSLATION_ID': 'foo',
        'ANOTHER_ONE': 'bar',
        'TRANSLATION_ID': 'foo',
        'TD_WITH_VALUE': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
        'YET_ANOTHER': 'Hallo da!',
        'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
        'HOW_ABOUT_THIS': '{{value}} + {{value}}',
        'AND_THIS': '{{value + value}}'
      });
    }));

    var $compile, $rootScope;

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should return translation id if translation doesn\'t exist', function () {
      inject(function ($rootScope, $compile) {
        element = $compile('<div translate="TEXT"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('TEXT');
      });
    });

    it('should return translation if translation id exist', function () {
      inject(function ($rootScope, $compile) {
        element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('foo');
      });
    });

    it('should return translation id if translation doesn\'t exist and if its passed as interpolation', function () {
      inject(function ($rootScope, $compile) {
        $rootScope.translationId = 'TEXT';
        element = $compile('<div translate="{{translationId}}"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('TEXT');
      });
    });

    it('should return translation if translation id exist and is passed as interpolation', function () {
      inject(function ($rootScope, $compile) {
        $rootScope.translationId = 'TRANSLATION_ID';
        element = $compile('<div translate="{{translationId}}"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('foo');
      });
    });

    describe('passing translation id as content', function () {

      it('should return translation id if translation doesn\'t exist', function () {
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate>TEXT</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TEXT');
        });
      });

      it('should return translation if translation id exist', function () {
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate>TRANSLATION_ID</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });

      it('should return translation id if translation doesn\'t exist and is passed as interpolation', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TEXT';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TEXT');
        });
      });

      it('should return translation if translation id exist and if its passed as interpolation', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });
    });

    describe('Passing values', function () {

      describe('whereas no values given', function () {

        it('should replace interpolation directive with empty string', function () {
          inject(function ($rootScope, $compile) {
            element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });

        it('should replace interpolation directive with empty string when translation is an interplation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TD_WITH_VALUE';
            element = $compile('<div translate="{{translationId}}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum ');
          });
        });

        it('should replace interpolation directive with empty string if translation id is in content', function () {
          inject(function ($rootScope, $compile) {
            element = $compile('<div translate>TD_WITH_VALUE</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum ');
          });
        });

        it('should replace interpolation directive with empty string if td id is in content and interpolation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TD_WITH_VALUE';
            element = $compile('<div translate>{{translationId}}</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum ');
          });
        });
      });

      describe('while values given as string', function () {

        it('should replace interpolate directive when td id is attribute value', function () {
          inject(function ($rootScope, $compile) {
            element = $compile('<div translate="TD_WITH_VALUE" values="{value: \'foo\'}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is attribute value and interpolation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TD_WITH_VALUE';
            element = $compile('<div translate="{{translationId}}" values="{value: \'foo\'}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is given as content', function () {
          inject(function ($rootScope, $compile) {
            element = $compile('<div translate values="{value: \'foo\'}">TRANSLATION_ID</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });

        it('should replace interpolate directive when td id is given as content and as interpolation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TRANSLATION_ID';
            element = $compile('<div translate values="{value: \'foo\'}">{{translationId}}</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });
      });

      describe('while values given as interpolation directive', function () {

        it('should replace interpolate directive when td id is attribute value', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.values = { value: 'foo' };
            element = $compile('<div translate="TD_WITH_VALUE" values="{{values}}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is attribute value and interpolation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TD_WITH_VALUE';
            $rootScope.values = { value: 'foo' };
            element = $compile('<div translate="{{translationId}}" values="{{values}}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is given as content', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.values = { value: 'foo' };
            element = $compile('<div translate values="{{values}}">TRANSLATION_ID</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });

        it('should replace interpolate directive when td id is given as content and as interpolation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TRANSLATION_ID';
            $rootScope.values = { values: 'foo' };
            element = $compile('<div translate values="{{values}}">{{translationId}}</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });
      });
    });
  });

  describe('$translateDirective (multi-lang)', function () {

    var element;

    beforeEach(module('ngTranslate', function ($translateProvider) {
      $translateProvider.translations('en_EN', {
        'EXISTING_TRANSLATION_ID': 'foo',
        'ANOTHER_ONE': 'bar',
        'TD_WITH_VALUE': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
        'YET_ANOTHER': 'Hallo da!',
        'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
        'HOW_ABOUT_THIS': '{{value}} + {{value}}',
        'AND_THIS': '{{value + value}}'
      });
      $translateProvider.uses('en_EN');
    }));

    var $compile, $rootScope;

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    describe('passing translation id as attribute value', function () {

      it('should return translation id if translation doesn\'t exist and language is specified', function () {
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TRANSLATION_ID');
        });
      });

      it('should return translation if translation id exists and language is specified', function () {
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate="EXISTING_TRANSLATION_ID"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });

      it('should return translation id if translation doesn\'t exist, language is specified, and translation id is passed as interpolation', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';
          element = $compile('<div translate="{{translationId}}"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TRANSLATION_ID');
        });
      });

      it('should return translation if translation id exist and is passed as interpolation and language is specified', function () {
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate="EXISTING_TRANSLATION_ID"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });
    });

    describe('passing translation id as content', function () {

      it('should return translation id if translation id doesn\'t exist and language is specified', function () {
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate>TRANSLATION_ID</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TRANSLATION_ID');
        });
      });

      it('should return translation if translation id exist if language is specified', function () {
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate>EXISTING_TRANSLATION_ID</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });

      it('should return translation id if translation doesn\'t exist and language is specified and id is passed as interpolation', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TRANSLATION_ID');
        });
      });

      it('should return translation if translation id exist, language is specified and id is passed as interpolation', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'EXISTING_TRANSLATION_ID';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
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

  describe('Asynchronous loading (directive)', function () {

    describe('register loader via function object', function () {

      beforeEach(module('ngTranslate', function ($translateProvider) {
        $translateProvider.registerLoader(function ($q, $timeout) {
          return function (key) {
            var data = (key === 'de_DE') ? {
              'KEY1': 'Schluessel 1',
              'KEY2': 'Schluessel 2'
            } : {
              'KEY1': 'Key 1',
              'KEY2': 'Key 2'
            };
            var deferred = $q.defer();
            $timeout(function () {
              deferred.resolve(data);
            }, 0);
            return deferred.promise;
          };
        });
        $translateProvider.uses('de_DE');
      }));

      it('should translate after data is loaded asynchronously', function () {
        inject(function ($rootScope, $compile, $translate, $timeout) {
          $rootScope.translationId = 'KEY1';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          $timeout.flush(); // finish loader
          expect(element.text()).toEqual('Schluessel 1');
        });
      });

      it('should translate after data is loaded asynchronously when lang key changed', function () {
        inject(function ($rootScope, $compile, $translate, $timeout) {
          $rootScope.translationId = 'KEY1';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          $timeout.flush();
          expect(element.text()).toEqual('Schluessel 1');

          $translate.uses('en_US');
          $timeout.flush();
          expect($translate.uses()).toEqual('en_US');
        });
      });
    });
  });
});
