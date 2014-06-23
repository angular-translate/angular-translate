angular.module('pascalprecht.translate')
/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateStaticFilesLoaderProvider
 *
 * @description
 * By using a $translateStaticFilesLoaderProvider you can configure 
 * a formatter which transforms the received data into a valid object 
 * of key-value pairs. This could be used for example if your
 * server uses Java and your translation files are .properties file.
 * 
 * Otherwise, if your translation server immediately exposes 
 * valid objects of key-value pairs. You do not have anything to 
 * configure and can use directly the $translateStaticFilesLoader 
 * which creates a loading function for a typical static file url pattern:
 * "lang-en_US.json", "lang-de_DE.json", etc. Using this builder,
 * the response of these urls must be an object of key-value pairs.
 *
 */
.provider('$translateStaticFilesLoader', function () {
  var transformer;
  
  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateStaticFilesLoader#setTransformer
   * @methodOf pascalprecht.translate.$translateStaticFilesLoader
   *
   * @description
   * Registers a transformer used to transform the static file received from the provided url to a valid 
   * key-value pair object.
   *
   * @param {function} trans a function used to transform a recovered file into a key-value pair object.
   *
   * @returns {void}
   */
  this.setTransformer = function(trans) {
    transformer = trans;
  };
  
  /**
   * @ngdoc object
   * @name pascalprecht.translate.$translateStaticFilesLoader
   *
   * @requires $q
   * @requires $http
   *
   * @description
   *
   * @param {object} options Options object, which gets prefix, suffix and key.
   */
  this.$get = ['$q', '$http', function ($q, $http) {
    return function(options) {
      if (!options || (!angular.isString(options.prefix) || !angular.isString(options.suffix))) {
        throw new Error('Couldn\'t load static files, no prefix or suffix specified!');
      }

      var deferred = $q.defer();

      $http({
        url: [
          options.prefix,
          options.key,
          options.suffix
        ].join(''),
        method: 'GET',
        params: ''
      }).success(function (data) {
        deferred.resolve((transformer || angular.noop)(data));
      }).error(function (data) {
        deferred.reject(options.key);
      });

      return deferred.promise;
    }
  }];
  
});
