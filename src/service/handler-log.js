angular.module('pascalprecht.translate')

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateMissingTranslationHandlerLog
 * @requires $log
 *
 * @description
 * Uses angular's `$log` service to give a warning when trying to translate a
 * translation id which doesn't exist.
 *
 * @returns {function} Handler function
 */
.factory('$translateMissingTranslationHandlerLog', $translateMissingTranslationHandlerLog);

function $translateMissingTranslationHandlerLog ($log) {
  var handler = function (translationId) {
    $log.warn('Translation for ' + translationId + ' doesn\'t exist');
  };

  handler.displayName = '$translateMissingTranslationHandlerLog';

  return handler;
}

$translateMissingTranslationHandlerLog.$inject = ['$log'];
$translateMissingTranslationHandlerLog.displayName = '$translateMissingTranslationHandlerLog';
