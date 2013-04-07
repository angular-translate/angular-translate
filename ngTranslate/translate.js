angular.module('ngTranslate', ['ng', 'ngCookies'])

.run(['$translate', '$COOKIE_KEY', '$cookieStore', function ($translate, $COOKIE_KEY, $cookieStore) {

  if ($translate.rememberLanguage()) {
    if (!$cookieStore.get($COOKIE_KEY)) {
      $cookieStore.put($COOKIE_KEY, $translate.uses());
    } else {
      $translate.uses($cookieStore.get($COOKIE_KEY));
    }
  }
}]);
