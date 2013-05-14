angular.module('pascalprecht.translate')
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translate
 * @requires $filter
 * @requires $interpolate
 * @restrict A
 *
 * @description
 * Translates contents by given translation id either through attribute or DOM contents.
 * Internally it uses `translate` filter to translate translation id.
 *
 */
.directive('translate', ['$filter', '$interpolate', function ($filter, $interpolate) {

  var translate = $filter('translate');

  return {
    restrict: 'A',
    scope: true,
    link: function linkFn(scope, element, attr) {

      // Ensures any change of the attribute "translate" containing the id will
      // be re-stored to the scope's "translationId".
      // If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
      attr.$observe('translate', function (translationId) {
        if (angular.equals(translationId , '')) {
          scope.translationId = $interpolate(element.text().replace(/^\s+|\s+$/g,''))(scope.$parent);
        } else {
          scope.translationId = translationId;
        }
      });

      attr.$observe('values', function (interpolateParams) {
        scope.interpolateParams = interpolateParams;
      });

      // Ensures the text will be refreshed after the current language was changed
      // w/ $translate.uses(...)
      scope.$on('translationChangeSuccess', function () {
        element.html(translate(scope.translationId, scope.interpolateParams));
      });

      // Ensures the text will be refreshed after either the scope's translationId
      // or the interpolated params have been changed.
      scope.$watch('translationId + interpolateParams', function (nValue) {
        if (nValue) {
          element.html(translate(scope.translationId, scope.interpolateParams));
        }
      });
    }
  };
}]);
