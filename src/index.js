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
rtm.start();

var web = new WebClient(config.slack_api_token);

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as "${rtmStartData.self.name}" of team "${rtmStartData.team.name}", but not yet connected to a channel`);
  console.log(rtmStartData.self.id);
  config.build(rtmStartData.self.id);
});

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  console.log('Received a message');
  if (message.subtype === 'bot_message' || message.hasOwnProperty('bot_id')) {
    return;
  }

  if (message.user === rtm.activeUserId) {
    return;
  }

  console.log('Accepted a message: ' + JSON.stringify(message));

  regexbot.respond(message.text, function (reply) {
    console.log('Responding with: ' + reply);
    web.chat.postMessage(message.channel, reply, { as_user: true });
  });
});

var scheduler = require('./schedule.js');
var poster = function (channel, msg) { web.chat.postMessage(channel, msg, { as_user: true }); };
scheduler(config.schedules, poster);
