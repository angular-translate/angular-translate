var express = require('express');

// Create express facility.
var app = express()
// Create a HTTP server object.
var server = require('http').createServer(app);

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.errorHandler());
    app.use(express.static(__dirname));
    app.use(app.router);
    require('./demo/server_routes')(app, __dirname);
});

module.exports = server;

// Override: Provide an "use" used by grunt-express.
module.exports.use = function () {
    app.use.apply(app, arguments);
};