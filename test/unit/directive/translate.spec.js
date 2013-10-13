describe('pascalprecht.translate', function () {

  describe('$translateDirective (single-lang)', function () {

    var element;

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
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
        'AND_THIS': '{{value + value}}',
        'BLANK_VALUE': ''
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

        element = $compile('<div translate="BLANK_VALUE"></div>')($rootScope);
        $rootScope.$digest();
        expect(element.text()).toBe('');
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

          element = $compile('<div translate>BLANK_VALUE</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('');
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

      it('should return translation if translation id exists and if its passed surrounded by white space', function () {
        inject(function ($rootScope, $compile) {
          element = $compile('<div translate>  TRANSLATION_ID  </div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');
        });
      });

      it('should return translation when used as an element', function () {
        inject(function ($rootScope, $compile) {
          element =
            $compile('<translate>TRANSLATION_ID</translate>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('foo');

          element = $compile('<translate>BLANK_VALUE</translate>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('');
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
            element = $compile('<div translate="TD_WITH_VALUE" translate-values="{value: \'foo\'}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is attribute value and interpolation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TD_WITH_VALUE';
            element = $compile('<div translate="{{translationId}}" translate-values="{value: \'foo\'}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is given as content', function () {
          inject(function ($rootScope, $compile) {
            element = $compile('<div translate translate-values="{value: \'foo\'}">TRANSLATION_ID</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });

        it('should replace interpolate directive when td id is given as content and as interpolation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TRANSLATION_ID';
            element = $compile('<div translate translate-values="{value: \'foo\'}">{{translationId}}</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });
      });

      describe('while values given as interpolation directive', function () {

        it('should replace interpolate directive when td id is attribute value', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.values = { value: 'foo' };
            element = $compile('<div translate="TD_WITH_VALUE" translate-values="{{values}}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is attribute value and interpolation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TD_WITH_VALUE';
            $rootScope.values = { value: 'foo' };
            element = $compile('<div translate="{{translationId}}" translate-values="{{values}}"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('Lorem Ipsum foo');
          });
        });

        it('should replace interpolate directive when td id is given as content', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.values = { value: 'foo' };
            element = $compile('<div translate translate-values="{{values}}">TRANSLATION_ID</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });

        it('should replace interpolate directive when td id is given as content and as interpolation', function () {
          inject(function ($rootScope, $compile) {
            $rootScope.translationId = 'TRANSLATION_ID';
            $rootScope.values = { values: 'foo' };
            element = $compile('<div translate translate-values="{{values}}">{{translationId}}</div>')($rootScope);
            $rootScope.$digest();
            expect(element.text()).toBe('foo');
          });
        });
      });
    });
  });

  describe('$translateDirective (multi-lang)', function () {

    var element;

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider.translations('en_EN', {
        'EXISTING_TRANSLATION_ID': 'foo',
        'ANOTHER_ONE': 'bar',
        'TD_WITH_VALUE': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
        'YET_ANOTHER': 'Hallo da!',
        'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
        'HOW_ABOUT_THIS': '{{value}} + {{value}}',
        'AND_THIS': '{{value + value}}',
        'BLANK_VALUE': ''
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

          element = $compile('<div translate="BLANK_VALUE"></div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('');
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

          element = $compile('<div translate>BLANK_VALUE</div>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('');
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

  describe('translate-interpolation attribute', function () {

    var $rootScope, $compile;

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
          return 'custom interpolation';
        };

        return translateInterpolator;
      });

      $translateProvider.translations('en', {
        'FOO': 'Yesssss'
      });

      $translateProvider.addInterpolation('customInterpolation');
      $translateProvider.preferredLanguage('en');
    }));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    }));

    it('should consider translate-interpolation value', function () {
      // we can use normal interpolation
      element = $compile('<p translate="FOO"></p>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toEqual('Yesssss');

      // and we can override it
      element = $compile('<p translate="FOO" translate-interpolation="custom"></p>')($rootScope);
      $rootScope.$digest();
      expect(element.text()).toEqual('custom interpolation');
    });
  });

  describe('translate-compiling extension', function () {

    var $rootScope, $compile;

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      $translateProvider.translations('en', {
        'text': '<span>{{name}} is a citizen of <strong ng-bind="world"></strong>!</span>'
      });

      $translateProvider.preferredLanguage('en');
    }));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $rootScope.world = 'Gallifrey';
    }));

    it('should be disabled at default', function () {
      element = $compile('<p translate="text" translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
      $rootScope.$digest();
      // Verify we have not any rich html content (actually, a bad result)
      expect(element.text()).toEqual('The Doctor is a citizen of !');
      expect(element.html()).toEqual('The Doctor is a citizen of !');
    });

    it('should be enabled using "translate-compile"-attribute', function () {
      element = $compile('<p translate="text" translate-compile translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
      $rootScope.$digest();
      // Verify we have rich html content now
      expect(element.text()).toEqual('The Doctor is a citizen of Gallifrey!');
      expect(element.html()).toEqual('<span class="ng-scope">The Doctor is a citizen of <strong ng-bind="world" class="ng-binding">Gallifrey</strong>!</span>');
    });

    it('should consider even live binding in compiled value', function () {
      element = $compile('<p translate="text" translate-compile translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
      $rootScope.$digest();
      $rootScope.world = 'Earth';
      $rootScope.$digest();
      // Verify that the new value of "world" is used.
      expect(element.text()).toEqual('The Doctor is a citizen of Earth!');
      expect(element.html()).toEqual('<span class="ng-scope">The Doctor is a citizen of <strong ng-bind="world" class="ng-binding">Earth</strong>!</span>');
    });
  });
});
