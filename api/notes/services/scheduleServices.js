  /*
      Module Dependencies
     */
  var schedule = require('node-schedule');
  var notifier = require('node-notifier');
  var moment = require('node-moment');
  var reminderlist = [];

  /**
   * scheduling the data for remainders for which the card contains the remainder
   * @param  {array} data [sending all card data]
   */
  module.exports.scheduleRemainder = function(data) {
    var len = data.length;
    for (k = 0; k < len; k++) {
      if (data[k].remainder.day != null) {
        schedulingJob(k, data[k]);
      }
    }
  }
  /**
   * canceling the scheduled remainder
   */
  module.exports.cancelRemainder = function(id)
  {
    console.log("cancelJob");
    schedule.cancelJob(id);
  }

  /**
    schedulingJob the job
   */
  function schedulingJob(k, data) {
    var date = new Date(data.remainder.year, data.remainder.month - 1, data.remainder.day, data.remainder.hour, data.remainder.minutes, data.remainder.seconds);
    var joblist = schedule.scheduledJobs;
    var jobstatus = false
    for (data.cardId in joblist) {
      jobstatus = true
    }
    if (jobstatus == true) {
      console.log("rescheduling");
      var job = schedule.rescheduleJob(data.cardId, date, function() {
        notification(data)
        job.cancel();
      })
    } else {
      console.log("scheduling the remainder");
      var job = schedule.scheduleJob(data.cardId, date, function() {
        console.log("scheduled");
        notification(data)
      });
    }
  }
  /*
   notifier is used to notify remainders
   */
  function notification(data) {
    notifier.notify({
      "title": data.title,
      "message": data.content,
      wait: true
    });
  }
