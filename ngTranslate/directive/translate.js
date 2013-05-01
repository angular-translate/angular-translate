angular.module('ngTranslate')

.directive('translate', ['$filter', '$interpolate', function ($filter, $interpolate) {

  var translate = $filter('translate');

  return {
    restrict: 'A',
    scope: true,
    link: function linkFn(scope, element, attr) {

      // If any change is made to the attribute, the (new) language key and params will be re-stored.
      attr.$observe('translate', function (translationId) {
        if (angular.equals(translationId , '')) {
          scope.translationId = $interpolate(element.text())(scope.$parent);
        } else {
          scope.translationId = translationId;
        }
      });

      // TODO Doc
      attr.$observe('values', function (interpolateParams) {
        scope.interpolateParams = interpolateParams;
      });

      // If any changes were made, the actual translation text will be re-created.
      scope.$watch('translationId + interpolateParams', function (nValue) {
        if (nValue) {
          element.html(translate(scope.translationId, scope.interpolateParams));
        }
      });
    }
  };
}]);
