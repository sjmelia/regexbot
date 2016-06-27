/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var config = require('./config');

var RtmClient = require('@slack/client').RtmClient;
var rtm = new RtmClient(config.slack_api_token, {logLevel: 'debug'});
rtm.start();

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log('Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel');
});

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  for (var item of config.regexes) {
    var match = item.regex.exec(message.text);
    if (match) {
      var msg = item.message;
      for (var i = 0; i < match.length; i++) {
        msg = msg.replace('[' + i + ']', match[i]);
      }
      rtm.sendMessage(msg, message.channel);
    }
  }
});
