angular.module('pascalprecht.translate')
/**
 * @ngdoc filter
 * @name pascalprecht.translate.filter:translate
 * @requires $parse
 * @requires pascalprecht.translate.$translate
 * @function
 *
 * @description
 * Uses `$translate` service to translate contents. Accepts interpolate parameters
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
