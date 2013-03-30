describe('ngTranslate', function () {

  var mock,
      callback;

  beforeEach(function () {
    callback = jasmine.createSpy('done');
  });

  beforeEach(module(function ($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));

  describe('$translateProvider', function () {

    it('should have a translation table', module(function ($translateProvider) {
      expect(angular.isDefined($translateProvider.$translationTable)).toBe(true);
      expect(angular.isObject($translateProvider.$translationTable)).toBe(true);
    }));

    it('should have a function translations', module(function ($translateProvider) {
      expect(typeof($translateProvider.translations) === 'Function').toBe(true);
    }));

    it('should be able to set a translation table', module(function ($translateProvider) {
      var expectation = {
        'FOO':'bar',
        'BAR':'foo'
      };

      $translateProvider.translations(expectation);
      expect($translateProvider.translationTable).toEqual(expectation);
    }));

    it('should able to read a translation table', module(function ($translateProvider) {
      var expectation = {
        'FOO':'bar',
        'BAR':'foo'
      };

      $translateProvider.translations(expectation);
      expect($translateProvider.translations()).toEqual(expectation);
    }));

    it('should use $interpolate as dependency for $translate', module(function ($injector, $translateProvider) {
      expect($injector.annotate($translateProvider.$get)).toEqual(['$interpolate']);
    }));

    it('should instantiate $translate service', module(function ($injector, $translateProvider) {
      var $providerFactoryFn = $translateProvider.$get;

      expect(typeof($injector.invoke($providerFactoryFn, $translateProvider)) === 'Function').toBe(true);
      expect($injector.invoke($providerFactoryFn, $translateProvider))
        .toEqual($injector.get('$translate'));
    }));
  });

  describe('$translate', function () {

    it('should return translation ID if translation doesn\'t exist', module(function ($injector, $translateProvider) {

      var $translate = $injector.get('$translate'),
          translationId = 'NOT_EXISTING_TRANSLATION_ID';

      expect(angular.isEmpty($translateProvider.translations())).toBe(true);
      expect($translate(translationId)).toEqual(translationId);
    }));

    it('should return translation for specific translation ID', module(function ($injector, $translateProvider) {
      $translateProvider.translations({
        'FOO': 'Hello world',
        'BAR': 'Text goes here'
      });

      var $translate = $injector.get('$translate');

      expect(!angular.isEmpty($translateProvider.translations())).toBe(true);
      expect($translate('FOO')).toEqual('Hello world');
      expect($translate('BAR')).toEqual('Text goes here');
    }));

    it('should replace string interpolations with given values', module(function ($injector, $translateProvider) {
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
    }));
  });

  describe('$translateFilter', function () {
    
    it('should ask for $parse and $translate service', module(function ($injector, $filter) {
      var annotation = $injector.annotate($filter('translate'));
      expect(annotation).toEqual(['$parse', '$translate']);
    }));

    it('should be a function object', module(function ($injector, $filter) {
      expect(typeof($injector.invoke($filter('translate'))) === 'Function').toBe(true);
    }));

    it('should return translation ID if translation doesn\'t exist', module(function ($translateProvider, $filter) {
      var $translateFilter = $filter('translate'),
          translationId = 'NOT_EXISTING_TRANSLATION_ID';

      expect(angular.isEmpty($translateProvider.translations())).toBe(true);
      expect($translateFilter([translationId])).toEqual(translationId);
    }));

    it('should return translation for specific translation ID', module(function ($translateProvider) {
      $translateProvider.translations({
        'FOO': 'Hello world',
        'BAR': 'Text goes here'
      });

      var $translateFilter = $filter('translate');

      expect(!angular.isEmpty($translateProvider.translations())).toBe(true);
      expect($translate('FOO')).toEqual('Hello world');
      expect($translate('BAR')).toEqual('Text goes here');
    }));

    it('should replace string interpolations with given values', module(function ($translateProvider, $filter) {
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
    }));
  });
});
