'use strict';

var fs = require('fs');

var AVAILABLE_SCOPES = [], isValidScope, injectByScope, getAffectiveScope, log, isDefaultScope;

(function(undefined){
  AVAILABLE_SCOPES = fs.readdirSync('./test_scopes').filter(function (filename) {
    return filename[0] !== '.';
  });
  isValidScope = function (scope) {
    return AVAILABLE_SCOPES.indexOf(scope) > -1;
  };
  getAffectiveScope = function (scope) {
    if (isValidScope(scope)) {
      return scope;
    } else {
      return '(default)';
    }
  };
  injectByScope = function (scope, path) {
    var prefix = '';
    // unless a scope is given, use the default resources
    if (scope && isValidScope(scope)) {
      prefix = 'test_scopes/' + scope + '/';
    }
    return prefix + 'bower_components/' + path;
  },
  log = function (scope) {
    console.log('Available test scopes: ', AVAILABLE_SCOPES);
    console.log('Currently selected scope: ', getAffectiveScope(scope));
  },
  isDefaultScope = function (scope) {
    return !isValidScope(scope);
  };
})();

module.exports = {
  AVAILABLE_SCOPES: AVAILABLE_SCOPES,
  isValidScope: isValidScope,
  injectByScope: injectByScope,
  getAffectiveScope: getAffectiveScope,
  isDefaultScope: isDefaultScope,
  log: log
};
