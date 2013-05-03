angular.module('ngTranslate', ['ng', 'ngCookies'])

.run(['$translate', '$COOKIE_KEY', '$cookieStore', function ($translate, $COOKIE_KEY, $cookieStore) {

  if ($translate.rememberLanguage()) {
    if (!$cookieStore.get($COOKIE_KEY)) {
      $cookieStore.put($COOKIE_KEY, $translate.uses());
    } else {
      $translate.uses($cookieStore.get($COOKIE_KEY));
    }
  }
}]);

angular.module('ngTranslate').constant('$COOKIE_KEY', 'NG_TRANSLATE_LANG_KEY');

angular.module('ngTranslate').provider('$translate', function () {

  var $translationTable = {},
      $uses,
      $rememberLanguage = false,
      $asyncLoaders = [];

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

  this.translations = function (langKey, translationTable) {

    if (!langKey && !translationTable) {
      return $translationTable;
    }

    if (langKey && !translationTable) {
      if (angular.isString(langKey)) {
        return $translationTable[langKey];
      } else {
        $translationTable = langKey;
      }
    } else {
      $translationTable[langKey] = translationTable;
    }
  };

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

  this.rememberLanguage = function (boolVal) {
    if (angular.isUndefined(boolVal)) {
      return $rememberLanguage;
    }
    $rememberLanguage = boolVal;
  };

  // Register a loader which creates loader functions.
  // For more details, see https://github.com/PascalPrecht/ng-translate/wiki/Asynchronous-loading#registering-asynchronous-loaders
  this.registerLoader = function (loader) {

    var $loader;

    // Unless it is a function (or an array in case of a dependency injected function),
    // this will try to match some internal built-in strategies for the specified loader.
    if (!(angular.isFunction(loader) || angular.isArray(loader))) {

      // Defined convenient shortcut: If the loader is only a string, we should use the
      // built-in template "url".
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
      // The loader is a custom function (or array), so go for it.
      $loader = loader;
    }
    $asyncLoaders.push($loader);
  };

  // Using the first registered loader function this invokes the generated loader
  // function and applies the resolved data. Regardless of the result of the loader
  // function (it should be a promise, but do not have to be), the result will
  // be wrapped with a promise.
  var invokeLoading = function($injector, key) {

    var deferred = $injector.get('$q').defer(),
        loaderFn = $injector.invoke($asyncLoaders[0]);

    loaderFn(key).then(function (data) {
      $translationTable[key] = data;
      deferred.resolve(data);
    }, function (key) {
      deferred.reject(key);
    });
    return deferred.promise;
  };

  this.$get = [
    '$interpolate',
    '$log',
    '$injector',
    '$cookieStore',
    '$rootScope',
    '$q',
    '$COOKIE_KEY',
    function ($interpolate, $log, $injector, $cookieStore, $rootScope, $q, $COOKIE_KEY) {

    $translate = function (translationId, interpolateParams) {
      var translation = ($uses) ?
        ($translationTable[$uses] ? $translationTable[$uses][translationId] : translationId) :
        $translationTable[translationId];
      if (translation) {
        return $interpolate(translation)(interpolateParams);
      }

      $log.warn("Translation for " + translationId + " doesn't exist");
      return translationId;
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
            $cookieStore.put($COOKIE_KEY, $uses);
          }
          // Notify all translate-directives the language has been changed.
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
        $cookieStore.put($COOKIE_KEY, $uses);
      }

      deferred.resolve($uses);
      $rootScope.$broadcast('translationChangeSuccess');
      return deferred.promise;
    };

    $translate.rememberLanguage = function () {
      return $rememberLanguage;
    };

    // If at least one async loader is defined and there are no (default) translations available
    // we should try to load them.
    if ($asyncLoaders.length && angular.equals($translationTable, {})) {
      $translate.uses($translate.uses());
    }

    return $translate;
  }];
});
