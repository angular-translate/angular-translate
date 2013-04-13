angular.module('ngTranslate').constant('$COOKIE_KEY', 'NG_TRANSLATE_LANG_KEY');

angular.module('ngTranslate').provider('$translate', function () {

  var $translationTable = {},
      $uses,
      supportsLocalStorage = ('localStorage' in window && window['localStorage'] !== null),
      $rememberLanguage = false;

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
      if (!$translationTable[langKey]) {
        throw new Error("$translateProvider couldn't find translationTable for langKey: '" + langKey + "'");
      }
      $uses = langKey;
    } else {
      return $uses;
    }
  };
  
  this.configureFromRemember = function (storage, key) {
    var u, setter='put', getter='get';
    if ('getItem' in storage) {
      setter = 'setItem';
      getter = 'getItem';
    }
    if (!(u = storage[getter](key))) {
      storage[setter](key, this.uses());
    } else {
      this.uses(u);
    }
  }

  this.rememberLanguage = function (boolVal) {
    if (angular.isUndefined(boolVal)) {
      return $rememberLanguage;
    }
    $rememberLanguage = boolVal;
  };

  this.$get = ['$interpolate', '$log', '$cookieStore', '$COOKIE_KEY', function ($interpolate, $log, $cookieStore, $COOKIE_KEY) {

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
        if (supportsLocalStorage) {
          window.localStorage.setItem($COOKIE_KEY, $uses);
        } else {
          $cookieStore.put($COOKIE_KEY, $uses);
        }
      }
    };

    $translate.rememberLanguage = function () {
      return $rememberLanguage;
    };

    return $translate;
  }];
});
