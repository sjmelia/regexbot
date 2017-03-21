`regexbot`: slackbot with configurable regexes
==============================================

[![Build Status](https://travis-ci.org/sjmelia/regexbot.svg)](https://travis-ci.org/sjmelia/regexbot)

Simple slackbot for responding to messages matching a regex.

Setup
-----

1. Create a [new bot user](https://my.slack.com/services/new/bot) to get a slack api token.
2. `cp config.js.example src/config.js`
3. Edit `src/config.js` to have your slack api token and selected regexes.
4. `npm install && npm start`
5. Try it out on a slack channel!

Matching
--------

See `config.js.example` for examples.

`config.js` contains a list of regexes, and a corresponding message, or messages (if an array) to show.

A function may also be given; which is called with regex matches.

A simple search and replace for numbers in square brackets then fills in the
matches - `[0]` for the whole string, `[1]` for the first match, and so on.

An example function is given for Jira, taking a config object. This function will connect to Jira, 
retrieve the message summary for the given case (if found) and respond with a nicely formatted message/link

Development
-----------

`npm test` to lint and run tests
