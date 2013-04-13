angular.module('ngTranslate', ['ng', 'ngCookies'])

.run(['$translate', '$COOKIE_KEY', '$cookieStore', function ($translate, $COOKIE_KEY, $cookieStore) {

  if ($translate.rememberLanguage()) {
    $translate.configureFromRemember((window.localStorage || $cookieStore), $COOKIE_KEY);
  }
}]);
