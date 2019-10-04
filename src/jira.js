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

function finder (jira, config) {
  return function (match, callback) {
    var issueId = match[1];
	issueId = issueId.replace(/\+|\.|\,|\;|\?|\*|\/|\%|\^|\$|\#|\@|\[|\]/g, " ");
    var query = "text ~ \"" + issueId + "\"";
	console.log("Searching with query " + query);
    jira.searchJira(query)
      .then(function (results) {
		if (results.total > 0)
		{
			var issue = results.issues[0];
			var link = config.protocol + '://' + config.host + ':' + config.port + '/browse/' + issue.key;
			var slackLink = '<' + link + '|' + issue.key + '>';
			callback("This exception could be " + slackLink + ': ' + issue.fields.summary);
		}			
      })
    .catch(function (err) {
      //if (err.statusCode === 404) {
//        callback(slackLink + ' - I couldn\'t find this one... (404)');
  //    } else {
        console.error(err);
    //    callback(slackLink + ' - Oh no! An error occured (' + err.statusCode + ')');
      //}
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

function JiraFinder (config) {
	var jira = new JiraApi(config);
	return {
		regex: /One or more exceptions have occurred - first message is (.*) exception is (.*)/g,
		message: finder(jira, config)
	};
}

module.exports = { JiraResponder, JiraFinder };
