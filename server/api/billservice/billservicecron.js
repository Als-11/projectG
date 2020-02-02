var schedule  = require('node-schedule');
/* run the job at 18:55:30 on Dec. 14 2018*/
var date = new Date(2018, 11, 14, 18, 56, 30);
/* This runs at the 30th mintue of every hour. */
 var j = schedule .scheduleJob('1 * * * * *', function(){ 
});
