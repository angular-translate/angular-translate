angular.module('app', ['ngTranslate'])

.config(['$translateProvider', function($translateProvider){
  $translateProvider.registerLoader(function ($http, $q){
    return function (key) {
      var deferred = $q.defer();

      $http({
        url : 'lang_' + key + '.json',
        method : 'GET',
        headers : {'X-DEBUG' : 'true'}
      }).success(function (data, status) {
        deferred.resolve(data);
      }).error(function (data, status) {
        deferred.reject(key);
      });

      return deferred.promise;
    };
  });
  $translateProvider.preferredLanguage('en_US');
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
