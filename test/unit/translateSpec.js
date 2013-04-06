describe('Module ngTranslate', function () {

  beforeEach(module('ngTranslate'));

  describe('$translate', function () {

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

    it('should return translation id if translation doesn\'t exist', function () {
      var translationId = 'NOT_EXISTING_TRANSLATION_ID';
      module(function ($translateProvider) {
        $translateProvider.translations();
      });
      inject(function ($translate) {
        expect($translate(translationId)).toEqual(translationId);
      });
    });

    it('should return translation if translation id if exists', function () {
      var translationId = "EXISTING_TRANSLATION_ID";
      module(function ($translateProvider) {
        $translateProvider.translations({
          'EXISTING_TRANSLATION_ID': 'foo'
        });
      });
      inject(function ($translate) {
        expect($translate(translationId)).toEqual('foo');
      });
    });

    it('should return translation id if language is given and translation id doesn\'t exist', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {});
        $translateProvider.uses('de_DE');
      });
      inject(function ($translate) {
        expect($translate('TRANSLATION_ID')).toEqual('TRANSLATION_ID');
      });
    });

    it('should return translation when language is given and translation id exist', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'EXISTING_TRANSLATION_ID': 'foo',
          'ANOTHER_ONE': 'bar'
        });
        $translateProvider.uses('de_DE');
      });
      inject(function ($translate) {
        expect($translate('EXISTING_TRANSLATION_ID')).toEqual('foo');
        expect($translate('ANOTHER_ONE')).toEqual('bar');
      });
    });

    it('should replace interpolate directives with empty string if no values given', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
        });
      });
      inject(function ($translate) {
        expect($translate('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      });
    });

    it('should replace interpolate directives with empty string if no values given and language is specified', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
        });
        $translateProvider.uses('de_DE');
      });
      inject(function ($translate) {
        expect($translate('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      });
    });

    it('should replace interpolate directives with given values', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
          'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
          'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
        });
      });
      inject(function ($translate) {
        expect($translate('TRANSLATION_ID', { value: 'foo'})).toEqual('Lorem Ipsum foo');
        expect($translate('TRANSLATION_ID_2', { value: 'foo'})).toEqual('Lorem Ipsum foo + foo');
        expect($translate('TRANSLATION_ID_3', { value: 'foo'})).toEqual('Lorem Ipsum foofoo');
        expect($translate('TRANSLATION_ID_3', { value: '3'})).toEqual('Lorem Ipsum 33');
        expect($translate('TRANSLATION_ID_3', { value: 3})).toEqual('Lorem Ipsum 6');
      });
    });

    it('should replace interpolate directives with given values when language is specified', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
          'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
          'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
        });
        $translateProvider.uses('de_DE');
      });
      inject(function ($translate) {
        expect($translate('TRANSLATION_ID', { value: 'foo'})).toEqual('Lorem Ipsum foo');
        expect($translate('TRANSLATION_ID_2', { value: 'foo'})).toEqual('Lorem Ipsum foo + foo');
        expect($translate('TRANSLATION_ID_3', { value: 'foo'})).toEqual('Lorem Ipsum foofoo');
        expect($translate('TRANSLATION_ID_3', { value: '3'})).toEqual('Lorem Ipsum 33');
        expect($translate('TRANSLATION_ID_3', { value: 3})).toEqual('Lorem Ipsum 6');
      });
    });

    it('should have a method uses()', function () {
      inject(function ($translate) {
        expect($translate.uses).toBeDefined();
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

      it('should return a string', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {
            'TRANSLATION_ID': 'Test'
          });
          $translateProvider.uses('de_DE');
        });
        inject(function ($translate) {
          expect(typeof $translate.uses()).toBe('string');
        });
      });

      it('should return language key', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {
            'TRANSLATION_ID': 'Test'
          });
          $translateProvider.uses('de_DE');
        });
        inject(function ($translate) {
          expect($translate.uses()).toEqual('de_DE');
        });
      });

      it('should change language at runtime', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('langA', {
            'TRANSLATION_ID': 'Hello there!'
          });
          $translateProvider.translations('langB', {
            'TRANSLATION_ID': 'Hallo da!'
          });
          $translateProvider.uses('langA');
        });
        inject(function ($translate) {
          expect($translate('TRANSLATION_ID')).toEqual('Hello there!');
          $translate.uses('langB');
          expect($translate('TRANSLATION_ID')).toEqual('Hallo da!');
        });
      });

      it('should change language and take effect in the UI', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('langA', {
            'TRANSLATION_ID': 'Hello there!'
          });
          $translateProvider.translations('langB', {
            'TRANSLATION_ID': 'Hallo da!'
          });
          $translateProvider.uses('langA');
        });
        inject(function ($rootScope, $compile, $translate) {
          element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          $translate.uses('langB');
          element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hallo da!');
        });
      });
    });
  });

  describe('$translateFilter', function () {

    it('should be a function object', function () {
      inject(function ($filter) {
        expect(typeof $filter('translate')).toBe("function");
      });
    });

    it('should return translation id if translation doesn\'t exist', function () {
      var translationId = 'NOT_EXISTING_TRANSLATION_ID';
      inject(function ($filter) {
        expect($filter('translate')(translationId)).toEqual(translationId);
      });
    });

    it('should return translation if translation id exist', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'TRANSLATION_ID': 'foo'
        });
      });
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID')).toEqual('foo');
      });
    });

    it('should return translation id if translation doesn\'t exist and language is given', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {});
        $translateProvider.uses('de_DE');
      });
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID')).toEqual('TRANSLATION_ID');
      });
    });

    it('should return translation if translation id exist and language is given', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'TRANSLATION_ID': 'foo'
        });
        $translateProvider.uses('de_DE');
      });
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID')).toEqual('foo');
      });
    });

    it('should replace interpolate directives with empty string if no values given', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
        });
      });
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      });
    });

    it('should replace interpolate directives with empty string if no values given and language is specified', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
        });
        $translateProvider.uses('de_DE');
      });
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      });
    });

    it('should replace interpolate directives with given values', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
          'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
          'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
        });
      });
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID', { value: 'foo'})).toEqual('Lorem Ipsum foo');
        expect($filter('translate')('TRANSLATION_ID_2', { value: 'foo'})).toEqual('Lorem Ipsum foo + foo');
        expect($filter('translate')('TRANSLATION_ID_3', { value: 'foo'})).toEqual('Lorem Ipsum foofoo');
        expect($filter('translate')('TRANSLATION_ID_3', { value: '3'})).toEqual('Lorem Ipsum 33');
        expect($filter('translate')('TRANSLATION_ID_3', { value: 3})).toEqual('Lorem Ipsum 6');
      });
    });

    it('should replace interpolate directives with given values and language is specified', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
          'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
          'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
        });
        $translateProvider.uses('de_DE');
      });
      inject(function ($filter) {
        expect($filter('translate')('TRANSLATION_ID', { value: 'foo'})).toEqual('Lorem Ipsum foo');
        expect($filter('translate')('TRANSLATION_ID_2', { value: 'foo'})).toEqual('Lorem Ipsum foo + foo');
        expect($filter('translate')('TRANSLATION_ID_3', { value: 'foo'})).toEqual('Lorem Ipsum foofoo');
        expect($filter('translate')('TRANSLATION_ID_3', { value: '3'})).toEqual('Lorem Ipsum 33');
        expect($filter('translate')('TRANSLATION_ID_3', { value: 3})).toEqual('Lorem Ipsum 6');
      });
    });

    it('should replace interpolate directives with given values as string expression', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'TEXT': 'this is a text',
          'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
          'HOW_ABOUT_THIS': '{{value}} + {{value}}',
          'AND_THIS': '{{value + value}}'
        });
      });
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

    it('should replace interpolate directives with given values as string expression and given language', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'TEXT': 'this is a text',
          'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
          'HOW_ABOUT_THIS': '{{value}} + {{value}}',
          'AND_THIS': '{{value + value}}'
        });
        $translateProvider.uses('de_DE');
      });
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

  describe('$translateDirective', function () {

    var element;

    describe('passing translation id as attribute value', function () {

      it('should return translation id if translation doesn\'t exist', function () {
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate="TEXT"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TEXT');
        });
      });

      it('should return translation if translation id exist', function () {
        module(function ($translateProvider) {
          $translateProvider.translations({
            'TRANSLATION_ID': 'foo'
          });
        });
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });

      it('should return translation id if translation doesn\'t exist and language is specified', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {});
        });
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TRANSLATION_ID');
        });
      });
 
      it('should return translation if translation id exists and language is specified', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {
            'TRANSLATION_ID': 'foo'
          });
          $translateProvider.uses('de_DE');
        });
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
        module(function ($translateProvider) {
          $translateProvider.translations({
            'TRANSLATION_ID': 'foo'
          });
        });
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';
          element = $compile('<div translate="{{translationId}}"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });

      it('should return translation id if translation doesn\'t exist, language is specified, and translation id is passed as interpolation', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {});
        });
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';
          element = $compile('<div translate="{{translationId}}"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TRANSLATION_ID');
        });
      });

      it('should return translation if translation id exist and is passed as interpolation and language is specified', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {
            'TRANSLATION_ID': 'foo'
          });
          $translateProvider.uses('de_DE');
        });
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
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
        module(function ($translateProvider) {
          $translateProvider.translations({
            'TRANSLATION_ID': 'foo'
          });
        });
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate>TRANSLATION_ID</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });

      it('should return translation id if translation id doesn\'t exist and language is specified', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {});
        });
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate>TRANSLATION_ID</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TRANSLATION_ID');
        });
      });

      it('should return translation if translation id exist if language is specified', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {
            'TRANSLATION_ID': 'foo'
          });
          $translateProvider.uses('de_DE');
        });
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate>TRANSLATION_ID</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });

      it('should return translation id if translation doesn\'t exist and is passed as interpolation', function () {
        module(function ($translateProvider) {
          $translateProvider.translations();
        });
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TEXT';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TEXT');
        });
      });

      it('should return translation if translation id exist and if its passed as interpolation', function () {
        module(function ($translateProvider) {
          $translateProvider.translations({
            'TRANSLATION_ID': 'foo'
          });
        });
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });

      it('should return translation id if translation doesn\'t exist and language is specified and id is passed as interpolation', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {});
          $translateProvider.uses('de_DE');
        });
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('TRANSLATION_ID');
        });
      });

      it('should return translation if translation id exist, language is specified and id is passed as interpolation', function () {
        module(function ($translateProvider) {
          $translateProvider.translations('de_DE', {
            'TRANSLATION_ID': 'foo'
          });
          $translateProvider.uses('de_DE');
        });
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';
          element = $compile('<div translate>{{translationId}}</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });
    });

    describe('passing values', function () {

      describe('while no values given', function () {

        it('should replace interpolation directive with empty string', function () {
          module(function($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
            });
          });
          inject(function ($rootScope, $compile) {
            element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum ');
          });
        });

        it('should replace interpolation directive with empty string when translation is an interplation', function () {
          module(function($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
            });
          });
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TRANSLATION_ID';
            element = $compile('<div translate="{{translationId}}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum ');
          });
        });

        it('should replace interpolation directive with empty string if translation id is in content', function () {
          module(function($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
            });
          });
          inject(function ($rootScope, $compile) {
            element = $compile('<div translate=>TRANSLATION_ID</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum ');
          });
        });

        it('should replace interpolation directive with empty string if td id is in content and interpolation', function () {
          module(function($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
            });
          });
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TRANSLATION_ID';
            element = $compile('<div translate>{{translationId}}</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum ');
          });
        });
      });

      describe('while values given as string', function () {

        it('should replace interpolate directive when td id is attribute value', function () {
          module(function ($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
            });
          });
          inject(function ($rootScope, $compile) {
            element = $compile('<div translate="TRANSLATION_ID" values="{value: \'foo\'}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is attribute value and interpolation', function () {
          module(function ($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
            });
          });
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TRANSLATION_ID';
            element = $compile('<div translate="{{translationId}}" values="{value: \'foo\'}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is given as content', function () {
          module(function ($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'foo'
            });
          });
          inject(function ($rootScope, $compile) {
            element = $compile('<div translate values="{value: \'foo\'}">TRANSLATION_ID</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });

        it('should replace interpolate directive when td id is given as content and as interpolation', function () {
          module(function ($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'foo'
            });
          });
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TRANSLATION_ID';
            element = $compile('<div translate values="{value: \'foo\'}">{{translationId}}</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });
      });

      describe('while values given as interpolation', function () {

        it('should replace interpolate directive when td id is attribute value', function () {
          module(function ($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
            });
          });
          inject(function ($rootScope, $compile) {
            $rootScope.values = { value: 'foo' };
            element = $compile('<div translate="TRANSLATION_ID" values="{{values}}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is attribute value and interpolation', function () {
          module(function ($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'Lorem Ipsum {{value}}'
            });
          });
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TRANSLATION_ID';
            $rootScope.values = { value: 'foo' };
            element = $compile('<div translate="{{translationId}}" values="{{values}}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is given as content', function () {
          module(function ($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'foo'
            });
          });
          inject(function ($rootScope, $compile) {
            $rootScope.values = { value: 'foo' };
            element = $compile('<div translate values="{{values}}">TRANSLATION_ID</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });

        it('should replace interpolate directive when td id is given as content and as interpolation', function () {
          module(function ($translateProvider) {
            $translateProvider.translations({
              'TRANSLATION_ID': 'foo'
            });
          });
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
});
