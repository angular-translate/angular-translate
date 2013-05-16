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
 * @name pascalprecht.translate.$translateProvider
 * @description
 *
 * $tranlateProvider allows developers to register translation-tables, asynchronous loaders
 * and similar to configure translation behavior directly inside of a module.
 *
 */
angular.module('pascalprecht.translate').provider('$translate', ['$STORAGE_KEY', function ($STORAGE_KEY) {

  var $translationTable = {},
      $preferredLanguage,
      $uses,
      $storageFactory,
      $storageKey = $STORAGE_KEY,
      $storagePrefix,
      $missingTranslationHandlerFactory,
      $asyncLoaders = [],
      NESTED_OBJECT_DELIMITER = '.';

  var LoaderGenerator = {
    // Creates a loading function for a typical dynamic url pattern: "locale.php?lang=en_US",
    // "locale.php?lang=de_DE", etc. Prefixing the specified url, the current requested
    // language id will be applied with "?lang={key}". Using this builder, the response of
    // these urls must be an object of key-value pairs.
    forUrl : function (url) {
      return ['$http', '$q', function ($http, $q) {
        return function(key) {

         var deferred = $q.defer();

          $http({
            url: url,
            params: {lang: key},
            method : 'GET'
          }).success(function (data, status) {
            deferred.resolve(data);
          }).error(function (data, status) {
            deferred.reject(key);
          });

          return deferred.promise;
        };
      }];
    },

    // Creates a loading function for a typical static file url pattern: "lang-en_US.json",
    // "lang-de_DE.json", etc.   Using this builder, the response of these urls must be an
    // object of key-value pairs.
    byStaticFiles : function (prefix, suffix) {
      return ['$http', '$q', function ($http, $q) {
        return function(key) {

          var deferred = $q.defer();

          $http({
            url: [prefix, key, suffix].join(''),
            method : 'GET',
            params: ''
          }).success(function (data, status) {
            deferred.resolve(data);
          }).error(function (data, status) {
            deferred.reject(key);
          });

          return deferred.promise;
        };
      }];
    }
  };

 /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#translations
   * @methodOf pascalprecht.translate.$translateProvider
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

  // Using the first registered loader function this invokes the generated loader
  // function and applies the resolved data. Regardless of the result of the loader
  // function (it should be a promise, but do not have to be), the result will
  // be wrapped with a promise.
  var invokeLoading = function($injector, key) {

    var deferred = $injector.get('$q').defer(),
        loaderFnBuilder = $asyncLoaders[0],
        loaderFn;

    if (loaderFnBuilder) {
      loaderFn = $injector.invoke(loaderFnBuilder);
      if (angular.isFunction(loaderFn)) {
        loaderFn(key).then(function (data) {
          translations(key, data);
          deferred.resolve(data);
        }, function (key) {
          deferred.reject(key);
        });
      } else {
        deferred.reject(key);
      }
    } else {
      deferred.reject(key);
    }

    return deferred.promise;
  };

  this.translations = translations;

 /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#preferredLanguage
   * @methodOf pascalprecht.translate.$translateProvider
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
   * @name pascalprecht.translate.$translateProvider#uses
   * @methodOf pascalprecht.translate.$translateProvider
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
      if (!$translationTable[langKey] && (!$asyncLoaders.length)) {
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
   * @name pascalprecht.translate.$translateProvider#storageKey
   * @methodOf pascalprecht.translate.$translateProvider
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
   * @name pascalprecht.translate.$translateProvider#registerLoader
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * To load your data from a server you have to register an asynchronous loader,
   * which gets invoked later at runtime when it's needed. There are three possible
   * ways to register a loader via $translateProvider.registerLoader().
   *
   * ### Register loader via URL string
   *
   * This is possibly the simplest way of loading translation data asynchronously.
   * All you have to do, is to register a valid endpoint which later gets requested
   * by angular-translate. Here's an example:
   *
   * <pre>
   *  $translateProvider.registerLoader('foo/bar.json');
   *  $translateProvider.preferredLanguage('en_US');
   * </pre>
   *
   * angular-translate transforms the registered loader (which is actually just a string),
   * to a real loader function which can be invoked later at runtime. In addition to that,
   * telling $translateProvider to use the language key 'en_US', adds the language
   * key as request parameter to the given loader string. So, the example above actually
   * requests `foo/bar.json?lang=en_US.`
   *
   * If there isn't any translation table available at startup and any asynchronous
   * loader is registered, angular-translate invokes the loader immediately.
   *
   * ### Register loader as static files
   *
   * In case you haven't just a URL which expects a lang parameter to return a JSON
   * that contains your translations, but several localization files which match a
   * specific pattern, you can register a loader which describes the pattern of your
   * localization files.
   *
   * To specify a pattern, the following information is required:
   *
   *  * **type** - specifies loader type
   *  * **prefix** - specifies file prefix
   *  * **suffix** - specifies file suffix
   *
   * <pre>
   *  $translateProvider.registerLoader({
   *    type: 'static-files',
   *    prefix: 'locale-',
   *    suffix: '.json'
   *  });
   *  $translateProvider.preferredLanguage('en_US');
   * </pre>
   *
   * This will load locale-en_US.json. And again, since there isn't any translation
   * data available yet, it'll load as soon as possible automatically.
   *
   * ### Register loader function
   *
   * If non of the above possibilities fit to your needs, you can register an asynchronous
   * loader as a factory function. The factory function uses the Angular style annotation
   * for dependency injection. Which means, you can either just pass a function with
   * its dependencies, or an annotated array where the last value represents the actual
   * factory function.
   *
   * The factory function has to return a function, which expects a language key as
   * parameter. With this architecture you're as free as possible and have the full
   * control of how your asynchronous loader should behave.
   *
   * <pre>
   *  $translateProvider.registerLoader(function ($http, $q) {
   *    // return loaderFn
   *    return function (key) {
   *      var deferred = $q.defer();
   *      // do something with $http, $q and key to load localization files
   *
   *      var data = {
   *        'TEXT': 'Fooooo'
   *      };
   *
   *      return deferred.resolve(data);
   *      // or
   *      return deferred.reject(key);
   *    };
   *  });
   * </pre>
   *
   * You also have to make sure, that your loader function returns a promise. It should
   * either gets resolved with your translation data, or rejected with the language key.
   *
   * @param {function | string} loader A string or a function with its dependencies
   *
   */
  this.registerLoader = function (loader) {

    if (!loader) {
      throw new Error("Please define a valid loader!");
    }

    var $loader;

    if (!(angular.isFunction(loader) || angular.isArray(loader))) {
      if (angular.isString(loader)) {
        loader = {
          type : 'url',
          url : loader
        };
      }

      switch (loader.type) {
        case 'url':
          $loader = LoaderGenerator.forUrl(loader.url);
          break;
        case 'static-files':
          $loader = LoaderGenerator.byStaticFiles(loader.prefix, loader.suffix);
          break;
      }
    } else {
      $loader = loader;
    }
    $asyncLoaders.push($loader);
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#registerLoaderFactory
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Shortcut method for `$translateProvider#registerLoader`.
   *
   * @param {function | string} loader A string or a function with its dependencies
   *
   */
  this.useLoaderFactory = function (loader) {
    this.registerLoader(loader);
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useLocalStorage
   * @methodOf pascalprecht.translate.$translateProvider
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
   * @name pascalprecht.translate.$translateProvider#useCookieStorage
   * @methodOf pascalprecht.translate.$translateProvider
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
   * @name pascalprecht.translate.$translateProvider#useStorage
   * @methodOf pascalprecht.translate.$translateProvider
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
   * @name pascalprecht.translate.$translateProvider#storagePrefix
   * @methodOf pascalprecht.translate.$translateProvider
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
   * @name pascalprecht.translate.$translateProvider#useMissingTranslationHandlerLog
   * @methodOf pascalprecht.translate.$translateProvider
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
   * @name pascalprecht.translate.$translateProvider#useMissingTranslationHandler
   * @methodOf pascalprecht.translate.$translateProvider
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
   * @ngdoc function
   * @name pascalprecht.translate.$translate
   * @requires $interpolate
   * @requires $log
   * @requires $rootScope
   * @requires $q
   *
   * @desription
   * The `$translate` service is the actual core of angular-translate. It excepts a translation id
   * and optional interpolate parameters to translate contents.
   *
   * <pre>
   *  $scope.translatedText = $translate('HEADLINE_TEXT');
   * </pre>
   *
   * @param {string} translationId A token which represents a translation id
   * @param {object} interpolateParams An object hash for dynamic values
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
      var translation = ($uses) ?
        ($translationTable[$uses] ? $translationTable[$uses][translationId] : translationId) :
        $translationTable[translationId];
      if (translation) {
        return $interpolate(translation)(interpolateParams);
      }

      if ($missingTranslationHandlerFactory) {
        $injector.get($missingTranslationHandlerFactory)(translationId);
      }

      return translationId;
    };

    /**
     * @ngdoc function
     * @name pascalprecht.translate.$translate#preferredLanguage
     * @methodOf pascalprecht.translate.$translate
     *
     * @description
     * Returns the language key for the preferred language.
     *
     * @return {string} preferred language key
     */
    $translate.preferredLanguage = function() {
        return $preferredLanguage;
    };

    /**
     * @ngdoc function
     * @name pascalprecht.translate.$translate#storage
     * @methodOf pascalprecht.translate.$translate
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
     * @name pascalprecht.translate.$translate#uses
     * @methodOf pascalprecht.translate.$translate
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
        invokeLoading($injector, key).then(function (data) {
          $uses = key;

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
     * @name pascalprecht.translate.$translate#storageKey
     * @methodOf pascalprecht.translate.$translate
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
    if ($asyncLoaders.length && angular.equals($translationTable, {})) {
      $translate.uses($translate.uses());
    }

    return $translate;
  }];
}]);
