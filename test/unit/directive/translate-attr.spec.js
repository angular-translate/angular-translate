/* jshint camelcase: false, quotmark: false, unused: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  describe('$translateDirective (single-lang)', function () {

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      $translateProvider
        .translations('en', {
          'message' : 'Hello',
          'second_message' : 'Bye',
          'with_value' : 'This is {{value}}',
          'namespace' : {
            'message' : 'Namespaced',
          }
        }).translations('de', {
        'message' : 'Hallo'
      }).preferredLanguage('en');
    }));

    var $compile, $rootScope, $translate, element;

    beforeEach(inject(function (_$compile_, _$rootScope_, _$translate_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $translate = _$translate_;
    }));

    describe('multiple attributes', function () {
      it('should support inline', function () {
        element = $compile('<div translate-attr="{ one: \'message\', two: \'second_message\' }" />')($rootScope);
        $rootScope.$digest();
        expect(element.attr('one')).toBe('Hello');
        expect(element.attr('two')).toBe('Bye');
      });

      it('should support addition', function () {
        $rootScope.attributes = {'one' : 'message'};
        element = $compile('<div translate-attr="attributes" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('one')).toBe('Hello');
        expect(element[0].hasAttribute('two')).toBe(false);

        $rootScope.attributes.two = 'second_message';
        $rootScope.$digest();
        expect(element.attr('one')).toBe('Hello');
        expect(element.attr('two')).toBe('Bye');
      });

      it('should support remove', function () {
        $rootScope.attributes = {'one' : 'message', 'two' : 'second_message'};
        element = $compile('<div translate-attr="attributes" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('one')).toBe('Hello');
        expect(element.attr('two')).toBe('Bye');

        delete $rootScope.attributes.two;
        $rootScope.$digest();
        expect(element.attr('one')).toBe('Hello');
        expect(element[0].hasAttribute('two')).toBe(false);
      });
    });

    describe('translation id', function () {
      it('should support change', function () {
        $rootScope.attributes = {'attr' : 'message'};
        element = $compile('<div translate-attr="attributes" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Hello');

        $rootScope.attributes.attr = 'second_message';
        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Bye');
      });

      it('should support remove', function () {
        $rootScope.attributes = {'attr' : 'message'};
        element = $compile('<div translate-attr="attributes" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Hello');

        $rootScope.attributes.attr = '';
        $rootScope.$digest();
        expect(element[0].hasAttribute('attr')).toBe(false);
      });
    });

    it('should support changed value', function () {
      $rootScope.values = {'value' : 'some value'};
      element = $compile('<div translate-attr="{ attr: \'with_value\' }" translate-values="values" />')($rootScope);

      $rootScope.$digest();
      expect(element.attr('attr')).toBe('This is some value');

      $rootScope.values.value = 'another value';
      $rootScope.$digest();
      expect(element.attr('attr')).toBe('This is another value');
    });

    describe('language', function () {
      it('should support change', function () {
        element = $compile('<div translate-attr="{ attr: \'message\' }" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Hello');

        $translate.use('de');
        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Hallo');
      });

      it('should support translateLanguage', function () {
        $rootScope.translateLanguage = 'de';
        element = $compile('<div translate-attr="{ attr: \'message\' }" />')($rootScope);
        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Hallo');
      });
    });

    it('should support translateNamespace', function () {
      $rootScope.translateNamespace = 'namespace';
      element = $compile('<div translate-attr="{ attr: \'.message\' }" />')($rootScope);
      $rootScope.$digest();
      expect(element.attr('attr')).toBe('Namespaced');
    });

    describe('bind', function () {
      it('should watch', function () {
        var translation = "message";
        $rootScope.generator = function () {
          return translation;
        };
        spyOn($rootScope, 'generator').and.callThrough();

        element = $compile('<div translate-attr="{ attr: generator() }" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Hello');
        expect($rootScope.generator).toHaveBeenCalled();

        $rootScope.generator.calls.reset();
        translation = 'second_message';
        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Bye');
        expect($rootScope.generator).toHaveBeenCalled();
      });

      it('should support one-time bind', function () {
        var translation = "message";
        $rootScope.generator = function () {
          return translation;
        };
        spyOn($rootScope, 'generator').and.callThrough();

        element = $compile('<div translate-attr="::{ attr: generator() }" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Hello');
        expect($rootScope.generator).toHaveBeenCalled();

        $rootScope.generator.calls.reset();
        translation = 'second_message';
        $rootScope.$digest();
        expect(element.attr('attr')).toBe('Hello');
        expect($rootScope.generator).not.toHaveBeenCalled();
      });
    });

    describe('translate-sanitize-strategy', function () {
      it('should sanitize with default strategy', function () {
        $rootScope.attributes = {'attr' : 'with_value'};
        $rootScope.values = {'value' : '<b>test</b>'};

        element = $compile('<div translate-attr="attributes" translate-values="values" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('attr')).toEqual('This is <b>test</b>');
      });

      it('should use overridden strategy', function () {
        $rootScope.attributes = {'attr' : 'with_value'};
        $rootScope.values = {'value' : '<b>test</b>'};
        $rootScope.strategy = 'escaped';

        element = $compile('<div translate-attr="attributes" translate-values="values" translate-sanitize-strategy="strategy" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('attr')).toEqual('This is &lt;b&gt;test&lt;/b&gt;');
      });

      it('should support changed strategy', function () {
        $rootScope.attributes = {'attr' : 'with_value'};
        $rootScope.values = {'value' : '<b>test</b>'};
        $rootScope.strategy = 'escaped';

        element = $compile('<div translate-attr="attributes" translate-values="values" translate-sanitize-strategy="strategy" />')($rootScope);

        $rootScope.$digest();
        expect(element.attr('attr')).toEqual('This is &lt;b&gt;test&lt;/b&gt;');

        $rootScope.strategy = null;
        $rootScope.$digest();
        expect(element.attr('attr')).toEqual('This is <b>test</b>');
      });
    });
  });
});
