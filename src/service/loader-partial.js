(function(angular){

function Part(name) {
  this.name = name;
  this.isActive = true;
  this.tables = {};
}

Part.prototype.parseUrl = function(urlTemplate, targetLang) {
  return urlTemplate.replace('{part}', this.name).replace('{lang}', targetLang);
};

Part.prototype.getTable = function(lang, $q, $http, urlTemplate, errorHandler) {
  var deferred = $q.defer();
  
  if (!this.tables.hasOwnProperty(lang)) {
    var self = this;
    
    $http({
      method : 'GET',
      url : this.parseUrl(urlTemplate, lang)
    }).success(function(data){
      self.tables[lang] = data;
      deferred.resolve(data);
    }).error(function() {
      if (errorHandler !== undefined) {
        errorHandler(self.name, lang).then(
          function(data) {
            self.tables[lang] = data;
            deferred.resolve(data);
          },
          function() {
            deferred.reject(self.name);
          }
        );
      } else deferred.reject(self.name);
    });
  
  } else deferred.resolve(this.tables[lang]);
  
  return deferred.promise;
};




angular.module('pascalprecht.translate')
.provider('$translatePartialLoader', [function() {

  var parts = {};
  
  var isPartExists = function(name) {
    return parts.hasOwnProperty(name);
  };
  
  var isPartAvailable = function(name) {
    if (name === undefined) {
      throw new Error('Couldn\'t check any part, no part name is specified!');
    } else if (!angular.isString(name)) {
      throw new TypeError('Invalid type of a first argument, string expected.');
    }
    
    return (isPartExists(name) && parts[name].isActive);
  };
  
  this.addPart = function(name) {
    if (name === undefined) {
      throw new Error('Couldn\'t add a new part, no part name is specified!');
    } else if (!angular.isString(name)) {
      throw new TypeError('Invalid type of a first argument, string expected.');
    }
    
    if (!isPartExists(name)) {
      parts[name] = new Part(name);
    }
    
    return this;
  };
  
  this.deletePart = function(name) {
    if (name === undefined) {
      throw new Error('Couldn\'t delete any part, no part name is specified!');
    } else if (!angular.isString(name)) {
      throw new TypeError('Invalid type of a first argument, string expected.');
    }
    
    delete parts[name];
    
    return this;
  };
  
  this.isPartAvailable = isPartAvailable;
  
  this.$get = ['$rootScope', '$injector', '$q', '$http', 
  function($rootScope, $injector, $q, $http) {
  
    var service = function(options) {
      if (options.key === undefined) {
        throw new Error('Unable to load data, a key is not specified.');
      } else if (!angular.isString(options.key)) {
        throw new TypeError('Unable to load data, a key is not a string.');
      } else if (options.urlTemplate === undefined) {
        throw new Error('Unable to load data, a urlTemplate is not specified.');
      } else if (!angular.isString(options.urlTemplate)) {
        throw new TypeError('Unable to load data, a urlTemplate is not a string.');
      }
    
      var errorHandler = options.loadFailureHandler;
      if (errorHandler !== undefined) {
        if (!angular.isString(errorHandler)) {
          throw new Error('Unable to load data, a loadFailureHandler is not a string.');
        } else errorHandler = $injector.get(errorHandler);
      }
      
      var loaders = [],
          tables = [],
          deferred = $q.defer();

      function acceptTable(table) {
        tables.push(table);
      }
          
      for (var part in parts) {
        if (isPartExists(part) && parts[part].isActive) {
          loaders.push(
            parts[part]
              .getTable(options.key, $q, $http, options.urlTemplate, errorHandler)
              .then(acceptTable)
          );
        }
      }
      
      if (loaders.length > 0) {
        $q.all(loaders).then(
          function() {
            var table = {};
            for (var i = 0; i < tables.length; i++) {
              angular.extend(table, tables[i]);
            }
            deferred.resolve(table);
          },
          function() {
            deferred.reject(options.key);
          }
        );
      } else deferred.resolve({});
      
      return deferred.promise;
    };
  
    service.addPart = function(name) {
      if (name === undefined) {
        throw new Error('Couldn\'t add a new part, no part name is specified!');
      } else if (!angular.isString(name)) {
        throw new TypeError('Invalid type of a first argument, string expected.');
      }
      
      if (!isPartExists(name)) {
        parts[name] = new Part(name);
        $rootScope.$broadcast('$translatePartialLoaderStructureChanged', name);
      } else if (!parts[name].isActive) {
        parts[name].isActive = true;
        $rootScope.$broadcast('$translatePartialLoaderStructureChanged', name);
      }
      
      return service;
    };
    
    service.deletePart = function(name, removeData) {
      if (name === undefined) {
        throw new Error('Couldn\'t delete any part, no part name is specified!');
      } else if (!angular.isString(name)) {
        throw new TypeError('Invalid type of a first argument, string expected.');
      }
      
      if (removeData === undefined) {
        removeData = false;
      } else if (typeof removeData !== 'boolean') {
        throw new TypeError('Invalid type of a second argument, boolean expected.'); 
      }

      if (isPartExists(name)) {
        var wasActive = parts[name].isActive;
        if (removeData) {
          delete parts[name];
        } else {
          parts[name].isActive = false;
        }
        if (wasActive) {
          $rootScope.$broadcast('$translatePartialLoaderStructureChanged', name);
        }
      }
      
      return service;
    };
    
    service.isPartAvailable = isPartAvailable;
  
    return service;
    
  }];
  
}]);

})(angular);
