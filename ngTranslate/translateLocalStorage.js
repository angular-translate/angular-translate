angular.module('ngTranslate')

/**
 * @ngdoc factory
 * @name ngTranslate.factory:$translateLocalStorage
 * @requires $window
 *
 * @description
 * Abstraction layer for localStorage. This service is used when telling ngTranslate
 * to use localStorage as storage.
 *
 */
.factory('$translateLocalStorage', ['$window', '$translateCookieStorage', function ($window, $translateCookieStorage) {

  // Setup adapter
  var localStorageAdapter = {
    /**
     * @ngdoc function
     * @name ngTranslate.$translateLocalStorage#get
     * @methodOf ngTranslate.$translateLocalStorage
     *
     * @description
     * Returns an item from localStorage by given name.
     *
     * @param {string} name Item name
     * @return {string} Value of item name
     */
    get: function (name) { return $window.localStorage.getItem(name); },
    /**
     * @ngdoc function
     * @name ngTranslate.$translateLocalStorage#set
     * @methodOf ngTranslate.$translateLocalStorage
     *
     * @description
     * Sets an item in localStorage by given name.
     *
     * @param {string} name Item name
     * @param {string} value Item value
     */
    set: function (name, value) { $window.localStorage.setItem(name, value); }
  };

  var $translateLocalStorage = ('localStorage' in $window && $window.localStorage !== null) ?
  localStorageAdapter : $translateCookieStorage;

  return $translateLocalStorage;
}]);
