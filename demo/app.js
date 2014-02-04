var module = angular.module('app', ['ng', 'pascalprecht.translate']);

module.config(function($translateProvider) {
  /*$translateProvider.translations('en', {
    'hello': 'Hello world!'
  });
  
  $translateProvider.translations('ru', {
    'hello': 'Привет мир!',
    'fallback1': 'Как дела?'
  });
  
  $translateProvider.translations('uk', {
    'hello': 'Привіт світ!',
    'fallback1': 'Як справи?',
    'fallback2': 'Як робота?'
  });*/
  
  $translateProvider.useStaticFilesLoader({
    prefix: 'lang/',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');
  $translateProvider.useFallbackHandler('fallbackHandler');
});

module.factory('fallbackHandler', function() {
  var fallback = 'ru';
  
  return {
    changeFallbacks : function() {
      fallback = (fallback == 'ru') ? 'uk' : 'ru';
    },
  
    getFallback : function(lang) {
      console.log('getFallback is called for ' + lang);
      if (lang == 'en') {
        return fallback;
      } else if (lang == 'ru') {
        return 'uk';
      } else {
        return null;
      }
    }
  }
});

module.controller('AppCtrl', function($scope, $translate, fallbackHandler) {
  $scope.val1 = '---';
  $scope.val2 = '---';
  $scope.val3 = '---';
  
  $scope.translate = function() {
    $translate('hello').then(function(translation){
      $scope.val1 = translation;
    }, function(id) {
      $scope.val1 = id;
    });
    $translate('fallback1').then(function(translation){
      $scope.val2 = translation;
    }, function(id) {
      $scope.val2 = id;
    });
    $translate('fallback2').then(function(translation){
      $scope.val3 = translation;
    }, function(id) {
      $scope.val3 = id;
    });
  };
  
  $scope.changeFallback = function() {
    fallbackHandler.changeFallbacks();
  };
});