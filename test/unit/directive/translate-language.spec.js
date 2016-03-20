/* jshint camelcase: false, unused: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  describe('translate-language directive', function () {

    var element;

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
       $translateProvider
         .translations('en', {
           'message': 'Hello'
         })
         .translations('de', {
           'message': 'Hallo'
         })
         .preferredLanguage('en');
    }));

    var $compile, $rootScope, $translate;

    beforeEach(inject(function (_$compile_, _$rootScope_, _$translate_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $translate = _$translate_;
    }));

    it('should add translateLanguage to current scope', function () {
      element = $compile('<div translate-language="he"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.scope().translateLanguage).toBe('he');
    });

    it('should not change parent scope language', function () {
      $rootScope.translateLanguage = 'de';
      element = $compile('<div translate translate-language="en">message</div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.translateLanguage).toBe('de');

      expect(element.html()).toBe('Hello');
    });

    it('should be possible to change at runtime', function () {
      element = $compile('<div translate translate-language="en">message</div>')($rootScope);
      $rootScope.$digest();

      $rootScope.$$childTail.translateLanguage = 'de';
      $rootScope.$digest();

      expect(element.html()).toBe('Hallo');
    });

    it('should not be changed by parent scope language', function() {
      var element = angular.element('<span><p translate>message</p></span>');
      var isolatedElement = angular.element('<h5 translate-language="en" translate>message</h5>');

      $compile(element)($rootScope);
      $compile(isolatedElement)($rootScope.$new(true, $rootScope));

      element.append(isolatedElement);
      $rootScope.$digest();

      expect(element.find('p').html()).toBe('Hello');
      expect(isolatedElement.html()).toBe('Hello');
      $translate.use('de');
      $rootScope.$digest();

      expect(element.find('p').html()).toBe('Hallo');
      expect(isolatedElement.html()).toBe('Hello');
    });
  });
});
