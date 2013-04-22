angular.module('ngTranslate')

.directive('translate', ['$filter', '$interpolate', function ($filter, $interpolate) {

  var translate = $filter('translate');

  return {
    restrict: 'A',
    scope: true,
    link: function linkFn(scope, element, attr) {

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

      scope.$on('translationChangeSuccess', function () {
        element.html(translate(scope.translationId, scope.interpolateParams));
      });

      scope.$watch('translationId + interpolateParams', function () {
        element.html(translate(scope.translationId, scope.interpolateParams));
      });
    }
  };
}]);
