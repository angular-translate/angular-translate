/* jshint camelcase: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {
  describe('$translateSanitization', function () {
    var $translateSanitization;

    beforeEach(module('pascalprecht.translate', 'ngSanitize'));
    beforeEach(inject(function (_$translateSanitization_) {
      $translateSanitization = _$translateSanitization_;
    }));

    it('should be defined', function () {
      expect($translateSanitization).toBeDefined();
    });

    it('should be an object ', function () {
      expect(typeof $translateSanitization).toBe('object');
    });

    it('should have a useStrategy() method', function () {
      expect($translateSanitization.useStrategy).toBeDefined();
    });

    it('should have a sanitize() method', function () {
      expect($translateSanitization.sanitize).toBeDefined();
    });

    describe('#sanitize', function () {
      var parameters = {
          array : [
            {value : 'This is <b>only an example with a <span onclick="alert(\'XSS\')">xss attack</span>!</b>'}
          ],
          falsyBoolean: false,
          truthyBoolean: true
        },
        text = 'This is <b>only an example with a <span onclick="alert(\'XSS\')">xss attack</span>!</b>',
        expectedParameters,
        expectedText;

      describe('with the default strategy', function () {
        it('should return params unchanged', function () {
          expectedParameters = angular.copy(parameters);
          expect($translateSanitization.sanitize(parameters, 'params')).toEqual(expectedParameters);
        });

        it('should return text unchanged', function () {
          expectedText = text;
          expect($translateSanitization.sanitize(text, 'text')).toEqual(expectedText);
        });

        it('should warn that no strategy has been configured', inject(function ($log) {
          spyOn($log, 'warn');
          $translateSanitization.sanitize(text, 'text');
          expect($log.warn).toHaveBeenCalled();
        }));
      });

      describe('with the sanitize strategy', function () {
        beforeEach(function () {
          $translateSanitization.useStrategy('sanitize');
        });

        it('should return params unchanged', function () {
          expectedParameters = angular.copy(parameters);
          expect($translateSanitization.sanitize(parameters, 'params')).toEqual(expectedParameters);
        });

        it('should $sanitize the text', function () {
          expectedText = 'This is <b>only an example with a <span>xss attack</span>!</b>';
          expect($translateSanitization.sanitize(text, 'text')).toEqual(expectedText);
        });
      });

      describe('with the escape strategy', function () {
        beforeEach(function () {
          $translateSanitization.useStrategy('escape');
        });

        it('should return params unchanged', function () {
          expectedParameters = angular.copy(parameters);
          expect($translateSanitization.sanitize(parameters, 'params')).toEqual(expectedParameters);
        });

        it('should htmlEscape the text', function () {
          expectedText = 'This is &lt;b&gt;only an example with a &lt;span onclick="alert(\'XSS\')"&gt;xss attack&lt;/span&gt;!&lt;/b&gt;';
          expect($translateSanitization.sanitize(text, 'text')).toEqual(expectedText);
        });
      });

      describe('with the sanitizeParameters strategy', function () {
        beforeEach(function () {
          $translateSanitization.useStrategy('sanitizeParameters');
        });

        it('should $sanitize params', function () {
          expectedParameters = {
            array : [
              {value : 'This is <b>only an example with a <span>xss attack</span>!</b>'}
            ],
            falsyBoolean: false,
            truthyBoolean: true
          };
          expect($translateSanitization.sanitize(parameters, 'params')).toEqual(expectedParameters);
        });

        it('should return text unchanged', function () {
          expectedText = text;
          expect($translateSanitization.sanitize(text, 'text')).toEqual(expectedText);
        });
      });

      describe('with the escapeParameters strategy', function () {
        beforeEach(function () {
          $translateSanitization.useStrategy('escapeParameters');
        });

        it('should htmlEscape params', function () {
          expectedParameters = {
            array : [
              {value : 'This is &lt;b&gt;only an example with a &lt;span onclick="alert(\'XSS\')"&gt;xss attack&lt;/span&gt;!&lt;/b&gt;'}
            ],
            falsyBoolean: false,
            truthyBoolean: true
          };
          expect($translateSanitization.sanitize(parameters, 'params')).toEqual(expectedParameters);
        });

        it('should return text unchanged', function () {
          expectedText = text;
          expect($translateSanitization.sanitize(text, 'text')).toEqual(expectedText);
        });

        it('should not escape functions', function () {

          var sanitizedUser;
          var user = {
            firstName : '<b>Foo</b>',
            save : angular.noop
          };

          var spyAngularElementReturnValue = jasmine.createSpyObj('angularElement', ['html', 'off', 'text', 'data']);

          spyOn(angular, 'element').and.returnValue(spyAngularElementReturnValue);

          /* Sanitized user should not have a save property. */

          sanitizedUser = $translateSanitization.sanitize({user : user}, 'params').user;

          expect('firstName' in sanitizedUser).toEqual(true);
          expect('save' in sanitizedUser).toEqual(false);

          /* `user.save` should not be called. */
          expect(spyAngularElementReturnValue.text.calls.count()).toEqual(1);
          expect(spyAngularElementReturnValue.text.calls.argsFor(0)).toEqual(['<b>Foo</b>']);

        });

      });

      describe('with the (legacy, deprecated) escaped strategy', function () {
        beforeEach(function () {
          $translateSanitization.useStrategy('escaped');
        });

        it('should htmlEscape params', function () {
          expectedParameters = {
            array : [
              {value : 'This is &lt;b&gt;only an example with a &lt;span onclick="alert(\'XSS\')"&gt;xss attack&lt;/span&gt;!&lt;/b&gt;'}
            ],
            falsyBoolean: false,
            truthyBoolean: true
          };
          expect($translateSanitization.sanitize(parameters, 'params')).toEqual(expectedParameters);
        });

        it('should return text unchanged', function () {
          expectedText = text;
          expect($translateSanitization.sanitize(text, 'text')).toEqual(expectedText);
        });
      });

      describe('with the chained [sanitize, escapeParameters] strategy', function () {
        beforeEach(function () {
          $translateSanitization.useStrategy(['sanitize', 'escapeParameters']);
        });

        it('should htmlEscape params', function () {
          expectedParameters = {
            array : [
              {value : 'This is &lt;b&gt;only an example with a &lt;span onclick="alert(\'XSS\')"&gt;xss attack&lt;/span&gt;!&lt;/b&gt;'}
            ],
            falsyBoolean: false,
            truthyBoolean: true
          };
          expect($translateSanitization.sanitize(parameters, 'params')).toEqual(expectedParameters);
        });

        it('should $sanitize the text', function () {
          expectedText = 'This is <b>only an example with a <span>xss attack</span>!</b>';
          expect($translateSanitization.sanitize(text, 'text')).toEqual(expectedText);
        });
      });

      it('with a custom strategy function should call the strategy function with value and mode', function () {
        $translateSanitization.useStrategy(function (value, mode) {
          if (mode === 'text') {
            value = value.toLowerCase();
          }
          return value;
        });
        expect($translateSanitization.sanitize('THIS IS A TEST', 'text')).toBe('this is a test');
      });

      it('should allow specifying a different strategy', function () {
        $translateSanitization.useStrategy('escape');
        expectedText = 'This is <b>only an example with a <span>xss attack</span>!</b>';
        expect($translateSanitization.sanitize(text, 'text', 'sanitize')).toEqual(expectedText);
      });

      it('should allow specifying a different strategy which is null', function () {
        $translateSanitization.useStrategy('escape');
        expect($translateSanitization.sanitize(text, 'text', null)).toEqual(text);
      });
    });
  });

  describe('$translateSanitization', function () {
    var $translateSanitization;

    beforeEach(module('ngSanitize'));
    beforeEach(module('pascalprecht.translate', function ($provide, $translateSanitizationProvider) {
      $provide.factory('mySanitizeService', function () {
        return function (value, mode) {
          return '1' + value + '2' + mode;
        };
      });
      $translateSanitizationProvider.addStrategy('mySanitize', 'mySanitizeService');
      $translateSanitizationProvider.useStrategy('mySanitize');
    }));
    beforeEach(inject(function (_$translateSanitization_) {
      $translateSanitization = _$translateSanitization_;
    }));

    describe('should allow specifying a different strategy which is the alias of an existing service', function () {
      it('for text', function () {
        expect($translateSanitization.sanitize('Donald <strong>Duck</strong>', 'text')).toEqual('1Donald <strong>Duck</strong>2text');
      });

      it('for params', function () {
        expect($translateSanitization.sanitize('Donald <strong>Duck</strong>', 'params')).toEqual('1Donald <strong>Duck</strong>2params');
      });
    });

  });

  describe('$translateSanitization#sanitize without ngSanitize', function () {
    var $translateSanitization;

    beforeEach(module('pascalprecht.translate'));
    beforeEach(inject(function (_$translateSanitization_) {
      $translateSanitization = _$translateSanitization_;
    }));

    describe('with the escape strategy', function () {
      it('should work normally', function () {
        $translateSanitization.useStrategy('escape');
        expect($translateSanitization.sanitize('<span>test</span>', 'text')).toEqual('&lt;span&gt;test&lt;/span&gt;');
      });
    });

    describe('with the sanitize strategy', function () {
      it('should throw an error', function () {
        $translateSanitization.useStrategy('sanitize');
        expect(function () {
          return $translateSanitization.sanitize('<span>test</span>', 'text');
        }).toThrow(new Error('pascalprecht.translate.$translateSanitization: Error cannot find $sanitize service. Either include the ngSanitize module (https://docs.angularjs.org/api/ngSanitize) or use a sanitization strategy which does not depend on $sanitize, such as \'escape\'.'));
      });
    });
  });
});
