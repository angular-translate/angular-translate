angular.module('app', ['ngTranslate'])
    .constant('$autoloadOnStartup', true)
    .constant('$DEFAULT_LANG_KEY', 'de_DE')
    .constant('$useBracketsUnlessFound', true)
    .config(['$translateProvider', function($translateProvider){

      $translateProvider.registerLoader(function ($http, $q){
        return function (key) {
          var deferred = $q.defer();

          $http({
            url : 'lang_' + key + '.json',
            method : 'GET',
            headers : {'X-DEBUG' : 'true'}
          }).success(function (data, status) {
            // Remap data because ng-translate look up for a key/items combo.
            deferred.resolve({key: key, items: data});
          }).error(function (data, status) {
            deferred.reject({key: key});
          });

          return deferred.promise;
        };
      });
    }])
    .controller('ctrl', function ($translate, $scope){
      $scope.tlData = {
        randomValue : 42
      };
      $scope.selectLang = function (key) {
        // "Click" invokes an implicit $scope.$apply
        setTimeout(function(){
          $translate.uses(key).then(function () {
            $scope.tlData.randomValue = Math.round(1000 * Math.random());
          });
        }, 1);
      }
    });
