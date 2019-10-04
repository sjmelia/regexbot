/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
var schedule = require('node-schedule');
var http = require('http');

module.exports = function (schedules, poster) {
  var jobs = [];

	var getRota =	 function() {
		var today = new Date();
		var year = today.getUTCFullYear();
		var month = ('0' + (today.getUTCMonth() + 1)).slice(-2);
		var day = ('0' + today.getUTCDate()).slice(-2);
		
		 var options = {
			  host: 'www.rotatastic.com',
			  path: '/rota/af59070d-b2c4-49c5-a425-4ed1ab27448b/entries/' + year + '/' + month,
			  method: 'GET'
			};

		http.get(options, function(res) {
		  var body = '';
		  res.on('data', function(chunk) {
			body += chunk;
		  });
		  res.on('end', function() {
			  var msg = JSON.parse(body);
			  var key = year + '-' + month + '-' + day;
			  //console.log(msg);
			  console.log(key);
			  var onRota = msg.find(function(ele) { return ele['date'] === key; });
			  
			  //console.log(body);
			console.log(onRota.entry);
			var entry = onRota.entry;
			if (entry === '')
			{
				entry = "No one!";
			}
			
			poster('#sdcs', 'On the <http://www.rotatastic.com/#/af59070d-b2c4-49c5-a425-4ed1ab27448b/|rota> today: ' + entry);
		  });
		}).on('error', function(e) {
		  console.log("Got error: " + e.message);
		}); 
	};
	//getRota();
	//var job = schedule.scheduleJob("0 9 * * *", getRota);

	//jobs.push(job);

  for (var unclosedItem of schedules) {
    let item = unclosedItem;
    console.log(`Registering a job with schedule ${item.cron} for channel ${item.channel} and message ${item.message}`);
    var job = schedule.scheduleJob(item.cron, function () { poster(item.channel, item.message); });
    jobs.push(job);
  }
  return jobs;
};
