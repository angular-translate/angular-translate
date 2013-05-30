angular.module('pascalprecht.translate', ['ng'])

.run(['$translate', function ($translate) {

  var key = $translate.storageKey(),
      storage = $translate.storage();

  if (storage) {
    if (!storage.get(key)) {

      if (angular.isString($translate.preferredLanguage())) {
        // $translate.uses method will both set up and remember the language in case it's loaded successfully
        $translate.uses($translate.preferredLanguage());
      } else {
        storage.set(key, $translate.uses());
      }

    } else {
      $translate.uses(storage.get(key));
    }
  } else if (angular.isString($translate.preferredLanguage())) {
    $translate.uses($translate.preferredLanguage());
  }

}]);

angular.module('pascalprecht.translate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');

/**
 * @ngdoc object
 * @name translate.$translateProvider
 * @description
 *
 * $tranlateProvider allows developers to register translation-tables, asynchronous loaders
 * and similar to configure translation behavior directly inside of a module.
 *
 */
angular.module('pascalprecht.translate').provider('$translate', ['$STORAGE_KEY', function ($STORAGE_KEY) {

  var $translationTable = {},
      $preferredLanguage,
      $fallbackLanguage,
      $uses,
      $storageFactory,
      $storageKey = $STORAGE_KEY,
      $storagePrefix,
      $missingTranslationHandlerFactory,
      $loaderFactory,
      $loaderOptions,
      NESTED_OBJECT_DELIMITER = '.';

 /**
   * @ngdoc function
   * @name translate.$translateProvider#translations
   * @methodOf translate.$translateProvider
   *
   * @description
   * Registers a new translation table either in general or for specific language key.
   *
   * You can register a translation table just by passing an object hash where a key
   * represents a translation id and a value the concrete translation. Here is an
   * example:
   *
   * <pre>
   *  // register translation table
   *  $translateProvider.translations({
   *    'HEADLINE_TEXT':'Hey Guys, this is a headline!',
   *    'SOME_TEXT': 'A text anywhere in the app.'
   *  });
   * </pre>
   *
   * In the example above there are two registered translations,
   * HEADLINE_TEXT and SOME_TEXT.
   *
   * To register a translation table for specific language, pass a defined language
   * key as first parameter.
   *
   * <pre>
   *  // register translation table for language: 'de_DE'
   *  $translateProvider.translations('de_DE', {
   *    'GREETING': 'Hallo Welt!'
   *  });
   *
   *  // register another one
   *  $translateProvider.translations('en_US', {
   *    'GREETING': 'Hello world!'
   *  });
   * </pre>
   *
   * When registering multiple translation tables for for the same language key,
   * the actual translation table gets extended. This allows you to define module
   * specific translation which only get added, once a specific module is loaded in
   * your app.
   *
   * Invoking this method with no arguments returns the translation table which was
   * registered with no language key. Invoking it with a language key returns the
   * related translation table.
   *
   * @param {string} key A language key.
   * @param {object} translationTable A plain old JavaScript object that represents a translation table.
   *
   */
  var translations = function (langKey, translationTable) {

    if (!langKey && !translationTable) {
      return $translationTable;
    }

    if (langKey && !translationTable) {
      if (angular.isString(langKey)) {
        return $translationTable[langKey];
      } else {
        angular.extend($translationTable, flatObject(langKey));
      }
    } else {
      if (!angular.isObject($translationTable[langKey])) {
        $translationTable[langKey] = {};
      }
      angular.extend($translationTable[langKey], flatObject(translationTable));
    }
  };

  var flatObject = function (data, path, result) {
    var key, keyWithPath, val;

    if (!path) {
      path = [];
    }
    if (!result) {
      result = {};
    }
    for (key in data) {
      if (!data.hasOwnProperty(key)) continue;
      val = data[key];
      if (angular.isObject(val)) {
        flatObject(val, path.concat(key), result);
      } else {
        keyWithPath = path.length ? ("" + path.join(NESTED_OBJECT_DELIMITER) + NESTED_OBJECT_DELIMITER + key) : key;
        result[keyWithPath] = val;
      }
    }
    return result;
  };

  this.translations = translations;

 /**
   * @ngdoc function
   * @name translate.$translateProvider#preferredLanguage
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells the module which of the registered translation tables to use for translation
   * at initial startup by passing a language key. Similar to `$translateProvider#uses`
   * only that it says which language to **prefer**.
   *
   * @param {string} langKey A language key.
   *
   */
  this.preferredLanguage = function(langKey) {
    if (langKey) {
      $preferredLanguage = langKey;
    } else {
      return $preferredLanguage;
    }
  };

   /**
   * @ngdoc function
   * @name translate.$translateProvider#fallbackLanguage
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells the module which of the registered translation tables to use when missing translations
   * at initial startup by passing a language key. Similar to `$translateProvider#uses`
   * only that it says which language to **fallback**.
   *
   * @param {string} langKey A language key.
   *
   */
  this.fallbackLanguage = function(langKey) {
    if (langKey) {
      $fallbackLanguage = langKey;
    } else {
      return $fallbackLanguage;
    }
  };


 /**
   * @ngdoc function
   * @name translate.$translateProvider#uses
   * @methodOf translate.$translateProvider
   *
   * @description
   * Set which translation table to use for translation by given language key. When
   * trying to 'use' a language which isn't provided, it'll throw an error.
   *
   * You actually don't have to use this method since `$translateProvider#preferredLanguage`
   * does the job too.
   *
   * @param {string} langKey A language key.
   *
   */
  this.uses = function (langKey) {
    if (langKey) {
      if (!$translationTable[langKey] && (!$loaderFactory)) {
        // only throw an error, when not loading translation data asynchronously
        throw new Error("$translateProvider couldn't find translationTable for langKey: '" + langKey + "'");
      }
      $uses = langKey;
    } else {
      return $uses;
    }
  };

 /**
   * @ngdoc function
   * @name translate.$translateProvider#storageKey
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells the module which key must represent the choosed language by a user in the storage.
   *
   * @param {string} key A key for the storage.
   *
   */
  var storageKey = function(key) {
    if (!key) {
      if ($storagePrefix) {
        return $storagePrefix + $storageKey;
      }
      return $storageKey;
    }
    $storageKey = key;
  };

  this.storageKey = storageKey;

  /**
   * @ngdoc function
   * @name translate.$translateProvider#useUrlLoader
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateUrlLoader` extension service as loader.
   *
   * @param {string} url Url
   */
  this.useUrlLoader = function (url) {
    this.useLoader('$translateUrlLoader', { url: url });
  };

  /**
   * @ngdoc function
   * @name translate.$translateProvider#useStaticFilesLoader
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateStaticFilesLoader` extension service as loader.
   *
   * @param {Object=} options Optional configuration object
   */
  this.useStaticFilesLoader = function (options) {
    this.useLoader('$translateStaticFilesLoader', options);
  };

  /**
   * @ngdoc function
   * @name translate.$translateProvider#useLoader
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use any other service as loader.
   *
   * @param {string} loaderFactory Factory name to use
   * @param {Object=} options Optional configuration object
   */
  this.useLoader = function (loaderFactory, options) {
    $loaderFactory = loaderFactory;
    $loaderOptions = options;
  };

  /**
   * @ngdoc function
   * @name translate.$translateProvider#useLocalStorage
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateLocalStorage` service as storage layer.
   *
   */
  this.useLocalStorage = function () {
    this.useStorage('$translateLocalStorage');
  };

  /**
   * @ngdoc function
   * @name translate.$translateProvider#useCookieStorage
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateCookieStorage` service as storage layer.
   *
   */
  this.useCookieStorage = function () {
    this.useStorage('$translateCookieStorage');
  };

  /**
   * @ngdoc function
   * @name translate.$translateProvider#useStorage
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use custom service as storage layer.
   *
   */
  this.useStorage = function (storageFactory) {
    $storageFactory = storageFactory;
  };

  /**
   * @ngdoc function
   * @name translate.$translateProvider#storagePrefix
   * @methodOf translate.$translateProvider
   *
   * @description
   * Sets prefix for storage key.
   *
   * @param {string} prefix Storage key prefix
   */
  this.storagePrefix = function (prefix) {
    if (!prefix) {
      return prefix;
    }
    $storagePrefix = prefix;
  };

  /**
   * @ngdoc function
   * @name translate.$translateProvider#useMissingTranslationHandlerLog
   * @methodOf translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use built-in log handler when trying to translate
   * a translation Id which doesn't exist.
   *
   * This is actually a shortcut method for `useMissingTranslationHandler()`.
   *
   */
  this.useMissingTranslationHandlerLog = function () {
    this.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
  };

  /**
   * @ngdoc function
   * @name translate.$translateProvider#useMissingTranslationHandler
   * @methodOf translate.$translateProvider
   *
   * @description
   * Expects a factory name which later gets instantiated with `$injector`.
   * This method can be used to tell angular-translate to use a custom
   * missingTranslationHandler. Just build a factory which returns a function
   * and expects a translation id as argument.
   *
   * Example:
   * <pre>
   *  app.config(function ($translateProvider) {
   *    $translateProvider.useMissingTranslationHandler('customHandler');
   *  });
   *
   *  app.factory('customHandler', function (dep1, dep2) {
   *    return function (translationId) {
   *      // something with translationId and dep1 and dep2
   *    };
   *  });
   * </pre>
   *
   * @param {string} factory Factory name
   */
  this.useMissingTranslationHandler = function (factory) {
    $missingTranslationHandlerFactory = factory;
  };

  /**
   * @ngdoc object
   * @name translate.$translate
   * @requires $interpolate
   * @requires $log
   * @requires $rootScope
   * @requires $q
   *
   * @description
   * The `$translate` service is the actual core of angular-translate. It excepts a translation id
   * and optional interpolate parameters to translate contents.
   *
   * <pre>
   *  $scope.translatedText = $translate('HEADLINE_TEXT');
   * </pre>
   *
   * @param {string} translationId A token which represents a translation id
   * @param {object=} interpolateParams An object hash for dynamic values
   */
  this.$get = [
    '$interpolate',
    '$log',
    '$injector',
    '$rootScope',
    '$q',
    function ($interpolate, $log, $injector, $rootScope, $q) {

    var Storage;

    if ($storageFactory) {
      Storage = $injector.get($storageFactory);

      if (!Storage.get || !Storage.set) {
        throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or set() method!');
      }
    }

    var $translate = function (translationId, interpolateParams) {
      var table = $uses ? $translationTable[$uses] : $translationTable;

      if (table && table.hasOwnProperty(translationId)) {
        return $interpolate(table[translationId])(interpolateParams);
      }

      if ($missingTranslationHandlerFactory) {
        $injector.get($missingTranslationHandlerFactory)(translationId);
      }

      if ($uses && $fallbackLanguage && $uses !== $fallbackLanguage){
        var translation = $translationTable[$fallbackLanguage][translationId];
        if (translation) {
          return $interpolate(translation)(interpolateParams);
        }
      }

      return translationId;
    };

    /**
     * @ngdoc function
     * @name translate.$translate#preferredLanguage
     * @methodOf translate.$translate
     *
     * @description
     * Returns the language key for the preferred language.
     *
     * @return {string} preferred language key
     */
    $translate.preferredLanguage = function () {
      return $preferredLanguage;
    };
    /**
     * @ngdoc function
     * @name translate.$translate#fallbackLanguage
     * @methodOf translate.$fallbackLanguage
     *
     * @description
     * Returns the language key for the fallback language.
     *
     * @return {string} fallback language key
     */
    $translate.fallbackLanguage = function () {
      return $fallbackLanguage;
    };


    /**
     * @ngdoc function
     * @name translate.$translate#storage
     * @methodOf translate.$translate
     *
     * @description
     * Returns registered storage.
     *
     * @return {object} Storage
     */
    $translate.storage = function () {
      return Storage;
    };

    /**
     * @ngdoc function
     * @name translate.$translate#uses
     * @methodOf translate.$translate
     *
     * @description
     * Tells angular-translate which language to uses by given language key. This method is
     * used to change language at runtime. It also takes care of storing the language
     * key in a configured store to let your app remember the choosed language.
     *
     * When trying to 'use' a language which isn't available it tries to load it
     * asynchronously with registered loaders.
     *
     * @param {string} key Language key
     * @return {string} Language key
     */
    $translate.uses = function (key) {

      if (!key) {
        return $uses;
      }

      var deferred = $q.defer();

      if (!$translationTable[key]) {

        $injector.get($loaderFactory)(angular.extend($loaderOptions, {
          key: key
        })).then(function (data) {
          $uses = key;
          translations(key, data);

          if ($storageFactory) {
            Storage.set($translate.storageKey(), $uses);
          }
          $rootScope.$broadcast('translationChangeSuccess');
          deferred.resolve($uses);
        }, function (key) {
          $rootScope.$broadcast('translationChangeError');
          deferred.reject(key);
        });

        return deferred.promise;
      }

      $uses = key;

      if ($storageFactory) {
        Storage.set($translate.storageKey(), $uses);
      }

      deferred.resolve($uses);
      $rootScope.$broadcast('translationChangeSuccess');
      return deferred.promise;
    };

    /**
     * @ngdoc function
     * @name translate.$translate#storageKey
     * @methodOf translate.$translate
     *
     * @description
     * Returns the key for the storage.
     *
     * @return {string} storage key
     */
    $translate.storageKey = function() {
      return storageKey();
    };

    // If at least one async loader is defined and there are no (default) translations available
    // we should try to load them.
    if ($loaderFactory && angular.equals($translationTable, {})) {
      $translate.uses($translate.uses());
    }

    return $translate;
  }];
}]);
