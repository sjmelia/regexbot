/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var http = require('http');

var rotatastic = {
  getEntry: function (uuid, year, month, day, success, failure) {
    var path = '/rota/' + uuid + '/entries/' + year + '/' + month + '/' + day;
    var options = {
      host: 'www.rotatastic.com',
      path: path,
      method: 'GET',
      port: 80
    };

    var cb = function (response) {
      if (response.statusCode < 200 || response.statusCode > 299) {
        failure(response.statusCode);
        return;
      };

      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        success(JSON.parse(str));
      });
    };

    var req = http.request(options, cb);
    req.end();
  }
};

module.exports = rotatastic;
