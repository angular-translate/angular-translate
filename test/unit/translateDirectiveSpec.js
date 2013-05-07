describe('ngTranslate', function () {

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
