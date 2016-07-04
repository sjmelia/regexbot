/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
function RegexBot (config, randomiser) {
  this.config = config;
  this.randomiser = randomiser;
  this.respond = respond;

  function respond (text, callback) {
    for (var item of this.config.regexes) {
      var match;
      var output = '';
      while ((match = item.regex.exec(text)) !== null) {
        if (output.length > 0) output += '\n';

        var msg = item.message;
        if (item.message.constructor === Array) {
          var randomIndex = this.randomiser(item.message.length);
          msg = item.message[randomIndex];
        }

        if (typeof item.message === 'function') {
          item.message(match, callback);
        } else {
          for (var i = 0; i < match.length; i++) {
            msg = msg.replace('[' + i + ']', match[i]);
          }
          output += msg;
        }
      }

      if (output.length > 0) {
        callback(output);
        return;
      }
    }
    return null;
  }
}

module.exports = RegexBot;
