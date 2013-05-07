angular.module('app', ['ngTranslate'])

.config(['$translateProvider', function($translateProvider){

  $translateProvider.translations('de_DE', {
    "HEADER" : "Überschrift",
    "SUBHEADER" : "2. Überschrift",
    "TEXT" : "<em>{{randomValue}}</em> ist die Antwort auf das Leben, das Universum und der ganzen Rest."
  });

  $translateProvider.registerLoader(function ($http, $q){
    return function (key) {
      var deferred = $q.defer();

      $http({
        url : 'lang_' + key + '.json',
        method : 'GET',
        headers : {'X-DEBUG' : 'true'}
      }).success(function (data, status) {
        // Remap data because ng-translate look up for a key/items combo.
        deferred.resolve(data);
      }).error(function (data, status) {
        deferred.reject(key);
      });

      return deferred.promise;
    };
  });

  $translateProvider.preferredLanguage('de_DE');
}])

.controller('ctrl', function ($translate, $scope){
  $scope.tlData = {
    randomValue : 42
  };
  $scope.selectLang = function (key) {
    // "Click" invokes an implicit $scope.$apply
    $translate.uses(key).then(function () {
      $scope.tlData.randomValue = Math.round(1000 * Math.random());
    });
  }
});
