angular.module('app', ['ngTranslate'])
    .config(['$translateProvider', function($translateProvider){

      $translateProvider.registerLoader(function(key, $injector){
        var $http = $injector.get('$http'), 
        $q = $injector.get('$q'), deferred = $q.defer();

        $http({
          url : 'lang_' + key + '.json',
          method : 'GET',
          headers : {'X-DEBUG' : 'true'}
        }).success(function (data, status) {
          // TODO transformer?
          deferred.resolve(data);
        }).error(function (data, status) {
          deferred.reject(key);
        });

        return deferred.promise;
      });
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