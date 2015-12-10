/* jshint camelcase: false, unused: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  describe('translate-language directive', function () {

    var element;

    beforeEach(module('pascalprecht.translate'));

    var $compile, $rootScope;

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should add translateLanguage to current scope', function () {
      element = $compile('<div translate-language="he"></div>')($rootScope);
      $rootScope.$digest();
      expect(element.scope().translateLanguage).toBe('he');
    });

    it('should not change parent scope language', function () {
      $rootScope.translateLanguage = 'he';
      element = $compile('<div translate-language="en"></div>')($rootScope);
      $rootScope.$digest();
      expect($rootScope.translateLanguage).toBe('he');
    });
  });
});
