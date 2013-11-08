angular.module('pascalprecht.translate')
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translate
 * @requires $filter
 * @requires $interpolate
 * @restrict A
 *
 * @description
 * Translates given translation id either through attribute or DOM content.
 * Internally it uses `translate` filter to translate translation id. It possible to
 * pass an optional `translate-values` object literal as string into translation id.
 *
 * @param {string=} translate Translation id which could be either string or interpolated string.
 * @param {string=} translate-values Values to pass into translation id. Can be passed as object literal string or interpolated object.
 *
 * @example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre translate="TRANSLATION_ID"></pre>
        <pre translate>TRANSLATION_ID</pre>
        <pre translate="{{translationId}}"></pre>
        <pre translate>{{translationId}}</pre>
        <pre translate="WITH_VALUES" translate-values="{value: 5}"></pre>
        <pre translate translate-values="{value: 5}">WITH_VALUES</pre>
        <pre translate="WITH_VALUES" translate-values="{{values}}"></pre>
        <pre translate translate-values="{{values}}">WITH_VALUES</pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($translateProvider) {

        $translateProvider.translations({
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}'
        });

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
    <file name="scenario.js">
      it('should translate', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';

          element = $compile('<p translate="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate="{{translationId}}"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>TRANSLATION_ID</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>{{translationId}}</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');
        });
      });
    </file>
   </example>
 */
.directive('translate', ['$filter', '$interpolate', function ($filter, $interpolate) {

  var translate = $filter('translate');

  return {
    restrict: 'AE',
    scope: true,
    link: function linkFn(scope, element, attr) {

      if (attr.translateInterpolation) {
        scope.interpolation = attr.translateInterpolation;
      }
      // Ensures any change of the attribute "translate" containing the id will
      // be re-stored to the scope's "translationId".
      // If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
      attr.$observe('translate', function (translationId) {
        if (angular.equals(translationId , '') || translationId === undefined) {
          scope.translationId = $interpolate(element.text().replace(/^\s+|\s+$/g,''))(scope.$parent);
        } else {
          scope.translationId = translationId;
        }
      });

      attr.$observe('translateValues', function (interpolateParams) {
        scope.interpolateParams = interpolateParams;
      });

      // Ensures the text will be refreshed after the current language was changed
      // w/ $translate.uses(...)
      scope.$on('$translateChangeSuccess', function () {
        element.html(translate(scope.translationId, scope.interpolateParams, scope.interpolation));
      });

      // Ensures the text will be refreshed after either the scope's translationId
      // or the interpolated params have been changed.
      scope.$watch('translationId + interpolateParams', function (nValue) {
        if (nValue) {
          element.html(translate(scope.translationId, scope.interpolateParams, scope.interpolation));
        }
      });
    }
  };
}]);

