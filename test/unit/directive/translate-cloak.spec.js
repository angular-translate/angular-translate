describe('pascalprecht.translate', function () {

  var element;

  describe('translate-cloak directive', function () {

    describe('default class name', function () {
      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        $translateProvider
          .useLoader('customLoader')
          .preferredLanguage('en_EN');
        $provide.factory('customLoader', ['$q', function ($q) {
          return function (options) {
            var deferred = $q.defer();

            deferred.resolve({
              'foo': 'bar'
            });

            return deferred.promise;
          };
        }]);
      }));

      var $compile, $rootScope;

      beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
      }));

      it('should add translate-cloak class', function () {
        element = $compile('<div translate-cloak></div>')($rootScope);
        expect(element.hasClass('translate-cloak')).toBe(true);
      });

      it('should remove translate-cloak class when loader is finished', function () {
        element = $compile('<div translate-cloak></div>')($rootScope);
        $rootScope.$digest();
        expect(element.hasClass('translate-cloak')).toBe(false);
      });

      it('should not add translate-cloak class if loader has already finished', function () {
        $rootScope.$digest();
        element = $compile('<div translate-cloak></div>')($rootScope);
        expect(element.hasClass('translate-cloak')).toBe(false);
      })
    });

    describe('custom class name', function () {
      beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
        $translateProvider
          .useLoader('customLoader')
          .preferredLanguage('en_EN')
          .cloakClassName('foo');
        $provide.factory('customLoader', ['$q', function ($q) {
          return function (options) {
            var deferred = $q.defer();

            deferred.resolve({
              'foo': 'bar'
            });

            return deferred.promise;
          };
        }]);
      }));

      var $compile, $rootScope;

      beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
      }));

      it('should add custom translate-cloak class', function () {
        element = $compile('<div translate-cloak></div>')($rootScope);
        expect(element.hasClass('foo')).toBe(true);
      });

      it('should remove custom translate-cloak class when loader is finished', function () {
        element = $compile('<div translate-cloak></div>')($rootScope);
        $rootScope.$digest();
        expect(element.hasClass('foo')).toBe(false);
      });

      it('should not add custom translate-cloak class if loader has already finished', function () {
        $rootScope.$digest();
        element = $compile('<div translate-cloak></div>')($rootScope);
        expect(element.hasClass('foo')).toBe(false);
      })
    });
  });
});
