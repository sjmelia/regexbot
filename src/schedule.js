/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var schedule = require('node-schedule');

module.exports = function (schedules, poster) {
  var jobs = [];
  for (var unclosedItem of schedules) {
    let item = unclosedItem;

    var sender = null;
    if (typeof item.message === 'function') {
      sender = function () {
        item.message(function (message) {
          poster(item.channel, message);
        });
      };
    } else {
      sender = function () { poster(item.channel, item.message); };
    }

    var job = schedule.scheduleJob(item.cron, sender);
    jobs.push(job);
  }
  return jobs;
};
