/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var config = require('./config');
var RegexBot = require('./regexbot');
var randomiser = function (max) {
  return Math.floor(Math.random() * max);
};
var regexbot = new RegexBot(config, randomiser);

var slackClient = require('@slack/client');
var RtmClient = slackClient.RtmClient;
var WebClient = slackClient.WebClient;

var rtm = new RtmClient(config.slack_api_token);
var rtmData = rtm.start();

var web = new WebClient(config.slack_api_token);

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log('Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel');
});

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  if (message.subtype === 'bot_message') {
    return;
  }

  if (message.user === rtm.activeUserId) {
    return;
  }

  regexbot.respond(message.text, function (reply) {
    web.chat.postMessage(message.channel, reply, { as_user: true });
//    rtm.sendMessage(reply, message.channel);
  });
});
