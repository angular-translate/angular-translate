angular.module('pascalprecht.translate')
/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateStaticFilesLoader
 * @requires $q
 * @requires $http
 *
 * @description
 * Creates a loading function for a typical static file url pattern:
 * "lang-en_US.json", "lang-de_DE.json", etc. Using this builder,
 * the response of these urls must be an object of key-value pairs.
 *
 * @param {object} options Options object, which gets prefix, suffix and key.
 */
.factory('$translateStaticFilesLoader', ['$q', '$http', function ($q, $http) {

  return function (options) {

    if (!options || (!angular.isString(options.prefix) || !angular.isString(options.suffix))) {
      throw new Error('Couldn\'t load static files, no prefix or suffix specified!');
    }

    var deferred = $q.defer();

    function load(key) {
      $http(angular.extend({
        url: [
          options.prefix,
          key,
          options.suffix
        ].join(''),
        method: 'GET',
        params: ''
      }, options.$http)).success(function (data) {
        if (key.length > 2 && (!data || 'null' === data)) {
          load(key.substr(0,2));
        } else {
          deferred.resolve(data);
        }
      }).error(function (data) {
        if (key.length > 2) {
          load(key.substr(0,2));
        } else {
          deferred.reject(options.key);
        }
      });
    }

    load(options.key);

    return deferred.promise;
  };
}]);
