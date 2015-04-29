/* jshint camelcase: false, unused: false */
/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

  describe('translate-namespace directive', function () {

    var element;

    beforeEach(module('pascalprecht.translate'));

    var $compile, $rootScope;

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should add translateNamespace to current scope', function () {
      element = $compile('<div translate-namespace="NAMESPACE"></div>')($rootScope);
      expect(element.scope().translateNamespace).toBe('NAMESPACE');
    });

    it('should append to existing namespace if new namespace starts with a dot', function () {
      $rootScope.translateNamespace = 'NAMESPACE';
      element = $compile('<div translate-namespace=".SUBNAMESPACE"></div>')($rootScope);
      expect(element.scope().translateNamespace).toBe('NAMESPACE.SUBNAMESPACE');
    });

    it('should append to existing namespace out of isolated scope', function () {
      $rootScope.translateNamespace = 'NAMESPACE';
      var isolatedScope = $rootScope.$new({});
      element = $compile('<div translate-namespace=".SUBNAMESPACE"></div>')(isolatedScope);
      expect(element.scope().translateNamespace).toBe('NAMESPACE.SUBNAMESPACE');
    });

    it('should overwrite existing namespace if new namespace does not start with a dot', function () {
      $rootScope.translateNamespace = 'NAMESPACE';
      element = $compile('<div translate-namespace="SUBNAMESPACE"></div>')($rootScope);
      expect(element.scope().translateNamespace).toBe('SUBNAMESPACE');
    });

    it('should not change parent scope namespace', function () {
      $rootScope.translateNamespace = 'NAMESPACE';
      element = $compile('<div translate-namespace="SUBNAMESPACE"></div>')($rootScope);
      expect($rootScope.translateNamespace).toBe('NAMESPACE');
    });
  });
});
