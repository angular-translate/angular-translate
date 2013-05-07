angular.module('app', ['ngTranslate'])

.config(['$translateProvider', function($translateProvider){
  $translateProvider.registerLoader({
    type: 'static-files',
    prefix: 'languages/ns_lang_',
    suffix: '.json'
  });
  $translateProvider.uses('de_DE');
}])

.controller('ctrl', function ($translate, $scope){
  $scope.tlData = {
    randomValue : 42
  };
  $scope.selectLang = function(key) {
    // "Click" invokes an implicit $scope.$apply
    $translate.uses(key);
    $scope.tlData.randomValue = Math.round(1000 * Math.random());
  }
});
