angular.module('ngTranslate').constant('$COOKIE_KEY', 'NG_TRANSLATE_LANG_KEY');

angular.module('ngTranslate').provider('$translate', function () {

  var $translationTable = {},
      $uses,
      $rememberLanguage = false,
      $asyncLoaders = [];

  var makeAsyncLoader = function (fn, key) {
    var loadAsyncFnObject = { loadAsync: fn };
    if (key) {
      loadAsyncFnObject.langKey = key;
    }
    return loadAsyncFnObject;
  };

  var loaderFn = function (url) {
    return ['$http', function ($http) {
      return $http.get(url);
    }];
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

  this.registerLoader = function (key, loaderInstance) {

    var loaderInstanceFn = loaderInstance,
        langKey;

    if (!loaderInstance) {
      loaderInstanceFn = key;
    } else {
      langKey = key;
    }

    if (angular.isString(loaderInstanceFn)) {
      loaderInstanceFn = loaderFn(loaderInstanceFn);
    }
    $asyncLoaders.push(makeAsyncLoader(loaderInstanceFn, langKey));
  };


  this.$get = ['$interpolate', '$log', '$injector', '$cookieStore', '$COOKIE_KEY', function ($interpolate, $log, $injector, $cookieStore, $COOKIE_KEY) {

    $translate = function (translationId, interpolateParams) {
      var translation = ($uses) ? 
        $translationTable[$uses][translationId] : 
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
      $uses = key;
      if ($rememberLanguage) {
        $cookieStore.put($COOKIE_KEY, $uses);
      }
    };

    $translate.rememberLanguage = function () {
      return $rememberLanguage;
    };

    $translate.loaders = function () {
      return $asyncLoaders;
    };

    return $translate;
  }];
});
