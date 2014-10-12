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

      var $compile, $rootScope, $timeout;

      beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
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

      describe('an element added after the first translation', function () {
        it('should still have translate-cloak', function () {
          element = $compile('<div translate-cloak></div>')($rootScope);
          $rootScope.$digest();
          expect(element.hasClass('translate-cloak')).toBe(false);
          $timeout(function () {
            var element2 = $compile('<div translate-cloak></div>')($rootScope);
            $rootScope.$digest();
            expect(element2.hasClass('translate-cloak')).toBe(true);
          }, 100);
          $timeout.flush();
        });
        describe('with an attr translate-cloak', function () {
          it('with an invalid translation should still have not translate-cloak', function () {
            element = $compile('<div translate-cloak></div>')($rootScope);
            $rootScope.$digest();
            expect(element.hasClass('translate-cloak')).toBe(false);
            $timeout(function () {
              var element2 = $compile('<div translate-cloak="invalid.id"></div>')($rootScope);
              $rootScope.$digest();
              expect(element2.hasClass('translate-cloak')).toBe(true);
            }, 100);
            $timeout.flush();
          });
          it('with a valid translation should still have not translate-cloak', function () {
            element = $compile('<div translate-cloak></div>')($rootScope);
            $rootScope.$digest();
            expect(element.hasClass('translate-cloak')).toBe(false);
            $timeout(function () {
              var element2 = $compile('<div translate-cloak="foo"></div>')($rootScope);
              $rootScope.$digest();
              expect(element2.hasClass('translate-cloak')).toBe(false);
            }, 100);
            $timeout.flush();
          });
        });
      });
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
    });
  });
});
