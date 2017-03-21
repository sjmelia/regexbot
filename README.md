`regexbot`: slackbot with configurable regexes
==============================================

[![Build Status](https://travis-ci.org/sjmelia/regexbot.svg)](https://travis-ci.org/sjmelia/regexbot)

Slackbot for responding to messages matching a regex, posting messages at
scheduled times; retrieving issues from Jira; interfacing with RabbitMQ, and
pulling data from Rotatastic.

Setup
-----

1. Create a [new bot user](https://my.slack.com/services/new/bot) to get a slack api token.
2. `cp config.js.example src/config.js`
3. Edit `src/config.js` to have your slack api token and selected regexes.
4. `npm install && npm start`
5. Try it out on a slack channel!

See `config.js.example` for examples.

Matching
--------

The configuration object from `config.js` contains a list of regexes,
and a corresponding message, or messages (if an array) to show.

A function may also be given; which is called with regex matches.

A simple search and replace for numbers in square brackets then fills in the
matches - `[0]` for the whole string, `[1]` for the first match, and so on.

Scheduling
----------

Regexbot supports periodic messaging using a cron syntax; by setting the
`schedules` property of the configuration object.

Jira Integration
----------------

An example function is given for Jira, taking a config object. This function will connect to Jira,
retrieve the message summary for the given case (if found) and respond with a nicely formatted message/link

RabbitMQ Integration
--------------------

An example is given for having regexbot respond to a message, matched by regex;
and "purging" a RabbitMQ queue using the api. Note that this uses the id passed
by Slack when the bot first connects, to allow for an `@` message.

Development
-----------

`npm test` to lint and run tests
