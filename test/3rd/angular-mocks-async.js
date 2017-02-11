/**
 * https://github.com/amoldavsky/angular-mocks-async/blob/655eec2ed5da21f42816e21a1c3961fcb3bd1ddf/dist/angular-mocks-async.js
 *
 * An abstraction on top of ngMockE2E to support async calls using
 * promises.
 *
 * If you need to make an async operation ( such as working
 * with WebSQL ) the orignial ngMockE2E will fall through and you will never
 * have the chance to respond with your own response.
 *
 * ngMockE2EAsync decorates the $httpBackend by utilizing promises. Responses
 * can now be in a form of a promise where the $httpBackend will original function
 * will not be called until your promise has been resolved. Once resolved the original
 * $httpBackend APIs will be called and things will flow their natural ways back to the
 * caller.
 *
 * @ngdoc module
 * @namespace ngMockE2EAsync
 * @author Assaf Moldavsky
 * @version 0.9b
 */
(function( ng ) {

	var httpMock = ng.module( "ngMockE2EAsync", [ 'ngMockE2E' ] );

	ng.mock.$HttpBackendAsyncDecorator = [ '$rootScope', '$q', '$delegate', '$browser', createHttpBackendAsyncMock ];

	function createHttpBackendAsyncMock( $rootScope, $q, $delegate, $browser ) {

		var definnitionsAsync = [];

		function $httpBackendAsync( method, url, data, callback, headers, timeout, withCredentials ) {

			var d = match( method, url, data, headers );
	        if ( !d || d.passThrough || !d.getPromise ) {
	            return $delegate.call(this, method, url, data, callback, headers);
	        }

	        if( !d.getPromise || ! typeof d.getPromise === 'function' ) {
	        	throw 'unexpected response: ' + d.getPromise;
	        }

	        // we will define an interceptor which will be executed
	        // before the actual function is executed. Thsi way
	        // we first execute our code and than call the original
	        var interceptor = function ( /* arguments we don't care about */ ) {

	        	var whenAsyncConfig = ng.copy( d );
	        	delete whenAsyncConfig.getPromise;

	        	var promise = d.getPromise( method, url, data, headers, whenAsyncConfig );

	        	if( !promise || ( typeof promise.then !== 'function' ) ) {
		        	throw 'unexpected response: ' + promise;
		        }

	        	promise.then( function( response ) {

	        		if( !response ) {
	        			throw 'response was unexpected: ' + response;
	        		}

	        		// callback is the orignial function which we are wrapping / decorating
	        		callback.apply( this, response );

	        	});

	        };

	        return $delegate.call(this, method, url, data, interceptor, headers);

		}

		// copy all existing APIs from the $delegate into the decorator
		for( var key in $delegate ) {
			$httpBackendAsync[ key ] = $delegate[ key ];
	    }

		// matchers just like in AgnularJS itself
		function match( method, url, data, headers ) {

			var defs = definnitionsAsync;

	        for (var i = -1; ++i < defs.length;) {

	        	var def = definnitionsAsync[i];

	        	if ( def.method.toUpperCase() === method.toUpperCase() ) {
	            	if ( matchUrl( def.url, url )
	            			&& (!angular.isDefined( data ) || matchData( def.data, data ))
	            			&& (!angular.isDefined( headers ) || matchHeaders( def.headers, headers ))) {

	            		return def;
	            	}
	        	}
	        }
	    };

	    function matchUrl( url, u ) {

	        if (!url) return true;
	        if (angular.isFunction(url.test))return url.test(u);
	        if (angular.isFunction(url))return url(u);
	        return url == u;

	    };
	    function matchHeaders( headers, h ) {

	        if (angular.isUndefined(headers))return true;
	        if (angular.isFunction(headers)) return headers(h);
	        return angular.equals(headers, h);

	    };
	    function matchData( data, d ) {

	    	if (angular.isUndefined(data)) return true;
	        if (data && angular.isFunction(data.test)) return data.test(d);
	        if (data && angular.isFunction(data)) return data(d);
	        if (data && !angular.isString(data)) {
	            return angular.equals(angular.fromJson(angular.toJson(data)), angular.fromJson(d));
	        }
	        return ( data == d );

	    };

		// decorate $httpBackend#when() and $httpBackend#expect()
	    function argumentsToArray( arguments ) {
	    	var array = [];
	    	for( var i = 0, len = arguments.length; i < len; i++ ) {
	    		array.push( arguments[i] );
	    	}

	    	return array;
	    }
		$httpBackendAsync.whenAsync = function() {
			return whenAsync.apply( $httpBackendAsync, [ $delegate.when ].concat( argumentsToArray( arguments ) ) );
		};
		$httpBackendAsync.expectAsync = function() {
			return expectAsync.apply( $httpBackendAsync, [ $delegate.expect ].concat( argumentsToArray( arguments ) ) );
		};

		var expectAsync = whenAsync;
		function whenAsync( deletageMethod, method, url, data, headers, keys ) {

			function MockHttpExpectation( method, url, data, headers, keys, promiseFn ) {

				this.method = method;
				this.url = url;
				this.data = data;
				this.header = headers;
				this.keys = keys;
				this.getPromise = promiseFn; // this will be called in our decorated constructor when the $http provider is used

			};

			var def = new MockHttpExpectation( method, url, data, headers, keys, null );
	        var chain = deletageMethod.call( $delegate, method, url, data, headers );

	        var ret = {
	            respond: function ( response ) {

	            	// we want to differentiate between a function and a promise

	            	if( response ) {

	            		if( typeof response === 'function' ) {

	            			// we ASSUME that when executed this function will return a promise
	            			def.getPromise = response;

	            		} else if( response.then && ( typeof response.then === 'function' ) ) {

	            			// we got a raw promise, we need to wrap it in a function
	            			def.getPromise = function( method, url, data, headers, keys ) {
	            				return response;
	            			};

	            		} else {

	            			throw 'unexpected response ' + response;

	            		}

	                    // call the real function
	                	chain.respond.apply( chain, function() {} );

	                } else {
	                	// call the real function
	                	chain.respond.apply( chain, arguments );
	                }

	                return ret;
	            },
	            passThrough: function () { // TODO: Assaf: not sure what to do with passthrough for now
	            	/*
	            	// the def used be have these parameters: [ method, url, data, headers, 0, undefined ];

	                def[4] = 0;
	                def[5] = true;
	                chain.passThrough.apply(chain);
	                return ret;
	                */
	            }
	        };

	        definnitionsAsync.push( def );
	        return ret;
		};

		return $httpBackendAsync;

	}

	httpMock.config(['$provide',function( $provide ) {

		$provide.decorator( '$httpBackend', angular.mock.$HttpBackendAsyncDecorator );

	}]);


})( angular );
