/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var config = require('./config');
var RegexBot = require('./regexbot');
var randomiser = function (max) {
  return Math.floor(Math.random() * max);
};
var regexbot = new RegexBot(config, randomiser);

const { RTMClient, WebClient, ErrorCode } = require('@slack/client');
const { createEventAdapter } = require('@slack/events-api');

// Create a web client to send messages back to Slack
var web = new WebClient(config.slack_api_token);

// Set up either an RTM or an Events API client
if (config.use_rtm) {
  var client = new RTMClient(config.slack_api_token);
  client.on('authenticated', (rtmStartData) => {
    console.log(`Logged in as "${rtmStartData.self.name}" of team "${rtmStartData.team.name}", but not yet connected to a channel`);
    console.log(rtmStartData.self.id);
    config.build(rtmStartData.self.id);
  });
  client.start();
} else {
  client = createEventAdapter(config.events.signing_secret);
  client.start(config.events.port).then(() => {
    console.log('server listening on port ' + config.events.port);
    config.build(config.events.port);
  });
}

// Listen for messages (works the same for both RTM and Events API)
client.on('message', (message) => {
  console.log('Received a message');
  /*message.subtype === 'bot_message' || 
  if (message.hasOwnProperty('bot_id')) {
	  
    return;
  }*/

  // This check only applies for the RTM client
  if (config.use_rtm && message.user === client.activeUserId) {
    return;
  }

  console.log('Accepted a message: ' + JSON.stringify(message));

  regexbot.respond(message.text, (reply) => {
    console.log('Responding with: ' + reply);
    postMessage({ channel: message.channel, text: reply, as_user: true });
  });
});

client.on('error', console.error);

function postMessage (options) {
  web.chat.postMessage(options)
    .catch((error) => {
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
