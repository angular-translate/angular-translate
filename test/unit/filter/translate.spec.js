describe('pascalprecht.translate', function () {

  describe('$translateFilter', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
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
        'AND_THIS': '{{value + value}}',
        'BLANK_VALUE': ''
      });
    }));

    var $filter;

    beforeEach(inject(function (_$filter_) {
      $filter = _$filter_;
    }));

    it('should be a function object', function () {
      expect(typeof $filter('translate')).toBe("function");
    });

    it('should return translation id if translation doesn\'t exist', function () {
      expect($filter('translate')('WOOP')).toEqual('WOOP');
    });

    it('should return translation if translation id exist', function () {
      expect($filter('translate')('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
      expect($filter('translate')('BLANK_VALUE')).toEqual('');
    });

    it('should replace interpolate directives with empty string if no values given', function () {
      expect($filter('translate')('TRANSLATION_ID')).toEqual('Lorem Ipsum ');
    });

    it('should replace interpolate directives with given values', function () {
      expect($filter('translate')('TRANSLATION_ID', { value: 'foo'})).toEqual('Lorem Ipsum foo');
      expect($filter('translate')('TRANSLATION_ID_2', { value: 'foo'})).toEqual('Lorem Ipsum foo + foo');
      expect($filter('translate')('TRANSLATION_ID_3', { value: 'foo'})).toEqual('Lorem Ipsum foofoo');
      expect($filter('translate')('TRANSLATION_ID_3', { value: '3'})).toEqual('Lorem Ipsum 33');
      expect($filter('translate')('TRANSLATION_ID_3', { value: 3})).toEqual('Lorem Ipsum 6');
    });

    it('should replace interpolate directives with given values as string expression', function () {
      expect($filter('translate')('TEXT')).toEqual('this is a text');
      expect($filter('translate')('TEXT_WITH_VALUE')).toEqual('This is a text with given value: ');
      expect($filter('translate')('TEXT_WITH_VALUE', "{'value': 'dynamic value'}")).toEqual('This is a text with given value: dynamic value');
      expect($filter('translate')('TEXT_WITH_VALUE', "{'value': '3'}")).toEqual('This is a text with given value: 3');
      expect($filter('translate')('HOW_ABOUT_THIS', "{'value': '4'}")).toEqual('4 + 4');
      expect($filter('translate')('AND_THIS', "{'value': 5}")).toEqual('10');
      expect($filter('translate')('AND_THIS', "{'value': '5'}")).toEqual('55');
    });
  });

  describe('additional interpolation', function () {

    var $filter;

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

      $translateProvider
        .addInterpolation('customInterpolation')
        .preferredLanguage('en');
    }));

    beforeEach(inject(function (_$filter_, $rootScope) {
      $filter = _$filter_;
      $rootScope.$apply();
    }));

    it('should consider translate-interpolation value', inject(function () {
      expect($filter('translate')('FOO', {}, 'custom')).toEqual('custom interpolation');
    }));
  });
});
