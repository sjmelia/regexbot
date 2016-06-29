/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var config = require('./config');
var RegexBot = require('./regexbot');
var randomiser = function (max) {
  return Math.floor(Math.random() * max);
};
var regexbot = new RegexBot(config, randomiser);

var RtmClient = require('@slack/client').RtmClient;
var rtm = new RtmClient(config.slack_api_token, {logLevel: 'debug'});
rtm.start();

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log('Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel');
});

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  var reply = regexbot.respond(message.text);
  if (reply) {
    rtm.sendMessage(reply, message.channel);
  }
});
