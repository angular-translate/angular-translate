describe('pascalprecht.translate', function () {

  var module,
      deps;

  var hasModule = function (m) {
    return deps.indexOf(m) >= 0;
  };

  beforeEach(function () {
    module = angular.module('pascalprecht.translate');
    deps = module.value('pascalprecht.translate').requires;
  });

  it('should be registered', function () {
    expect(module).not.toEqual(null);
  });

  it('should have angular dependency', function () {
    expect(hasModule('ng')).toBe(true);
  });
});
