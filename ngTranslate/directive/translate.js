angular.module('ngTranslate')

.directive('translate', ['$filter', '$interpolate', function ($filter, $interpolate) {

  var translate = $filter('translate');

  return {
    restrict: 'A',
    scope: true,
    link: function linkFn(scope, element, attr) {

      // Ensures any change of the attribute "translate" containing the id will
      // be re-stored to the scope's "translationId".
      // If the attribute has no content, the element's text value will be used.
      attr.$observe('translate', function (translationId) {
        if (angular.equals(translationId , '')) {
          scope.translationId = $interpolate(element.text())(scope.$parent);
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
