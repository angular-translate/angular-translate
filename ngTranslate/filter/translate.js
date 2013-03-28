
angular.module('ngTranslate')

.filter('translate', ['$parse', '$translate', function ($parse, $translate) {
  return function (translationId, interpolateParams) {

    if (!angular.isObject(interpolateParams)) {
      interpolateParams = $parse(interpolateParams)();
    }

    return $translate(translationId, interpolateParams);
  };
}]);
