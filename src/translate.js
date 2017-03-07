/**
 * @ngdoc overview
 * @name pascalprecht.translate
 *
 * @description
 * The main module which holds everything together.
 */
angular.module('pascalprecht.translate', ['ng'])
  .run(runTranslate);

function runTranslate($translate) {

  'use strict';

  var key = $translate.storageKey(),
    storage = $translate.storage();

  var fallbackFromIncorrectStorageValue = function () {
    var preferred = $translate.preferredLanguage();
    if (angular.isString(preferred)) {
      $translate.use(preferred);
      // $translate.use() will also remember the language.
      // So, we don't need to call storage.put() here.
    } else {
      storage.put(key, $translate.use());
    }
  };

  fallbackFromIncorrectStorageValue.displayName = 'fallbackFromIncorrectStorageValue';

  if (storage) {
    var value = storage.get(key);
    if (!value) {
      fallbackFromIncorrectStorageValue();
    } else {
      // check if the value is a promise
      if (value && (typeof value.then === 'function')) {
        // if so set the language when the promise is resolved
        value.then(function(result){
          $translate.use(result)
        }, function err() {
          fallbackFromIncorrectStorageValue();
        });
      } else {
        $translate.use(value)['catch'](fallbackFromIncorrectStorageValue);
      }
    }
  } else if (angular.isString($translate.preferredLanguage())) {
    $translate.use($translate.preferredLanguage());
  }
}

runTranslate.displayName = 'runTranslate';
