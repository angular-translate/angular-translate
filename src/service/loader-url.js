angular.module('pascalprecht.translate')
/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateUrlLoader
 * @requires $q
 * @requires $http
 *
 * @description
 * Creates a loading function for a typical dynamic url pattern:
 * "locale.php?lang=en_US", "locale.php?lang=de_DE", "locale.php?language=nl_NL" etc.
 * Prefixing the specified url, the current requested, language id will be applied
 * with "?{queryParameter}={key}".
 * Using this service, the response of these urls must be an object of
 * key-value pairs.
 *
 * @param {object} options Options object, which gets the url, key and
 * optional queryParameter ('lang' is used by default).
 */
.factory('$translateUrlLoader', $translateUrlLoader);

function $translateUrlLoader($q, $http) {

  'use strict';

  return function (options) {

    if (!options || !options.url) {
      throw new Error('Couldn\'t use urlLoader since no url is given!');
    }

    var requestParams = {};

    requestParams[options.queryParameter || 'lang'] = options.key;

    return $http(angular.extend({
      url: options.url,
      params: requestParams,
      method: 'GET'
    }, options.$http))
      .then(function(result) {
        return result.data;
      }, function () {
        return $q.reject(options.key);
      });
  };
}

$translateUrlLoader.displayName = '$translateUrlLoader';
