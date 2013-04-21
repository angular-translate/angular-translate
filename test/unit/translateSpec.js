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

    it('should have a method loaders()', function () {
      inject(function ($translate) {
        expect($translate.loaders).toBeDefined();
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

    describe('loaders()', function () {

      it('should be defined', function () {
        inject(function ($translate) {
          expect($translate.loaders).toBeDefined();
        });
      });

      it('should be a function', function () {
        inject(function ($translate) {
          expect(typeof $translate.loaders).toBe('function');
        });
      });

      it('should return an empty array if no loaders are registered', function () {
        inject(function ($translate) {
          expect(angular.isArray($translate.loaders())).toBe(true);
          expect($translate.loaders()).toEqual([]);
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

    describe('register loader as url string without key', function () {

      beforeEach(module('ngTranslate'));

      it('should return an object', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('foo/bar.json');
        });
        inject(function ($translate) {
          expect(typeof $translate.loaders()).toBe('object');
        });
      });

      it('should should have a length of 1', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('foo/bar.json');
        });
        inject(function ($translate) {
          expect($translate.loaders().length).toBe(1);
        });
      });

      it('should have a asyncLoader object with a loadAsync() method', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('foo/bar.json');
        });
        inject(function ($translate) {
          expect($translate.loaders()[0].loadAsync).toBeDefined();
        });
      });

      it('shouldn\'t have a property "langKey"', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('foo/bar.json');
        });
        inject(function ($translate) {
          expect($translate.loaders()[0].langKey).toBeUndefined();
        });
      });

      describe('loadAsyncFn()', function () {

        it('should be an array', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader('foo/bar.json');
          });
          inject(function ($translate) {
            expect(angular.isArray($translate.loaders()[0].loadAsync)).toBe(true);
          });
        });

        it('should have a $http service dependecy', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader('foo/bar.json');
          });
          inject(function ($translate) {
            expect($translate.loaders()[0].loadAsync[0]).toBe('$http');
          });
        });
      });
    });

    describe('register loader as url string with key', function () {

      beforeEach(module('ngTranslate'));

      it('should return an object', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', 'foo/bar.json');
        });
        inject(function ($translate) {
          expect(typeof $translate.loaders()).toBe('object');
        });
      });

      it('should should have a length of 1', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', 'foo/bar.json');
        });
        inject(function ($translate) {
          expect($translate.loaders().length).toBe(1);
        });
      });

      it('should have a asyncLoader object with a loadAsync() method', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', 'foo/bar.json');
        });
        inject(function ($translate) {
          expect($translate.loaders()[0].loadAsync).toBeDefined();
        });
      });

      it('should have a property "langKey"', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', 'foo/bar.json');
        });
        inject(function ($translate) {
          expect($translate.loaders()[0].langKey).toBeDefined();
          expect($translate.loaders()[0].langKey).toBe('en_EN');
        });
      });

      describe('loadAsyncFn()', function () {

        it('should be an array', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader('en_EN', 'foo/bar.json');
          });
          inject(function ($translate) {
            expect(angular.isArray($translate.loaders()[0].loadAsync)).toBe(true);
          });
        });

        it('should have a $http service dependecy', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader('en_EN', 'foo/bar.json');
          });
          inject(function ($translate) {
            expect($translate.loaders()[0].loadAsync[0]).toBe('$http');
          });
        });
      });
    });

    describe('register loader as function without key', function () {

      beforeEach(module('ngTranslate'));

      it('should return an array', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader(function ($http) {
            return $http.get('someUrl');
          });
        });
        inject(function($translate) {
          expect(angular.isArray($translate.loaders())).toBe(true);
        });
      });

      it('should have a length of 1', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader(function ($http) {
            return $http.get('someUrl');
          });
        });
        inject(function($translate) {
          expect($translate.loaders().length).toBe(1);
        });
      });

      it('shouldn\'t have a property "langKey"', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader(function ($http) {
            return $http.get('someUrl');
          });
        });
        inject(function ($translate) {
          expect($translate.loaders()[0].langKey).toBeUndefined();
        });
      });

      it('should have an asyncLoader object with a loadAsync method', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader(function ($http) {
            return $http.get('someUrl');
          });
        });
        inject(function($translate) {
          expect($translate.loaders()[0].loadAsync).toBeDefined();
        });
      });

      describe('loadAsync()', function () {

        it('should be a function', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader(function ($http) {
              return $http.get('someUrl');
            });
          });
          inject(function($translate) {
            expect(typeof $translate.loaders()[0].loadAsync).toBe('function');
          });
        });

      });
    });

    describe('register loader as function with key', function () {

      beforeEach(module('ngTranslate'));

      it('should return an array', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', function ($http) {
            return $http.get('someUrl');
          });
        });
        inject(function($translate) {
          expect(angular.isArray($translate.loaders())).toBe(true);
        });
      });

      it('should have a length of 1', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', function ($http) {
            return $http.get('someUrl');
          });
        });
        inject(function($translate) {
          expect($translate.loaders().length).toBe(1);
        });
      });

      it('should have a property "langKey"', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', function ($http) {
            return $http.get('someUrl');
          });
        });
        inject(function ($translate) {
          expect($translate.loaders()[0].langKey).toBeDefined();
          expect($translate.loaders()[0].langKey).toBe('en_EN');
        });
      });

      it('should have an asyncLoader object with a loadAsync method', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', function ($http) {
            return $http.get('someUrl');
          });
        });
        inject(function($translate) {
          expect($translate.loaders()[0].loadAsync).toBeDefined();
        });
      });

      describe('loadAsync()', function () {

        it('should be a function', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader('en_EN', function ($http) {
              return $http.get('someUrl');
            });
          });
          inject(function($translate) {
            expect(typeof $translate.loaders()[0].loadAsync).toBe('function');
          });
        });

      });
    });

    describe('register loader as function with dependencies without key', function () {

      beforeEach(module('ngTranslate'));

      it('should return an array', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader(['$http', function ($http) {
            return $http.get('someUrl');
          }]);
        });
        inject(function($translate) {
          expect(angular.isArray($translate.loaders())).toBe(true);
        });
      });

      it('should have a length of 1', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader(['$http', function ($http) {
            return $http.get('someUrl');
          }]);
        });
        inject(function($translate) {
          expect($translate.loaders().length).toBe(1);
        });
      });

      it('shouldn\'t have a property "langKey"', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader(['$http', function ($http) {
            return $http.get('someUrl');
          }]);
        });
        inject(function ($translate) {
          expect($translate.loaders()[0].langKey).toBeUndefined();
        });
      });

      it('should have an asyncLoader object with a loadAsync method', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader(['$http', function ($http) {
            return $http.get('someUrl');
          }]);
        });
        inject(function($translate) {
          expect($translate.loaders()[0].loadAsync).toBeDefined();
        });
      });

      describe('loadAsyncFn()', function () {

        it('should be an array', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader(['$http', function ($http) {
              return $http.get('someUrl');
            }]);
          });
          inject(function ($translate) {
            expect(angular.isArray($translate.loaders()[0].loadAsync)).toBe(true);
          });
        });

        it('should have a $http service dependecy', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader(['$http', function ($http) {
              return $http.get('someUrl');
            }]);
          });
          inject(function ($translate) {
            expect($translate.loaders()[0].loadAsync[0]).toBe('$http');
          });
        });

      });
    });

    describe('register loader as function with dependencies with key', function () {

      beforeEach(module('ngTranslate'));

      it('should return an array', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', ['$http', function ($http) {
            return $http.get('someUrl');
          }]);
        });
        inject(function($translate) {
          expect(angular.isArray($translate.loaders())).toBe(true);
        });
      });

      it('should have a length of 1', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', ['$http', function ($http) {
            return $http.get('someUrl');
          }]);
        });
        inject(function($translate) {
          expect($translate.loaders().length).toBe(1);
        });
      });

      it('should have a property "langKey"', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', ['$http', function ($http) {
            return $http.get('someUrl');
          }]);
        });
        inject(function ($translate) {
          expect($translate.loaders()[0].langKey).toBeDefined();
          expect($translate.loaders()[0].langKey).toBe('en_EN');
        });
      });

      it('should have an asyncLoader object with a loadAsync method', function () {
        module(function ($translateProvider) {
          $translateProvider.registerLoader('en_EN', ['$http', function ($http) {
            return $http.get('someUrl');
          }]);
        });
        inject(function($translate) {
          expect($translate.loaders()[0].loadAsync).toBeDefined();
        });
      });

      describe('loadAsyncFn()', function () {

        it('should be an array', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader('en_EN', ['$http', function ($http) {
              return $http.get('someUrl');
            }]);
          });
          inject(function ($translate) {
            expect(angular.isArray($translate.loaders()[0].loadAsync)).toBe(true);
          });
        });

        it('should have a $http service dependecy', function () {
          module(function ($translateProvider) {
            $translateProvider.registerLoader('en_EN', ['$http', function ($http) {
              return $http.get('someUrl');
            }]);
          });
          inject(function ($translate) {
            expect($translate.loaders()[0].loadAsync[0]).toBe('$http');
          });
        });

      });
    });
  });
});
