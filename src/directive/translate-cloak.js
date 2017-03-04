angular.module('pascalprecht.translate')
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translateCloak
 * @requires $translate
 * @restrict A
 *
 * $description
 * Adds a `translate-cloak` class name to the given element where this directive
 * is applied initially and removes it, once a loader has finished loading.
 *
 * This directive can be used to prevent initial flickering when loading translation
 * data asynchronously.
 *
 * The class name is defined in
 * {@link pascalprecht.translate.$translateProvider#cloakClassName $translate.cloakClassName()}.
 *
 * @param {string=} translate-cloak If a translationId is provided, it will be used for showing
 *                                  or hiding the cloak. Basically it relies on the translation
 *                                  resolve.
 */
.directive('translateCloak', translateCloakDirective);

function translateCloakDirective($translate, $rootScope) {

  'use strict';

  return {
    compile : function (tElement) {
      var applyCloak = function (element) {
          element.addClass($translate.cloakClassName());
        },
        removeCloak = function (element) {
          element.removeClass($translate.cloakClassName());
        };
      applyCloak(tElement);

      return function linkFn(scope, iElement, iAttr) {
        //Create bound functions that incorporate the active DOM element.
        var iRemoveCloak = removeCloak.bind(this, iElement), iApplyCloak = applyCloak.bind(this, iElement);
        if (iAttr.translateCloak && iAttr.translateCloak.length) {
          // Register a watcher for the defined translation allowing a fine tuned cloak
          iAttr.$observe('translateCloak', function (translationId) {
            $translate(translationId).then(iRemoveCloak, iApplyCloak);
          });
          $rootScope.$on('$translateChangeSuccess', function () {
            $translate(iAttr.translateCloak).then(iRemoveCloak, iApplyCloak);
          });
        } else {
          $translate.onReady(iRemoveCloak);
        }
      };
    }
  };
}

translateCloakDirective.displayName = 'translateCloakDirective';
