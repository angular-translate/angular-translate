angular.module('ngTranslate')

/**
 * @ngdoc factory
 * @name ngTranslate.factory:$translateCookieStorage
 * @requires $cookieStore
 *
 * @description
 * Abstraction layer for cookieStore. This service is used when telling ngTranslate
 * to use cookieStore as storage.
 *
 */
.factory('$translateCookieStorage', ['$cookieStore', function ($cookieStore) {

  var $translateCookieStorage = {

    /**
     * @ngdoc function
     * @name ngTranslate.$translateCookieStorage#get
     * @methodOf ngTranslate.$translateCookieStorage
     *
     * @description
     * Returns an item from cookieStorage by given name.
     *
     * @param {string} name Item name
     * @return {string} Value of item name
     */
    get: function (name) {
      return $cookieStore.get(name);
    },

    /**
     * @ngdoc function
     * @name ngTranslate.$translateCookieStorage#set
     * @methodOf ngTranslate.$translateCookieStorage
     *
     * @description
     * Sets an item in cookieStorage by given name.
     *
     * @param {string} name Item name
     * @param {string} value Item value
     */
    set: function (name, value) {
      $cookieStore.put(name, value);
    }
  };

  return $translateCookieStorage;
}]);
