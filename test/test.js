/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* global describe it */
var assert = require('chai').assert;
var regexbot = require('../src/regexbot');
var config = {
  regexes: [
    { regex: /[A-Z]+-[0-9]+/g, message: 'http://my-jira.com/?q=[0]' }
  ]
};
regexbot.config = config;

describe('Regexbot', function () {
  it('should return the correct url', function () {
    var reply = regexbot.respond('CL-100');
    assert.equal(reply, 'http://my-jira.com/?q=CL-100');
  });

  it('should return multiples seperated by newlines', function() {
    var reply = regexbot.respond('CL-100 CL-200');
    assert.equal(reply, 'http://my-jira.com/?q=CL-100\nhttp://my-jira.com/?q=CL-200');
  });
});
