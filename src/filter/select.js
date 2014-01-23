angular.module('pascalprecht.translate')
/** 
 * @ngdoc filter
 * @name pascalprecht.translate.filter:translate
 * 
 * @description
 * Filter allows to select one of the variants based on the value of some token.
 *
 * @param {string} A value of the token
 * @param {object} An object which holds resulting values approproate to values of token
 *
 * @returns {string} Selected case
 *
 * @example:
 * String
 * "Утром {{ 'he' | select : { he : 'он проснулся', she : 'она проснулась', other : 'оно проснулось' } }} в своей постели."
 * will become
 * "Утром он проснулся в своей постели."
 */
.filter('select', [function() {

  return function(value, replaceCases) {
    
    if (!angular.isObject(replaceCases)) {
      return value;
    }
    
    if (replaceCases.hasOwnProperty(value)) {
      return replaceCases[value];
    }
    
    if (replaceCases.other) {
      return replaceCases.other;
    } else {
      return value;
    }
    
  };
}]);