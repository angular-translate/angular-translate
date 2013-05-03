angular.module('app', ['ngTranslate'])

.config(['$translateProvider', function($translateProvider){
  $translateProvider.registerLoader('lang.json');
  $translateProvider.uses('de_DE');
}])

.controller('ctrl', function ($translate, $scope){
  $scope.tlData = {
    randomValue : 42
  };
  $scope.selectLang = function(key) {
    // "Click" invokes an implicit $scope.$apply
    $scope.tlData.randomValue = Math.round(1000 * Math.random());
    $translate.uses(key);
  }
});
