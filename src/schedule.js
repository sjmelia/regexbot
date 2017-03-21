/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var schedule = require('node-schedule');

module.exports = function (schedules, poster) {
  var jobs = [];
  for (var unclosedItem of schedules) {
    let item = unclosedItem;
    console.log(`Registering a job with schedule ${item.cron} for channel ${item.channel} and message ${item.message}`);
    var job = schedule.scheduleJob(item.cron, function () { poster(item.channel, item.message); });
    jobs.push(job);
  }
  return jobs;
};
