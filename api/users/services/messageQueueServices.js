
/**
 * declaring modules
 */
var amqp = require('amqp');
var mailer=require('./userEmailServices.js')
var rabbitMqConnection = amqp.createConnection({ host: '127.0.0.1'});
var e1,q1;
/**
 * for better debuging
 */
rabbitMqConnection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

/**
 * waiting for connection to become established
 */
rabbitMqConnection.on('ready', function () {
  //creating exchange
  e1 = rabbitMqConnection.exchange('mail-exchange');
  //creating queue
  q1 = rabbitMqConnection.queue('userVerificationQueue',function(q){
    q.bind(e1,'verifyUser');
    // Receive messages
    q.subscribe(function (data) {
      mailer.sendEmail(data.email,data.url,data.subject,data.id,data.otp,function(err,resp){
        console.log(err,resp);
      })
    });
  });
});

/**
 * pushing object into queue
 */
exports.enqueue=function(email,url,subject,id,otp,routingKey)
{
  e1.publish(routingKey, {email:email,url:url,subject:subject,id:id,otp:otp});
}
