var http = require('http');
var express = require('express');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var routes = require('./demo/server_routes');

var app = express();
app.set('port', process.env.PORT || 3005);
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname));
routes(app, __dirname);
app.use(errorHandler());

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
});
