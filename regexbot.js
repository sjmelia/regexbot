/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var config = require('./config');

var regexbot = {};

regexbot.respond = function(text) {
  for (var item of regexbot.config.regexes) {
    var match = item.regex.exec(text);
    if (!match) {
      continue;
    }

    var msg = item.message;
    for (var i = 0; i < match.length; i++) {
      msg = msg.replace('[' + i + ']', match[i]);
    }
    return msg;
  }
  return null;
};

module.exports = regexbot;
