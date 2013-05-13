angular.module('ngTranslate')
/**
 * @ngdoc filter
 * @name ngTranslate.filter:translate
 * @requires $parse
 * @requires ngTranslate.$translate
 * @function
 *
 * @description
 * Uses `$translate` service to translate contents. Excepts interpolate parameters
 * to pass dynamized values though translation.
 */
.filter('translate', ['$parse', '$translate', function ($parse, $translate) {
  return function (translationId, interpolateParams) {

    if (!angular.isObject(interpolateParams)) {
      interpolateParams = $parse(interpolateParams)();
    }
    return $translate(translationId, interpolateParams);
  };
}]);
