describe('Module ngTranslate', function () {

  describe('$translateProvider', function () {

    it('should be a function object', function () {
      module(function ($translateProvider) {
        expect($translateProvider).toBe(jasmine.any(Function));
      });
    });

    describe('$translateProvider::translation()', function () {

      it('should have a "translations" function', function () {
        module(function($translateProvider) {
          expect($translateProvider.translations).toBeDefined();
        });
      });

      it('should really be a function', function () {
        module(function ($translateProvider) {
          expect($translateProvider.translations).toBe(jasmine.any(Function));
        });
      });

      it('should be able to set a translation table', function () {
        module(function ($translateProvider) {
          var expectation = {
            'FOO':'bar',
            'BAR':'foo'
          };
          $translateProvider.translations(expectation);
          expect($translateProvider.translations()).toEqual(expectation);
        });
      });

      it('should able to read a translation table', function () {
        module(function ($translateProvider) {
          var expectation = {
            'FOO':'bar',
            'BAR':'foo'
          };
          $translateProvider.translations(expectation);
          expect($translateProvider.translations()).toEqual(expectation);
        });
      });

    });

    describe('$translateProvider::$get()', function () {

      it('should use $interpolate as dependency for $translate', function () {
        module(function ($injector, $translateProvider) {
          expect($injector.annotate($translateProvider.$get)).toEqual(['$interpolate']);
        });
      });

      it('should instantiate $translate service', function () {
        module(function ($injector, $translateProvider) {
          var $providerFactoryFn = $translateProvider.$get;

          expect(typeof($injector.invoke($providerFactoryFn, $translateProvider)))
          .toBe(jasmine.any(Function));
          expect($injector.invoke($providerFactoryFn, $translateProvider))
            .toBe($injector.get('$translate'));
        });
      });
    });
  });

  describe('$translate', function () {

    it('should be a function object', function () {
      module(function($injector) {
        expect($injector.get('$translate')).toBe(jasmine.any(Function));
      });
    });

    it('should return translation ID if translation doesn\'t exist', function () {
      module(function ($injector, $translateProvider) {
        var $translate = $injector.get('$translate'),
            translationId = 'NOT_EXISTING_TRANSLATION_ID';

        expect(angular.isEmpty($translateProvider.translations())).toBe(true);
        expect($translate(translationId)).toEqual(translationId);
      });
    });

    it('should return translation for specific translation ID', function () {
      module(function ($injector, $translateProvider) {
        $translateProvider.translations({
          'FOO': 'Hello world',
          'BAR': 'Text goes here'
        });

        var $translate = $injector.get('$translate');

        expect(!angular.isEmpty($translateProvider.translations())).toBe(true);
        expect($translate('FOO')).toEqual('Hello world');
        expect($translate('BAR')).toEqual('Text goes here');
      });
    });

    it('should replace string interpolations with given values', function () {

      module(function ($injector, $translateProvider) {
        var translations = {
          'TEXT': 'This is a text',
          'TEXT_WITH_DYNAMIC_VALUE': 'This is a text with a dynamic value: {{value}}'
        };

        $translateProvider.translations(translations);

        var $translate = $injector.get('$translate');

        expect(!angular.isEmpty($translateProvider.translations())).toBe(true);
        expect($translateProvider.translations()).toEqual(translations);
        expect($translate('TEXT')).toEqual('This is a text');
        expect($translate('TEXT_WITH_DYNAMIC_VALUE')).toEqual('This is a text with a dynamic value: ');
        expect($translate('TEXT_WITH_DYNAMIC_VALUE', {
          value: 'foo'
        })).toEqual('This is a text with a dynamic value: foo');
        expect($translate('TEXT_WITH_DYNAMIC_VALUE', {
          value: 3
        })).toEqual('This is a text with a dynamic value: 3');
      });
    });
  });

  describe('$translateFilter', function () {

    it('should ask for $parse and $translate service', function () {
      module(function ($injector, $filter) {
        var annotation = $injector.annotate($filter('translate'));
        expect(annotation).toEqual(['$parse', '$translate']);
      });
    });

    it('should be a function object', function () {
      module(function ($injector, $filter) {
        expect($injector.invoke($filter('translate'))).toBe(jasmine.any(Function));
      });
    });

    it('should return translation ID if translation doesn\'t exist', function () {
      module(function ($translateProvider, $filter) {
        var $translateFilter = $filter('translate'),
            translationId = 'NOT_EXISTING_TRANSLATION_ID';

        expect(angular.isEmpty($translateProvider.translations())).toBe(true);
        expect($translateFilter([translationId])).toEqual(translationId);
      });
    });

    it('should return translation for specific translation ID', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'FOO': 'Hello world',
          'BAR': 'Text goes here'
        });

        var $translateFilter = $filter('translate');

        expect(!angular.isEmpty($translateProvider.translations())).toBe(true);
        expect($translate('FOO')).toEqual('Hello world');
        expect($translate('BAR')).toEqual('Text goes here');
      });
    });

    it('should replace string interpolations with given values', function () {
      module(function ($translateProvider, $filter) {
        var translations = {
          'TEXT': 'This is a text',
          'TEXT_WITH_DYNAMIC_VALUE': 'This is a text with a dynamic value: {{value}}'
        };

        $translateProvider.translations(translations);

        var $translateFilter = $filter('translate');

        expect(!angular.isEmpty($translateProvider.translations())).toBe(true);
        expect($translateProvider.translations()).toEqual(translations);
        expect($translateFilter(['TEXT'])).toEqual('This is a text');
        expect($translateFilter(['TEXT_WITH_DYNAMIC_VALUE'])).toEqual('This is a text with a dynamic value: ');
        expect($translateFilter(['TEXT_WITH_DYNAMIC_VALUE'], {
          value: 'foo'
        })).toEqual('This is a text with a dynamic value: foo');
        expect($translateFilter(['TEXT_WITH_DYNAMIC_VALUE'], {
          value: 3
        })).toEqual('This is a text with a dynamic value: 3');
      });
    });
  });
});
