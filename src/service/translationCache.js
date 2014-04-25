/**
 * @ngdoc service
 * @name $translationCache
 * @requires $cacheFactory
 *
 * @description
 * The first time a translation table is used, it is loaded in the translation cache for quick retrieval. You
 * can load translation tables directly into the cache by consuming the
 * `$translationCache` service directly.
 *
 * @return {object} $cacheFactory object.
 */
angular.module('pascalprecht.translate').factory('$translationCache', ['$cacheFactory', function ($cacheFactory) {
    return $cacheFactory('translations');
}]);