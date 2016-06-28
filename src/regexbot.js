/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var regexbot = {};

regexbot.respond = function (text) {
  for (var item of regexbot.config.regexes) {
    var match;
    var output = '';
    while ((match = item.regex.exec(text)) !== null) {
      if (output.length > 0) output += '\n';

      var msg = item.message;
      for (var i = 0; i < match.length; i++) {
        msg = msg.replace('[' + i + ']', match[i]);
      }
      output += msg;
    }

    if (output.length > 0) {
      return output;
    }
  }
  return null;
};

module.exports = regexbot;
