/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var config = require('./config');
var RegexBot = require('./regexbot');
var randomiser = function (max) {
  return Math.floor(Math.random() * max);
};
var regexbot = new RegexBot(config, randomiser);

const { RTMClient, WebClient, ErrorCode } = require('@slack/client');

var rtm = new RTMClient(config.slack_api_token);
rtm.start();

var web = new WebClient(config.slack_api_token);

rtm.on('authenticated', function (rtmStartData) {
  console.log(`Logged in as "${rtmStartData.self.name}" of team "${rtmStartData.team.name}", but not yet connected to a channel`);
  console.log(rtmStartData.self.id);
  config.build(rtmStartData.self.id);
});

rtm.on('message', function (message) {
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
    postMessage({ channel: message.channel, text: reply, as_user: true });
  });
});

function postMessage (options) {
  web.chat.postMessage(options)
    .catch(function (error) {
      if (error.code === ErrorCode.PlatformError) {
        // a platform error occurred, `error.message` contains error information, `error.data` contains the entire resp
        console.error(error.message);
        console.info(error.data);
      } else {
        // some other error occurred
        console.error(error);
      }
    });
}

var scheduler = require('./schedule.js');
var poster = function (channel, msg) { postMessage({ channel: channel, text: msg, as_user: true }); };
scheduler(config.schedules, poster);
