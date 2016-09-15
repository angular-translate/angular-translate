angular.module('pascalprecht.translate')
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translate-attr
 * @restrict A
 *
 * @description
 * Translates attributes like translate-attr-ATTR, but with an object like ng-class.
 * Internally it uses `translate` service to translate translation id. It possible to
 * pass an optional `translate-values` object literal as string into translation id.
 *
 * @param {string=} translate-attr Object literal mapping attributes to translation ids.
 * @param {string=} translate-values Values to pass into the translation ids. Can be passed as object literal string.
 *
 * @example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <input translate-attr="{ placeholder: translationId, title: 'WITH_VALUES' }" translate-values="{value: 5}" />

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($translateProvider) {

        $translateProvider.translations('en',{
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}',
        }).preferredLanguage('en');

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
    <file name="scenario.js">
      it('should translate', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';

          element = $compile('<input translate-attr="{ placeholder: translationId, title: 'WITH_VALUES' }" translate-values="{ value: 5 }" />')($rootScope);
          $rootScope.$digest();
          expect(element.attr('placeholder)).toBe('Hello there!');
          expect(element.attr('title)).toBe('The following value is dynamic: 5');
        });
      });
    </file>
   </example>
 */
.directive('translateAttr', translateAttrDirective);
function translateAttrDirective($translate, $rootScope) {

  'use strict';

  return {
    restrict: 'A',
    priority: $translate.directivePriority(),
    link: function linkFn(scope, element, attr) {

      var translateAttr,
          translateValues,
          previousAttributes = {};

      // Main update translations function
      var updateTranslations = function () {
        angular.forEach(translateAttr, function (translationId, attributeName) {
          if (!translationId) {
            return;
          }
          previousAttributes[attributeName] = true;

          // if translation id starts with '.' and translateNamespace given, prepend namespace
          if (scope.translateNamespace && translationId.charAt(0) === '.') {
            translationId = scope.translateNamespace + translationId;
          }
          $translate(translationId, translateValues, attr.translateInterpolation, undefined, scope.translateLanguage)
            .then(function (translation) {
              element.attr(attributeName, translation);
            }, function (translationId) {
              element.attr(attributeName, translationId);
            });
        });

        // Removing unused attributes that were previously used
        angular.forEach(previousAttributes, function (flag, attributeName) {
          if (!translateAttr[attributeName]) {
            element.removeAttr(attributeName);
            delete previousAttributes[attributeName];
          }
        });
      };

      // Watch for attribute changes
      watchAttribute(
        scope,
        attr.translateAttr,
        function (newValue) { translateAttr = newValue; },
        updateTranslations
      );
      // Watch for value changes
      watchAttribute(
        scope,
        attr.translateValues,
        function (newValue) { translateValues = newValue; },
        updateTranslations
      );

      if (attr.translateValues) {
        scope.$watch(attr.translateValues, updateTranslations, true);
      }

      // Replaced watcher on translateLanguage with event listener
      scope.$on('translateLanguageChanged', updateTranslations);

      // Ensures the text will be refreshed after the current language was changed
      // w/ $translate.use(...)
      var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslations);

      updateTranslations();
      scope.$on('$destroy', unbind);
    }
  };
}

function watchAttribute(scope, attribute, valueCallback, changeCallback) {
  'use strict';
  if (!attribute) {
    return;
  }
  if (attribute.substr(0, 2) === '::') {
    attribute = attribute.substr(2);
  } else {
    scope.$watch(attribute, function(newValue) {
      valueCallback(newValue);
      changeCallback();
    }, true);
  }
  valueCallback(scope.$eval(attribute));
}

translateAttrDirective.displayName = 'translateAttrDirective';
