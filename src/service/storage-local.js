angular.module('pascalprecht.translate')

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateLocalStorage
 * @requires $window
 *
 * @description
 * Abstraction layer for localStorage. This service is used when telling angular-translate
 * to use localStorage as storage.
 *
 */
.factory('$translateLocalStorage', ['$window', '$translateCookieStorage', function ($window, $translateCookieStorage) {

  // Setup adapter
  var localStorageAdapter = {
    /**
     * @ngdoc function
     * @name pascalprecht.translate.$translateLocalStorage#get
     * @methodOf pascalprecht.translate.$translateLocalStorage
     *
     * @description
     * Returns an item from localStorage by given name.
     *
     * @param {string} name Item name
     * @return {string} Value of item name
     */
    get: function (name) {
      return $window.localStorage.getItem(name);
    },
    /**
     * @ngdoc function
     * @name pascalprecht.translate.$translateLocalStorage#set
     * @methodOf pascalprecht.translate.$translateLocalStorage
     *
     * @description
     * Sets an item in localStorage by given name.
     *
     * @param {string} name Item name
     * @param {string} value Item value
     */
    set: function (name, value) {
      $window.localStorage.setItem(name, value);
    }
  };

  var $translateLocalStorage = ('localStorage' in $window && $window.localStorage !== null) ?
  localStorageAdapter : $translateCookieStorage;

  return $translateLocalStorage;
}]);
