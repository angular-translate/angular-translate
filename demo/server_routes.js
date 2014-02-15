module.exports = function (app, dir) {
  var url = require('url'), fs = require('fs');

  app.get('/demo/', function(req, res) {
    function answer(code, data) {
      res.writeHead(code,{
        'Content-Type':'text/html;charset=utf-8'
      });
      res.end(data);
    };

    var _get = url.parse(req.url, true).query;
    fs.readFile('./demo/index.htm', function(err, data) {
      if (err) answer(404, '');
      else answer(200, data);
    });
  });
  
  app.get('/demo/get_lang', function (req, res) {
    function answer(code, data) {
      res.writeHead(code,{
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers':'X-Requested-With'
      });
      res.end(data);
    };

    var _get = url.parse(req.url, true).query;
    fs.readFile('./demo/l10n/' + _get['lang'] + '.json', function(err, data) {
      if (err) answer(404, '');
      else answer(200, data);
    });
    
  });

  // Example
  app.get('/this-is-an-express-server', function (req, res) {
    res.send(200);
  });
  
};
