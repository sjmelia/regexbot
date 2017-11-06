/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var JiraApi = require('jira-client');

function responder (jira, config) {
  return function (match, callback) {
    var issueId = match[2];
    var link = config.protocol + '://' + config.host + ':' + config.port + '/browse/' + issueId;
    var slackLink = '<' + link + '|' + issueId + '>';
    jira.findIssue(issueId)
      .then(function (issue) {
        callback(slackLink + ': ' + issue.fields.summary);
      })
    .catch(function (err) {
      if (err.statusCode === 404) {
        callback(slackLink + ' - I couldn\'t find this one... (404)');
      } else {
        console.error(err);
        callback(slackLink + ' - Oh no! An error occured (' + err.statusCode + ')');
      }
    });
  };
}

function JiraResponder (config) {
  var jira = new JiraApi(config);
  return {
    regex: /(^|\s)([A-Za-z]+-[0-9]+)/g,
    message: responder(jira, config)
  };
}

module.exports = JiraResponder;
