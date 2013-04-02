describe('Module ngTranslate', function () {

  beforeEach(module('ngTranslate'));

  describe('$translate', function () {

    it('should be a function object', function () {
      inject(function ($translate) {
        expect(typeof $translate).toBe("function");
      });
    });

    it('should return translation ID if translation doesn\'t exist', function () {
      var translationId = 'NOT_EXISTING_TRANSLATION_ID';

      inject(function ($translate) {
        expect($translate(translationId)).toEqual(translationId);
      });
    });

    it('should return translation for given translation ID if exists', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'EXISTING_TRANSLATION_ID': 'foo',
          'ANOTHER_ONE': 'bar'
        });
      });
      inject(function ($translate) {
        expect($translate('EXISTING_TRANSLATION_ID')).toEqual('foo');
        expect($translate('ANOTHER_ONE')).toEqual('bar');
      });
    });

    it('should to the same when a certain language is specified', function () {
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

    it('should replace string interpolations with given values', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'TEXT': 'this is a text',
          'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
          'HOW_ABOUT_THIS': '{{value}} + {{value}}',
          'AND_THIS': '{{value + value}}'
        });
      });
      inject(function ($translate) {
        expect($translate('TEXT')).toEqual('this is a text');
        expect($translate('TEXT_WITH_VALUE')).toEqual('This is a text with given value: ');
        expect($translate('TEXT_WITH_VALUE', {value: 'dynamic value'})).toEqual('This is a text with given value: dynamic value');
        expect($translate('TEXT_WITH_VALUE', {value: 3})).toEqual('This is a text with given value: 3');
        expect($translate('HOW_ABOUT_THIS', {value: 4})).toEqual('4 + 4');
        expect($translate('AND_THIS', {value: 5})).toEqual('10');
      });
    });

    it('should to the same when a specific language is provided', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'TEXT': 'this is a text',
          'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
          'HOW_ABOUT_THIS': '{{value}} + {{value}}',
          'AND_THIS': '{{value + value}}'
        });
        $translateProvider.uses('de_DE');
      });
      inject(function ($translate) {
        expect($translate('TEXT')).toEqual('this is a text');
        expect($translate('TEXT_WITH_VALUE')).toEqual('This is a text with given value: ');
        expect($translate('TEXT_WITH_VALUE', {value: 'dynamic value'})).toEqual('This is a text with given value: dynamic value');
        expect($translate('TEXT_WITH_VALUE', {value: 3})).toEqual('This is a text with given value: 3');
        expect($translate('HOW_ABOUT_THIS', {value: 4})).toEqual('4 + 4');
        expect($translate('AND_THIS', {value: 5})).toEqual('10');
      });
    });
  });

  describe('$translateFilter', function () {

    it('should be a function object', function () {
      inject(function ($filter) {
        expect(typeof $filter('translate')).toBe("function");
      });
    });

    it('should return translation ID if translation doesn\'t exist', function () {
      var translationId = 'NOT_EXISTING_TRANSLATION_ID';
      inject(function ($filter) {
        expect($filter('translate')(translationId)).toEqual(translationId);
      });
    });

    it('should return translation for specific translation ID', function () {
      module(function ($translateProvider) {
        $translateProvider.translations({
          'EXISTING_TRANSLATION_ID': 'foo',
          'ANOTHER_ONE': 'bar'
        });
      });
      inject(function ($filter) {
        expect($filter('translate')('EXISTING_TRANSLATION_ID')).toEqual('foo');
        expect($filter('translate')('ANOTHER_ONE')).toEqual('bar');
      });
    });

    it('should to the same when a certain language is specified', function () {
      module(function ($translateProvider) {
        $translateProvider.translations('de_DE', {
          'EXISTING_TRANSLATION_ID': 'foo',
          'ANOTHER_ONE': 'bar'
        });
        $translateProvider.uses('de_DE');
      });
      inject(function ($filter) {
        expect($filter('translate')('EXISTING_TRANSLATION_ID')).toEqual('foo');
        expect($filter('translate')('ANOTHER_ONE')).toEqual('bar');
      });
    });

    it('should replace string interpolations with given values', function () {
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
        expect($filter('translate')('TEXT_WITH_VALUE', {value: 'dynamic value'})).toEqual('This is a text with given value: dynamic value');
        expect($filter('translate')('TEXT_WITH_VALUE', {value: 3})).toEqual('This is a text with given value: 3');
        expect($filter('translate')('HOW_ABOUT_THIS', {value: 4})).toEqual('4 + 4');
        expect($filter('translate')('AND_THIS', {value: 5})).toEqual('10');
      });
    });

    it('should to the same when a specific language is provided', function () {
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
        expect($filter('translate')('TEXT_WITH_VALUE', {value: 'dynamic value'})).toEqual('This is a text with given value: dynamic value');
        expect($filter('translate')('TEXT_WITH_VALUE', {value: 3})).toEqual('This is a text with given value: 3');
        expect($filter('translate')('HOW_ABOUT_THIS', {value: 4})).toEqual('4 + 4');
        expect($filter('translate')('AND_THIS', {value: 5})).toEqual('10');
      });
    });

    it('should replace string interpolations with given values as string expression', function () {
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

    it('should to the same when a specific language is provided', function () {
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
});
