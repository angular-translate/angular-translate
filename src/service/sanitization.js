/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateSanitization
 *
 * @description
 * Sanitizes interpolation parameters and translated texts.
 *
 * @return {object} $translateSanitization sanitization service
 */
angular.module('pascalprecht.translate').provider('$translateSanitization', $translateSanitizationProvider);

function $translateSanitizationProvider () {

  var provider = this,
    $sanitize,
    currentStrategy = null, // TODO change to either 'sanitize', 'escape' or ['sanitize', 'escapeParameters'] in 3.0.
    hasConfiguredStrategy = false,
    hasShownNoStrategyConfiguredWarning = false;

  provider.strategies = {
    /**
     * Sanitizes HTML in the translation text using $sanitize.
     */
    sanitize: function (value, mode) {
      if (mode === 'text') {
        value = htmlSanitizeValue(value);
      }
      return value;
    },
    /**
     * Escapes HTML in the translation.
     */
    escape: function (value, mode) {
      if (mode === 'text') {
        value = htmlEscapeValue(value);
      }
      return value;
    },
    /**
     * Sanitizes HTML in the values of the interpolation parameters using $sanitize.
     */
    sanitizeParameters: function (value, mode) {
      if (mode === 'params') {
        value = mapInterpolationParameters(value, htmlSanitizeValue);
      }
      return value;
    },
    /**
     * Escapes HTML in the values of the interpolation parameters.
     */
    escapeParameters: function (value, mode) {
      if (mode === 'params') {
        value = mapInterpolationParameters(value, htmlEscapeValue);
      }
      return value;
    }
  };
  // Support legacy strategy name 'escaped' for backwards compatibility.
  // TODO should be removed in 3.0
  provider.strategies.escaped = provider.strategies.escapeParameters;

  /**
   * Adds a sanitization strategy to the list of known strategies.
   * @param {string} strategyName
   * @param {Function} strategyFunction
   */
  provider.addStrategy = function (strategyName, strategyFunction) {
    provider.strategies[strategyName] = strategyFunction;
  };

  /**
   * Removes a sanitization strategy from the list of known strategies.
   * @param {string} strategyName
   */
  provider.removeStrategy = function (strategyName) {
    delete provider.strategies[strategyName];
  };

  /**
   * Selects a sanitization strategy. When an array is provided the strategies will be executed in order.
   * @param {string|Function|Array<string|Function>} strategy The sanitization strategy / strategies which should be used. Either a name of an existing strategy, a custom strategy function, or an array consisting of multiple names and / or custom functions.
   * @returns {$translateSanitizationProvider}
   */
  provider.useStrategy = function (strategy) {
    hasConfiguredStrategy = true;
    currentStrategy = strategy;
    return this;
  };

  provider.$get = function ($injector, $log) {

    var applyStrategies = function (value, mode, strategies) {
      angular.forEach(strategies, function (strategy) {
        if (angular.isFunction(strategy)) {
          value = strategy(value, mode);
        } else if (angular.isFunction(provider.strategies[strategy])) {
          value = provider.strategies[strategy](value, mode);
        } else {
          throw new Error('pascalprecht.translate.$translateSanitization: Unknown sanitization strategy: \'' + strategy + '\'');
        }
      });
      return value;
    };

    // TODO: should be removed in 3.0
    var showNoStrategyConfiguredWarning = function () {
      if (!hasConfiguredStrategy && !hasShownNoStrategyConfiguredWarning) {
        $log.warn('pascalprecht.translate.$translateSanitization: No sanitization strategy has been configured. This can have serious security implications. See http://angular-translate.github.io/docs/#/guide/19_security for details.');
        hasShownNoStrategyConfiguredWarning = true;
      }
    };

    if ($injector.has('$sanitize')) {
      $sanitize = $injector.get('$sanitize');
    }

    return {
      /**
       * Selects a sanitization strategy. When an array is provided the strategies will be executed in order.
       * @param {string|Function|Array<string|Function>} strategy The sanitization strategy / strategies which should be used. Either a name of an existing strategy, a custom strategy function, or an array consisting of multiple names and / or custom functions.
       * @returns {$translateSanitizationProvider}
       */
      useStrategy: provider.useStrategy,
      /**
       * Sanitizes a value.
       * @param {*} value The value which should be sanitized.
       * @param {string} mode The current sanitization mode, either 'params' or 'text'.
       * @param {string|Function|Array<string|Function>} [strategy] Optional custom strategy which should be used instead of the currently selected strategy.
       * @returns {*}
       */
      sanitize: function (value, mode, strategy) {
        if (!currentStrategy) {
          showNoStrategyConfiguredWarning();
        }

        if (arguments.length < 3) {
          strategy = currentStrategy;
        }

        if (!strategy) {
          return value;
        }

        var strategies = angular.isArray(strategy) ? strategy : [strategy];
        return applyStrategies(value, mode, strategies);
      }
    };
  };

  var htmlEscapeValue = function (value) {
    return angular.element('<div></div>').text(value).html();
  };

  var htmlSanitizeValue = function (value) {
    if (!$sanitize) {
      throw new Error('pascalprecht.translate.$translateSanitization: Error cannot find $sanitize service. Either include the ngSanitize module (https://docs.angularjs.org/api/ngSanitize) or use a sanitization strategy which does not depend on $sanitize, such as \'escape\'.');
    }
    return $sanitize(value);
  };

  var mapInterpolationParameters = function (value, iteratee) {
    if (angular.isObject(value)) {
      var result = angular.isArray(value) ? [] : {};

      angular.forEach(value, function (propertyValue, propertyKey) {
        result[propertyKey] = mapInterpolationParameters(propertyValue, iteratee);
      });

      return result;
    }
    else if (angular.isNumber(value)) {
      return value;
    }
    else {
      return iteratee(value);
    }
  };
}
