angular.module('app', ['ngTranslate'])
    .config(['$translateProvider', function($translateProvider){
      $translateProvider.registerLoader({type: 'static-files', prefix: 'languages/lang_', suffix: '.json'});
    }])
    .controller('ctrl', function ($translate, $scope){
      $scope.tlData = {
        randomValue : 42
      };
      $scope.selectLang = function(key) {
        $scope.tlData.randomValue = Math.round(1000 * Math.random());
        $translate.uses(key);
      }
    });

angular.module('ngTranslate')
    .value('$ignoreInvalid', true);