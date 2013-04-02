angular.module('ngTranslate', ['ng'])

.config(['$provide', function ($provide) {

  $TranslateProvider = function () {

    var $translationTable = {},
        $uses;

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

    this.$get = ['$interpolate', '$log', function ($interpolate, $log) {

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
      return $translate;
    }];
  };

  $provide.provider('$translate', $TranslateProvider);
}]);
