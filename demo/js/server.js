var http = require("http"), url = require("url"), fs = require("fs");

http.createServer(function (req, resp) {
  var _get = url.parse(req.url, true).query;
  fs.readFile('../l10n/' + _get['lang'] + '.json', function(err, data) {
    if (err) answer(resp, 404, '');
    else answer(resp, 200, data);
  });
}).listen(8080);

function answer(resp, code, data) {
  resp.writeHead(code,{
    'Content-Type':'application/json;charset=utf-8',
    'Access-Control-Allow-Origin':'*', 
    'Access-Control-Allow-Headers':'X-Requested-With'
  });
  resp.end(data);
}