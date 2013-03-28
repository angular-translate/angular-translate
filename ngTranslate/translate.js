angular.module('ngTranslate', ['ng']).config(['$provide', function ($provide) {

  $TranslateProvider = function () {

    $translationTable = {};

    this.translations = function (translationTable) {
      if (translationTable) {
        $translationTable = translationTable;
      } else {
        return $translationTable;
      }
    };

    this.$get = ['$interpolate', function ($interpolate) {

      $translate = function (translationId, interpolateParams) {
        var translation = $translationTable[translationId];

        if (translation) {
          return $interpolate(translation)(interpolateParams);
        }
        return translation;
      };
      return $translate;
    }];
  };

  $provide.provider('$translate', $TranslateProvider);
}]);

angular.module('ngTranslate').filter('translate', ['$parse', '$translate', function ($parse, $translate) {
  return function (translationId, interpolateParams) {
    if (!angular.isObject(interpolateParams)) {
      interpolateParams = $parse(interpolateParams)();
    }
    return $translate(translationId, interpolateParams);
  };
}]);
