var http = require("http");
var options = {
  host: '127.0.0.1',
  port: 80,
  path: '/incoming',
  method: 'POST'
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

var data={
 From:'+13476888860',
 Body:'I like this!'
};
console.log(data.toString());
req.write(data.toString());
req.end();