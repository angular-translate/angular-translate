angular.module('pascalprecht.translate')
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translate
 * @requires $compile
 * @requires $filter
 * @requires $interpolate
 * @restrict A
 *
 * @description
 * Translates given translation id either through attribute or DOM content.
 * Internally it uses `translate` filter to translate translation id. It possible to
 * pass an optional `translate-values` object literal as string into translation id.
 *
 * @param {string=} translate Translation id which could be either string or interpolated string.
 * @param {string=} translate-values Values to pass into translation id. Can be passed as object literal string or interpolated object.
 *
 * @example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre translate="TRANSLATION_ID"></pre>
        <pre translate>TRANSLATION_ID</pre>
        <pre translate="{{translationId}}"></pre>
        <pre translate>{{translationId}}</pre>
        <pre translate="WITH_VALUES" translate-values="{value: 5}"></pre>
        <pre translate translate-values="{value: 5}">WITH_VALUES</pre>
        <pre translate="WITH_VALUES" translate-values="{{values}}"></pre>
        <pre translate translate-values="{{values}}">WITH_VALUES</pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($translateProvider) {

        $translateProvider.translations('en',{
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}'
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

          element = $compile('<p translate="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate="{{translationId}}"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>TRANSLATION_ID</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>{{translationId}}</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');
        });
      });
    </file>
   </example>
 */
.directive('translate', ['$translate', '$q', '$interpolate', '$compile', '$parse', '$rootScope', function ($translate, $q, $interpolate, $compile, $parse, $rootScope) {

  return {
    restrict: 'AE',
    scope: true,
    compile: function (tElement, tAttr) {

      var translateValuesExist = (tAttr.translateValues) ?
        tAttr.translateValues : undefined;

      var translateInterpolation = (tAttr.translateInterpolation) ?
        tAttr.translateInterpolation : undefined;

      var translateValueExist = tElement[0].outerHTML.match(/translate-value-+/i);

      var interpolateRegExp = "^(.*)(" + $interpolate.startSymbol() + ".*" + $interpolate.endSymbol() + ")(.*)";

      return function linkFn(scope, iElement, iAttr) {

        scope.interpolateParams = {};
        scope.preText = "";
        scope.postText = "";

        // Ensures any change of the attribute "translate" containing the id will
        // be re-stored to the scope's "translationId".
        // If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
        iAttr.$observe('translate', function (translationId) {
          if (angular.equals(translationId , '') || !angular.isDefined(translationId)) {
            var interpolateMatches = iElement.text().match(interpolateRegExp);
            if (angular.isArray(interpolateMatches)) {
              scope.preText = interpolateMatches[1];
              scope.postText = interpolateMatches[3];
              scope.translationId = $interpolate(interpolateMatches[2])(scope.$parent);
            } else {
              scope.translationId = iElement.text().replace(/^\s+|\s+$/g,'');
            }
          } else {
            scope.translationId = translationId;
          }
        });

        iAttr.$observe('translateDefault', function (value) {
          scope.defaultText = value;
        });

        if (translateValuesExist) {
          iAttr.$observe('translateValues', function (interpolateParams) {
            if (interpolateParams) {
              scope.$parent.$watch(function () {
                angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
              });
            }
          });
        }

        if (translateValueExist) {
          var fn = function (attrName) {
            iAttr.$observe(attrName, function (value) {
              scope.interpolateParams[angular.lowercase(attrName.substr(14, 1)) + attrName.substr(15)] = value;
            });
          };
          for (var attr in iAttr) {
            if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
              fn(attr);
            }
          }
        }

        var applyElementContent = function (value, scope, successful) {
          if (!successful && typeof scope.defaultText !== 'undefined') {
            value = scope.defaultText;
          }
          iElement.html(scope.preText + value + scope.postText);
          var globallyEnabled = $translate.isPostCompilingEnabled();
          var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
          var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
          if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
            $compile(iElement.contents())(scope);
          }
        };

        var updateTranslationFn = (function () {
          if (!translateValuesExist && !translateValueExist) {
            return function () {
              var unwatch = scope.$watch('translationId', function (value) {
                if (scope.translationId && value) {
                  $translate(value, {}, translateInterpolation)
                    .then(function (translation) {
                      applyElementContent(translation, scope, true);
                      unwatch();
                    }, function (translationId) {
                      applyElementContent(translationId, scope, false);
                      unwatch();
                    });
                }
              }, true);
            };
          } else {
            return function () {

              var updateTranslations = function () {
                if (scope.translationId && scope.interpolateParams) {
                  $translate(scope.translationId, scope.interpolateParams, translateInterpolation)
                    .then(function (translation) {
                      applyElementContent(translation, scope, true);
                    }, function (translationId) {
                      applyElementContent(translationId, scope, false);
                    });
                  }
              };

              // watch both interpolateParams and translationId, because watchers are triggered non-deterministic
              scope.$watch('interpolateParams', updateTranslations, true);
              scope.$watch('translationId', updateTranslations);
            };
          }
        }());

        // Ensures the text will be refreshed after the current language was changed
        // w/ $translate.use(...)
        var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslationFn);

        updateTranslationFn();
        scope.$on('$destroy', unbind);
      };
    }
  };
}]);
