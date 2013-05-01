angular.module('app', ['ngTranslate'])
    .constant('$autoloadOnStartup', true)
    .config(['$translateProvider', function($translateProvider){
      $translateProvider.registerLoader('lang.json');
    }])
    .controller('ctrl', function ($translate, $scope){
      $scope.tlData = {
        randomValue : 42
      };
      $scope.selectLang = function(key) {
        // "Click" invokes an implicit $scope.$apply
        setTimeout(function(){
          $scope.tlData.randomValue = Math.round(1000 * Math.random());
          $translate.uses(key);
        }, 1);
      }
    });
