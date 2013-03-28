angular.module('ngTranslate', ['ng'])

.config(['$provide', function ($provide) {

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
