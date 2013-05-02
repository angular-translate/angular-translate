angular.module('ngTranslate').constant('$COOKIE_KEY', 'NG_TRANSLATE_LANG_KEY');
angular.module('ngTranslate').constant('$DEFAULT_LANG_KEY', null);
angular.module('ngTranslate').constant('$autoloadOnStartup', false);
angular.module('ngTranslate').constant('$useBracketsUnlessFound', false);

angular.module('ngTranslate').provider('$translate', function () {

  var $translationTable = {refreshedAt: new Date().getTime()},
      $uses,
      $rememberLanguage = false,
      $asyncLoaders = [],
      $loading = false;

  // The following built-in loader generators provide a set of convenient, neat functions
  // building a dynamic and asynchronous loaders.
  var LoaderGenerator = {

    // Usage: $provider.registerLoader('locales.json') => locales.json?lang=en_US
    // Usage: $provider.registerLoader({type: 'url', url: 'locales.json'}) => locales.json?lang=en_US
    forUrl : function (url) {
      return ['$http', '$q', function ($http, $q) {
        return function(key) {
         var deferred = $q.defer();

          $http({
            url : url,
            params : {
              lang : key
            },
            method : 'GET'
          }).success(function (data, status) {
            deferred.resolve({key: key, items: data});
          }).error(function (data, status) {
            deferred.reject({key: key});
          });

          return deferred.promise;
        };
      }];
    },

    // Usage: $provider.registerLoader({type: 'static-files', prefix: 'locales_', suffix: '.json'})
    byStaticFiles : function (prefix, suffix) {
      return ['$http', '$q', function ($http, $q) {
        return function(key) {
          var deferred = $q.defer();

          $http({
            url : prefix + key + suffix,
            method : 'GET'
          }).success(function (data, status) {
            deferred.resolve({key: key, items: data});
          }).error(function (data, status) {
            deferred.reject({key: key});
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

  // TODO: Only for testing?
  this.uses = function (langKey) {
    if (langKey) {
      if (!$translationTable[langKey] && (!$asyncLoaders.length)) {
        throw new Error("$translateProvider couldn't find translationTable for langKey: '" + langKey + "'");
      }
      $uses = langKey;
    } else {
      return $uses;
    }
  };

  // TODO: Only for testing?
  this.rememberLanguage = function (boolVal) {
    if (angular.isUndefined(boolVal)) {
      return $rememberLanguage;
    }
    $rememberLanguage = boolVal;
  };

  /**
   *
   */
  this.registerLoader = function (loader) {

    var $loader;

    // Either the loader is a function or this is an array where the last item is a function.
    if (angular.isFunction(loader) || (angular.isArray(loader) && angular.isFunction(loader[loader.length - 1]))) {
      $loader = loader;

    } else {

      // Transform some shortcuts into the defined structure.
      if (angular.isString(loader)) {
        loader = {
          type : 'url',
          url : loader
        };
      }

      if (angular.isObject(loader) && typeof(loader.type) !== 'undefined') {
        switch (loader.type) {
        case 'url':
          $loader = LoaderGenerator.forUrl(loader.url);
          break;
        case 'static-files':
          $loader = LoaderGenerator.byStaticFiles(loader.prefix, loader.suffix);
          break;
        }
      }
    }

    if (!$loader) {
      // FIXME no console
      console.log('Currently, the type of loader is not supported.', Object.prototype.toString.call(loader));
    }

    $asyncLoaders.push($loader);
  };

  var invokeLoading = function($injector, key) {
    var $log = $injector.get('$log');

    if ($loading) {
      // TODO
      $log.warn('Already loading');
      return;
    }

    var promise, $loader = $asyncLoaders[0],
        onSuccess = function (data) {
          if (data.key === key && data.items) {
            $translationTable[key] = data.items;
          } else {
            $translationTable[key] = data;
          }
          // Mark the table object as being refreshed.
          $translationTable.refreshedAt = new Date().getTime();
          $loading = false; // Uncheck loading indicator.
        }, onError = function (key) {
          // TODO
          // Mark the table object as being refreshed.
          $translationTable.refreshedAt = new Date().getTime();
          $loading = false; // Uncheck loading indicator.
        };

    if ($loader) {
      var $loaderFn;
      try {
        $loaderFn = $injector.invoke($loader);
        $loading = true;
        promise = $loaderFn(key).then(onSuccess, onError);
      } catch (e) {
        // In general, this happens if the loader does not return a injector-function.
        if (e.message === 'Unknown provider: keyProvider <- key') {
          throw new Error("The provided loader must return a function.");
        } else {
          // Unknown
          throw e;
        }
      }
    }

    // Always return a promise.
    return $injector.get('$q').when(promise || false);
  };

  this.$get = ['$interpolate', '$log', '$injector', '$cookieStore', '$COOKIE_KEY', '$autoloadOnStartup', '$useBracketsUnlessFound', '$DEFAULT_LANG_KEY', '$q', function ($interpolate, $log, $injector, $cookieStore, $COOKIE_KEY, $autoloadOnStartup, $useBracketsUnlessFound, $DEFAULT_LANG_KEY, $q) {

    $translate = function (translationId, interpolateParams) {
      var translation = ($uses) ?
        ($translationTable[$uses] ? $translationTable[$uses][translationId] : translationId) :
        $translationTable[translationId];

      if (translation) {
        return $interpolate(translation)(interpolateParams);
      }
      $log.warn("Translation for " + translationId + " doesn't exist");

      // TWEAK: Under some circumstances it can be helpful to highlight unresolved translations.
      if ($useBracketsUnlessFound) {
        return '{{' + translationId + '}}';
      }

      return translationId;
    };

    $translate.uses = function (key) {

      // Getter behavior.
      if (!key) {
        return $uses;
      }

      // Else: Setter behavior.
      var promise;
      if (!$translationTable[key]) {
        promise = invokeLoading($injector, key).then(function () {
          // Store the selected language key.
          $uses = key;
          // Store remember if required.
          if ($rememberLanguage) {
            $cookieStore.put($COOKIE_KEY, $uses);
          }
        });
      } else {
        // Mark the table object as being refreshed.
        $translationTable.refreshedAt = new Date().getTime();
        // Store the selected language key.
        $uses = key;
        // Store remember if required.
        if ($rememberLanguage) {
          $cookieStore.put($COOKIE_KEY, $uses);
        }
        promise = $q.when(key);
      }

      // Return a promise for chaining purposes.
      return promise;
    };

    $translate.rememberLanguage = function () {
      return $rememberLanguage;
    };

    // TODO: Only for testing?
    $translate.loaders = function () {
      return $asyncLoaders;
    };

    if ($autoloadOnStartup) {
      var currentKey = $translate.uses();
      if (!currentKey) {
        currentKey = $DEFAULT_LANG_KEY;
      }
      if (currentKey) {
        $translate.uses(currentKey);
      }
    }

    return $translate;
  }];
});
