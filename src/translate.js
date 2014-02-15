/**
 * @ngdoc overview
 * @name pascalprecht.translate
 *
 * @description
 * The main module which holds everything together.
 */
angular.module('pascalprecht.translate', ['ng'])

.run(['$translate', function ($translate) {

  var key = $translate.storageKey(),
      storage = $translate.storage();

  if (storage) {
    if (!storage.get(key)) {

      if (angular.isString($translate.preferredLanguage())) {
        $translate.use($translate.preferredLanguage());
        // $translate.use() will also remember the language.
        // So, we don't need to call storage.set() here.
      } else {
        storage.set(key, $translate.use());
      }

    } else {
      $translate.use(storage.get(key));
    }
  } else if (angular.isString($translate.preferredLanguage())) {
    $translate.use($translate.preferredLanguage());
  }
}]);
