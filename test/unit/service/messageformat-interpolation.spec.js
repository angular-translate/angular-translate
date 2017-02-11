/* jshint camelcase: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  var $translateMessageFormatInterpolation;

  beforeEach(module('pascalprecht.translate'));

  beforeEach(inject(function (_$translateMessageFormatInterpolation_) {
    $translateMessageFormatInterpolation = _$translateMessageFormatInterpolation_;
  }));

  it('should be defined', function () {
    expect($translateMessageFormatInterpolation).toBeDefined();
  });

  it('should be an object ', function () {
    expect(typeof $translateMessageFormatInterpolation).toBe('object');
  });

  it('should have a setLocale() method', function () {
    expect($translateMessageFormatInterpolation.setLocale).toBeDefined();
  });

  it('should have a getInterpolationIdentifier() method', function () {
    expect($translateMessageFormatInterpolation.getInterpolationIdentifier).toBeDefined();
  });

  it('should have a interpolate() method', function () {
    expect($translateMessageFormatInterpolation.interpolate).toBeDefined();
  });

  describe('$translateMessageFormatInterpolation#setLocale', function () {

    it('should be a function ', function () {
      expect(typeof $translateMessageFormatInterpolation.setLocale).toBe('function');
    });
  });

  describe('$translateMessageFormatInterpolation#getInterpolationIdentifier', function () {

    it('should be a function ', function () {
      expect(typeof $translateMessageFormatInterpolation.getInterpolationIdentifier).toBe('function');
    });

    it('should return a string', function () {
      expect(typeof $translateMessageFormatInterpolation.getInterpolationIdentifier()).toBe('string');
    });

    it('should return "messageformat"', function () {
      expect($translateMessageFormatInterpolation.getInterpolationIdentifier()).toEqual('messageformat');
    });
  });

  describe('$translateMessageFormatInterpolation#interpolate', function () {

    it('should be a function ', function () {
      expect(typeof $translateMessageFormatInterpolation.interpolate).toBe('function');
    });

    it('should return a string', function () {
      expect(typeof $translateMessageFormatInterpolation.interpolate('')).toBe('string');
    });

    it('should translate given string', function () {
      expect($translateMessageFormatInterpolation.interpolate('Foo bar')).toEqual('Foo bar');
    });

    it('should replace interpolateParams with concrete values', function () {
      expect($translateMessageFormatInterpolation.interpolate('Foo bar {value}', {value : 5})).toEqual('Foo bar 5');
    });

    it('should support SelectFormat', function () {
      expect($translateMessageFormatInterpolation.interpolate('{GENDER, select, male{He} female{She} other{They}} liked this.', {GENDER : 'male'}))
        .toEqual('He liked this.');
      expect($translateMessageFormatInterpolation.interpolate('{GENDER, select, male{He} female{She} other{They}} liked this.', {GENDER : 'female'}))
        .toEqual('She liked this.');
      expect($translateMessageFormatInterpolation.interpolate('{GENDER, select, male{He} female{She} other{They}} liked this.'))
        .toEqual('They liked this.');
    });

    it('should support PluralFormat', function () {
      expect($translateMessageFormatInterpolation.interpolate('There {NUM_RESULTS, plural, one{is one result} other{are # results}}.', {
        'NUM_RESULTS' : 0
      })).toEqual('There are 0 results.');

      expect($translateMessageFormatInterpolation.interpolate('There {NUM_RESULTS, plural, one{is one result} other{are # results}}.', {
        'NUM_RESULTS' : 1
      })).toEqual('There is one result.');

      expect($translateMessageFormatInterpolation.interpolate('There {NUM_RESULTS, plural, one{is one result} other{are # results}}.', {
        'NUM_RESULTS' : 100
      })).toEqual('There are 100 results.');
    });

    it('should support PluralFormat - offset extension', function () {
      expect($translateMessageFormatInterpolation.interpolate(
        'You {NUM_ADDS, plural, offset:1' +
        '=0{didnt add this to your profile}' +
        'one{and one other person added this to their profile}' +
        'other{and # others added this to their profiles}' +
        '}.',
        {
          'NUM_ADDS' : 0
        })).toEqual('You didnt add this to your profile.');

      expect($translateMessageFormatInterpolation.interpolate(
        'You {NUM_ADDS, plural, offset:1' +
        '=0{didnt add this to your profile}' +
        'one{and one other person added this to their profile}' +
        'other{and # others added this to their profiles}' +
        '}.',
        {
          'NUM_ADDS' : 2
        })).toEqual('You and one other person added this to their profile.');

      expect($translateMessageFormatInterpolation.interpolate(
        'You {NUM_ADDS, plural, offset:1' +
        '=0{didnt add this to your profile}' +
        'one{and one other person added this to their profile}' +
        'other{and # others added this to their profiles}' +
        '}.',
        {
          'NUM_ADDS' : 3
        })).toEqual('You and 2 others added this to their profiles.');
    });

    it('should sanitize the interpolation params', inject(function ($translateSanitization) {
      var text = 'Foo bar {value}';
      var params = {value : '<span>Test</span>'};
      var sanitizedText = 'Foo bar &lt;span&gt;Test&lt;/span&gt;';

      spyOn($translateSanitization, 'sanitize').and.callThrough();
      $translateMessageFormatInterpolation.useSanitizeValueStrategy('escapeParameters');

      expect($translateMessageFormatInterpolation.interpolate(text, params)).toBe(sanitizedText);
      expect($translateSanitization.sanitize).toHaveBeenCalledWith(params, 'params', undefined);
    }));

    it('should not sanitize the interpolation params when a null strategy value is passed',
      inject(function ($translateSanitization) {
        var text = 'Foo bar {value}';
        var paramValue = '<span>Test</span>';
        var params = {value : paramValue};
        var unsanitizedText = 'Foo bar <span>Test</span>';

        spyOn($translateSanitization, 'sanitize').and.callThrough();
        $translateMessageFormatInterpolation.useSanitizeValueStrategy('escapeParameters');

        expect($translateMessageFormatInterpolation.interpolate(text, params, 'service', null)).toBe(unsanitizedText);
        expect($translateSanitization.sanitize).toHaveBeenCalledWith(params, 'params', null);
      }));

    it('should sanitize the interpolated text', inject(function ($translateSanitization) {
      var text = 'Foo <span>bar</span> {value}';
      var params = {value : 'value'};
      var interPolatedText = 'Foo <span>bar</span> value';
      var sanitizedText = 'Foo &lt;span&gt;bar&lt;/span&gt; value';

      spyOn($translateSanitization, 'sanitize').and.callThrough();
      $translateMessageFormatInterpolation.useSanitizeValueStrategy('escape');

      expect($translateMessageFormatInterpolation.interpolate(text, params)).toBe(sanitizedText);
      expect($translateSanitization.sanitize).toHaveBeenCalledWith(interPolatedText, 'text', undefined);
    }));

    it('should not sanitize the interpolated text when a null strategy value is passed',
      inject(function ($translateSanitization) {
        var text = 'Foo <span>bar</span> {value}';
        var params = {value : 'value'};
        var interPolatedText = 'Foo <span>bar</span> value';

        spyOn($translateSanitization, 'sanitize').and.callThrough();
        $translateMessageFormatInterpolation.useSanitizeValueStrategy('escape');

        expect($translateMessageFormatInterpolation.interpolate(text, params, 'service', null)).toBe(interPolatedText);
        expect($translateSanitization.sanitize).toHaveBeenCalledWith(interPolatedText, 'text', null);
      }));
  });
});

describe('pascalprecht.translate', function () {

  var $provider;
  var called = false;
  var calledWithPayload = false;

  beforeEach(module('pascalprecht.translate', function ($translateMessageFormatInterpolationProvider) {
    $provider = $translateMessageFormatInterpolationProvider;
    $provider.messageFormatConfigurer(function (mf) {
      called = true;
      calledWithPayload = !!mf;
    });
  }));

  describe('$translateMessageFormatInterpolationProvider', function () {

    describe('$translateMessageFormatInterpolationProvider#configurer', function () {

      it('should be invoked', function () {
        inject(function ($translateMessageFormatInterpolation) {
          expect($translateMessageFormatInterpolation).toBeDefined();
          expect(called).toBe(true);
          expect(calledWithPayload).toBe(true);
        });
      });

    });
  });

});
