/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var http = require('http');

function purge (vhost, queuename, config) {
  return function (match, callback) {
    var auth = new Buffer(config.username + ':' + config.password).toString('base64');

    var options = {
      host: config.host,
      path: '/api/queues/' + vhost + '/' + queuename + '/contents',
      method: 'DELETE',
      port: 15672,
      headers: {
        Authorization: 'Basic ' + auth
      }
    };

    var rabbitCallback = function (response) {
      if (response.statusCode < 200 || response.statusCode > 299) {
        callback('Could not purge ' + vhost + '/' + queuename + ' because an error occured (' + response.statusCode + ')');
        return;
      }
      callback('Purged ' + vhost + '/' + queuename);
    };

    var req = http.request(options, rabbitCallback);
    req.end();
  };
}

module.exports = purge;
