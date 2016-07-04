/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* global describe it */
var assert = require('chai').assert;
var RegexBot = require('../src/regexbot');
var config = {
  regexes: [
    { regex: /RND-[0-9]+/g, message: ['A: [0]', 'B: [0]'] },
    { regex: /[A-Z]+-[0-9]+/g, message: 'http://my-jira.com/?q=[0]' },
    { regex: /([A-Z]+)-([A-Z]+)/g, message: 'A:[0] B:[1] C:[2]' }
  ]
};
var rnd = 0;
var randomiser = function (max) { return rnd; };
regexbot = new RegexBot(config, randomiser);

describe('Regexbot', function () {
  it('should return the correct url', function () {
    var reply = '';

    regexbot.respond('CL-100', function (txt) {
      reply = txt;
    });
    assert.equal(reply, 'http://my-jira.com/?q=CL-100');
  });

  it('should return multiples seperated by newlines', function () {
    var reply = '';
    regexbot.respond('CL-100 CL-200', function (txt) {
      reply = txt;
    });
    assert.equal(reply, 'http://my-jira.com/?q=CL-100\nhttp://my-jira.com/?q=CL-200');
  });

  it('should populate with groups', function () {
    var reply = '';
    regexbot.respond('ABC-DEF', function (txt) {
      reply = txt;
    });
    assert.equal(reply, 'A:ABC-DEF B:ABC C:DEF');
  });

  it('should return the first item when randomiser is 0', function () {
    rnd = 0;
    var reply = '';
    regexbot.respond('RND-000', function (txt) {
      reply = txt;
    });
    assert.equal(reply, 'A: RND-000');
  });

  it('should return the second item when randomiser is 1', function () {
    rnd = 1;
    var reply = '';
    regexbot.respond('RND-000', function (txt) {
      reply = txt;
    });
    assert.equal(reply, 'B: RND-000');
  });

});
