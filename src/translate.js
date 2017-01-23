/**
 * @ngdoc overview
 * @name pascalprecht.translate
 *
 * @description
 * The main module which holds everything together.
 */
angular.module('pascalprecht.translate', ['ng'])
  .run(runTranslate);



function runTranslate($translate, $rootScope, $q) {

  /**
   * @ngdoc event
   * @name pascalprecht.translate#$translateReadyToUse
   * @eventOf pascalprecht.translate
   * @eventType emit on root scope
   *
   * @description
   * A $translateReadyToUse event is called when the run() method has completed and
   * the promises from setting $translate.use() are resolved.
   * After this event has been fired $translate.use() returns the actual used language
   *
   * @example
   * angular.module('app', [])
   *   .run(function($rootScope, $translate){
   *     $rootScope.$on('$translateReadyToUse', function() {
   *       $rootScope.interfaceLang = $translate.use();
   *     });
   *   });
   *
   *   *Note: In the case $translate is configured with no storage and no preferredLanguage this event is never fired*
   */

  'use strict';

  var key = $translate.storageKey(),
      storage = $translate.storage(),
      deferred = $q.defer(),
      usePromise = deferred.promise;

  var fallbackFromIncorrectStorageValue = function () {
    var preferred = $translate.preferredLanguage();
    if (angular.isString(preferred)) {
      usePromise = $translate.use(preferred);
      // $translate.use() will also remember the language.
      // So, we don't need to call storage.put() here.
    } else {
      deferred.resolve(storage.put(key, $translate.use()));

    }
  };

  fallbackFromIncorrectStorageValue.displayName = 'fallbackFromIncorrectStorageValue';

  if (storage) {
    if (!storage.get(key)) {
      fallbackFromIncorrectStorageValue();
    } else {
      usePromise = $translate.use(storage.get(key))['catch'](fallbackFromIncorrectStorageValue);
    }
  } else if (angular.isString($translate.preferredLanguage())) {
    usePromise = $translate.use($translate.preferredLanguage());
  }
  usePromise.then(function(){
    // in the case of 'with a storage but with no loadable translations', this would yield undefined,
    // but $translate.use() returns correctly the preferredLanguage. Therefore this event does not emit data
//    $rootScope.$emit('$translateReadyToUse', {language: $translate.use()});
    $rootScope.$emit('$translateReadyToUse');
  });
}

runTranslate.displayName = 'runTranslate';
