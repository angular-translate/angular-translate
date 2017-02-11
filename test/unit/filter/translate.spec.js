/* jshint camelcase: false, quotmark: false, unused: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  describe('$translateFilter', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('en', {
          'EXISTING_TRANSLATION_ID' : 'foo',
          'ANOTHER_ONE' : 'bar',
          'TRANSLATION_ID' : 'Lorem Ipsum {{value}}',
          'TRANSLATION_ID_2' : 'Lorem Ipsum {{value}} + {{value}}',
          'TRANSLATION_ID_3' : 'Lorem Ipsum {{value + value}}',
          'YET_ANOTHER' : 'Hallo da!',
          'TEXT' : 'this is a text',
          'TEXT_WITH_VALUE' : 'This is a text with given value: {{value}}',
          'HOW_ABOUT_THIS' : '{{value}} + {{value}}',
          'AND_THIS' : '{{value + value}}',
          'BLANK_VALUE' : ''
        })
        .preferredLanguage('en');
    }));

    var $filter, $q, $rootScope, $translate, $compile;

    beforeEach(inject(function (_$filter_, _$q_, _$rootScope_, _$compile_) {
      $filter = _$filter_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $translate = $filter('translate');
      $compile = _$compile_;

      $rootScope.foo = 'bar';
    }));

    it('should be a function object', function () {
      expect(typeof $translate).toBe("function");
    });

    it('should return with translation id if translation doesn\'t exist', function () {
      expect($translate('WOOP')).toEqual('WOOP');
    });
    it('should return with translation id if translation doesn\'t exist', function () {
      expect($translate(null)).toEqual(null);
    });
    it('should return translation if translation id exist', function () {
      expect($translate('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
    });

    it('should replace interpolate directives with empty string if no values given', function () {
      expect($translate('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
    });

    it('should replace interpolate directives with given values', function () {
      var value = [
        $translate('TRANSLATION_ID', {value : 'foo'}),
        $translate('TRANSLATION_ID_2', {value : 'foo'}),
        $translate('TRANSLATION_ID_3', {value : 'foo'}),
        $translate('TRANSLATION_ID_3', {value : '3'}),
        $translate('TRANSLATION_ID_3', {value : 3})
      ];

      expect(value[0]).toEqual('Lorem Ipsum foo');
      expect(value[1]).toEqual('Lorem Ipsum foo + foo');
      expect(value[2]).toEqual('Lorem Ipsum foofoo');
      expect(value[3]).toEqual('Lorem Ipsum 33');
      expect(value[4]).toEqual('Lorem Ipsum 6');
    });

    it('should replace interpolate directives with given values as string expression', function () {
      var value = [
        $translate('TEXT'),
        $translate('TEXT_WITH_VALUE'),
        $translate('TEXT_WITH_VALUE', "{'value': 'dynamic value'}"),
        $translate('TEXT_WITH_VALUE', "{'value': '3'}"),
        $translate('HOW_ABOUT_THIS', "{'value': '4'}"),
        $translate('AND_THIS', "{'value': 5}"),
        $translate('AND_THIS', "{'value': '5'}")
      ];

      expect(value[0]).toEqual('this is a text');
      expect(value[1]).toEqual('This is a text with given value: ');
      expect(value[2]).toEqual('This is a text with given value: dynamic value');
      expect(value[3]).toEqual('This is a text with given value: 3');
      expect(value[4]).toEqual('4 + 4');
      expect(value[5]).toEqual('10');
      expect(value[6]).toEqual('55');
    });

    it('should not throw errors when translation id is not a string', function () {
      var value = [
        $translate(4.5),
        $translate(4),
        $translate([]),
        $translate({}),
        $translate(true),
        $translate(null),
        $translate(undefined)
      ];

      expect(value[0]).toEqual('4.5');
      expect(value[1]).toEqual('4');
      /* I don't care what these values are, as long as $translate doesn't throw an error.
       expect(value[2]).toEqual({});
       expect(value[3]).toEqual('[object Object]');
       expect(value[4]).toEqual('true');
       expect(value[5]).toEqual(null);
       expect(value[6]).toEqual(undefined);
       */
    });

    if (angular.version.major === 1 && angular.version.minor <= 2) {
      // Until and including AJS 1.2, a filter was bound to a context (current scope). This was removed in AJS 1.3
      it('should replace interpolate directive on element with given values', function () {
        var element = $compile(angular.element('<div>{{"TRANSLATION_ID" | translate: "{value: foo}"}}</div>'))($rootScope);
        $rootScope.$digest();
        expect(element.html()).toEqual('Lorem Ipsum bar');
      });
    } else {
      it('should replace interpolate directive on element with given values', function () {
        $rootScope.__this = {value : 'bar'};
        var element = $compile(angular.element('<div>{{"TRANSLATION_ID" | translate: __this}}</div>'))($rootScope);
        $rootScope.$digest();
        expect(element.html()).toEqual('Lorem Ipsum bar');
        $rootScope.__this = undefined;
      });
    }
  });

  describe('additional interpolation', function () {

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
        'FOO' : 'Yesssss'
      });

      $translateProvider
        .addInterpolation('customInterpolation')
        .preferredLanguage('en');
    }));

    var $translate, $filter, $rootScope, $q;
    beforeEach(inject(function (_$filter_, _$rootScope_, _$q_) {
      $filter = _$filter_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $translate = $filter('translate');
    }));

    it('should consider translate-interpolation value', inject(function () {
      expect($translate('FOO', {}, 'custom')).toEqual('custom interpolation');
    }));
  });
  describe('shall add the prefix and suffix elements', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {

      $translateProvider.translations('en', {
        'FOO' : 'Have foo'
      });

      $translateProvider
        .preferredLanguage('en')
        .translationNotFoundIndicator('-+-+');
    }));

    var $translate, $filter, $rootScope, $q;
    beforeEach(inject(function (_$filter_, _$rootScope_, _$q_) {
      $filter = _$filter_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $translate = $filter('translate');
    }));

    it('should contain the not found indicators', inject(function () {
      expect($translate('FOO')).toEqual('Have foo');
      expect($translate('FOO2')).toEqual('-+-+ FOO2 -+-+');
    }));
  });

  describe('filter should be stateful', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('en', {
          'HELLO' : 'Hello'
        })
        .translations('de', {
          'HELLO' : 'Hallo'
        })
        .preferredLanguage('en');
    }));

    var $translate, $rootScope, $compile, $timeout;
    beforeEach(inject(function (_$rootScope_, _$compile_, _$translate_, _$timeout_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $translate = _$translate_;
      $timeout = _$timeout_;
    }));

    it('filter should be re-evaluated on language change', function (done) {
      var element = $compile(angular.element('<div>{{"HELLO" | translate}}</div>'))($rootScope);
      $rootScope.$digest();
      expect(element.html()).toEqual('Hello');
      $translate.use('de');
      setTimeout(function () {
        $rootScope.$digest();
        expect(element.html()).toEqual('Hallo');
        done();
      }, 100);
    });
  });

  describe('filter can be optionally stateless', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('en', {
          'HELLO' : 'Hello'
        })
        .translations('de', {
          'HELLO' : 'Hallo'
        })
        .preferredLanguage('en')
        .statefulFilter(false);
    }));

    var $translate, $rootScope, $compile, $timeout;
    beforeEach(inject(function (_$rootScope_, _$compile_, _$translate_, _$timeout_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $translate = _$translate_;
      $timeout = _$timeout_;
    }));

    if (angular.version.major === 1 && angular.version.minor >= 3) {
      it('filter should be not re-evaluated on language change', function (done) {
        var element = $compile(angular.element('<div>{{"HELLO" | translate}}</div>'))($rootScope);
        $rootScope.$digest();
        expect(element.html()).toEqual('Hello');
        $translate.use('de');
        setTimeout(function () {
          $rootScope.$digest();
          expect(element.html()).toEqual('Hello'); // regardless the language change (scope)
          done();
        }, 100);
      });
    } else {
      it('filter should be re-evaluated on language change', function (done) {
        var element = $compile(angular.element('<div>{{"HELLO" | translate}}</div>'))($rootScope);
        $rootScope.$digest();
        expect(element.html()).toEqual('Hello');
        $translate.use('de');
        setTimeout(function () {
          $rootScope.$digest();
          expect(element.html()).toEqual('Hallo');
          done();
        }, 100);
      });
    }
  });

  describe('filter can receive a forced language', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('en', {
          'HELLO' : 'Hello'
        })
        .translations('de', {
          'HELLO' : 'Hallo'
        })
        .preferredLanguage('en');
    }));

    var $translate, $rootScope, $compile;
    beforeEach(inject(function (_$rootScope_, _$compile_, _$translate_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $translate = _$translate_;
    }));

    it('should use preferred without override', function () {
      var element = $compile('<div>{{"HELLO" | translate}}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('Hello');
    });

    it('should use forced with override', function () {
      var element = $compile('<div>{{"HELLO" | translate:null:null:"de"}}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('Hallo');
    });
  });

  describe('filter handling a falsy value', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('en', {
          'HELLO' : 'Hello'
        })
        .translations('de', {
          'HELLO' : 'Hallo'
        })
        .preferredLanguage('en');
    }));

    var $translate, $rootScope, $compile;
    beforeEach(inject(function (_$rootScope_, _$compile_, _$translate_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $translate = _$translate_;
    }));

    it('should work with "0"', function () {
      var element = $compile('<div>{{0 | translate}}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('0');
    });

    it('should work with "false"', function () {
      var element = $compile('<div>{{false | translate}}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('');
    });

    it('should work with "null"', function () {
      var element = $compile('<div>{{null | translate}}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('');
    });

    it('should work with "0" (by scope)', function () {
      $rootScope.x = 0;
      var element = $compile('<div>{{x | translate}}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('0');
    });

    it('should work with "false" (by scope)', function () {
      $rootScope.x = false;
      var element = $compile('<div>{{x | translate}}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('');
    });

    it('should work with "null" (by scope)', function () {
      $rootScope.x = null;
      var element = $compile('<div>{{x | translate}}</div>')($rootScope);
      $rootScope.$digest();
      expect(element.html()).toBe('');
    });
  });
});
