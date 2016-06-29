/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
function RegexBot (config, randomiser) {
  this.config = config;
  this.randomiser = randomiser;
  this.respond = respond;

  function respond (text) {
    for (var item of this.config.regexes) {
      var match;
      var output = '';
      while ((match = item.regex.exec(text)) !== null) {
        if (output.length > 0) output += '\n';

        var msg = item.message;
        if (item.message.constructor === Array) {
          var randomIndex = randomiser(item.message.length);
          msg = item.message[randomIndex];
        }

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
  }
}

module.exports = RegexBot;
