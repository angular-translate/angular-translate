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
.factory('$translateLocalStorage', ['$window', '$translateCookieStorage', function ($window) {

  // Setup adapter
  var localStorageAdapter = {
    get: function (name) { return $window.localStorage.getItem(name); },
    set: function (name, value) { $window.localStorage.setItem(name, value); }
  };

  var storage = ('localStorage' in $window && $window.localStorage !== null) ?
  localStorageAdapter : $translateCookieStorage;

  var $translateLocalStorage = {

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
    get: function (name) {
      return storage.get(name);
    },

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
    set: function (name, value) {
      storage.set(name, value);
    }
  };

  return $translateLocalStorage;
}]);
