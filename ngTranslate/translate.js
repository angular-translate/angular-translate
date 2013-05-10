angular.module('ngTranslate', ['ng', 'ngCookies'])

.run(['$translate', '$STORAGE_KEY', '$cookieStore', function ($translate, $STORAGE_KEY, $cookieStore) {

  if ($translate.rememberLanguage()) {
    if (!$cookieStore.get($STORAGE_KEY)) {

      if (angular.isString($translate.preferredLanguage())) {
        // $translate.uses method will both set up and remember the language in case it's loaded successfully
        $translate.uses($translate.preferredLanguage());
      } else {
        $cookieStore.put($STORAGE_KEY, $translate.uses());
      }

    } else {
      $translate.uses($cookieStore.get($STORAGE_KEY));
    }
  } else if (angular.isString($translate.preferredLanguage())) {
    $translate.uses($translate.preferredLanguage());
  }

}]);

angular.module('ngTranslate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');

/**
 * @ngdoc object
 * @name ngTranslate.$translateProvider
 * @description
 *
 * $tranlateProvider allows developers to register translation-tables, asynchronous loaders
 * and similar to configure translation behavior directly inside of a module.
 *
 */
angular.module('ngTranslate').provider('$translate', function () {

  var $translationTable = {},
      $preferredLanguage,
      $uses,
      $rememberLanguage = false,
      $missingTranslationHandler,
      $asyncLoaders = [],
      NESTED_OBJECT_DELIMITER = '.';

  var LoaderGenerator = {

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
   * @name ngTranslate.$translateProvider#translations
   * @methodOf ngTranslate.$translateProvider
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
        angular.extend($translationTable, langKey);
      }
    } else {
      if (!angular.isObject($translationTable[langKey])) {
        $translationTable[langKey] = {};
      }
      angular.extend($translationTable[langKey], translationTable);
    }
  };

  this.translations = translations;

 /**
   * @ngdoc function
   * @name ngTranslate.$translateProvider#preferredLanguage
   * @methodOf ngTranslate.$translateProvider
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
   * @name ngTranslate.$translateProvider#uses
   * @methodOf ngTranslate.$translateProvider
   *
   * @description
   * Set which translation table to use for translation by given language key. When
   * trying to 'use' a language which isn't provided, it'll throw an error.
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
   * @name ngTranslate.$translateProvider#rememberLanguage
   * @methodOf ngTranslate.$translateProvider
   *
   * @description
   * Tells the module to store the choosed language by a user.
   *
   * @param {bool} boolVal A boolean value.
   *
   */
  this.rememberLanguage = function (boolVal) {
    if (angular.isUndefined(boolVal)) {
      return $rememberLanguage;
    }
    $rememberLanguage = boolVal;
  };

 /**
   * @ngdoc function
   * @name ngTranslate.$translateProvider#missingTranslationHandler
   * @methodOf ngTranslate.$translateProvider
   *
   * @description
   * Registers a custom handler for what's happening if a certain translation doesn't
   * exist. This, by default, logs a warning using `$log` service.
   *
   * @param {function} functionHandler A callback function
   */
  this.missingTranslationHandler = function (functionHandler) {
    if (angular.isUndefined(functionHandler)) {
      return $missingTranslationHandler;
    }
    $missingTranslationHandler = functionHandler;
  };

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

  var invokeLoading = function($injector, key) {

    var deferred = $injector.get('$q').defer(),
        loaderFnBuilder = $asyncLoaders[0],
        loaderFn;

    if (loaderFnBuilder) {
      loaderFn = $injector.invoke(loaderFnBuilder);
      if (angular.isFunction(loaderFn)) {
        loaderFn(key).then(function (data) {
          translations(key, flatObject(data));
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

  this.$get = [
    '$interpolate',
    '$log',
    '$injector',
    '$cookieStore',
    '$rootScope',
    '$q',
    '$STORAGE_KEY',
    function ($interpolate, $log, $injector, $cookieStore, $rootScope, $q, $STORAGE_KEY) {

    var $translate = function (translationId, interpolateParams) {
      var translation = ($uses) ?
        ($translationTable[$uses] ? $translationTable[$uses][translationId] : translationId) :
        $translationTable[translationId];
      if (translation) {
        return $interpolate(translation)(interpolateParams);
      }

      if (!angular.isUndefined($missingTranslationHandler)) {
        $missingTranslationHandler(translationId);
      } else {
        $log.warn("Translation for " + translationId + " doesn't exist");
      }

      return translationId;
    };

    $translate.preferredLanguage = function() {
        return $preferredLanguage;
    };

    $translate.uses = function (key) {

      if (!key) {
        return $uses;
      }

      var deferred = $q.defer();

      if (!$translationTable[key]) {
        invokeLoading($injector, key).then(function (data) {
          $uses = key;

          if ($rememberLanguage) {
            $cookieStore.put($STORAGE_KEY, $uses);
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

      if ($rememberLanguage) {
        $cookieStore.put($STORAGE_KEY, $uses);
      }

      deferred.resolve($uses);
      $rootScope.$broadcast('translationChangeSuccess');
      return deferred.promise;
    };

    $translate.rememberLanguage = function () {
      return $rememberLanguage;
    };

    if ($asyncLoaders.length && angular.equals($translationTable, {})) {
      $translate.uses($translate.uses());
    }

    return $translate;
  }];
});
