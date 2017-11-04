  /*
        Module dependencies
       */
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');
  var userRedis = require("./redisServices");
  var userModel = require('../models/userSchema');
  var config = require('./../../../config/config');
  /**
   * [transporter description]
   * nodemailer using smtpTransport to send mail
   */
  module.exports.sendEmail = function(mail,url,subject,id,otp, callback) {
    var transporter = nodemailer.createTransport(smtpTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      auth: {
        user: config.mail.user,
        pass: config.mail.pass
      }
    }));

    userRedis.setOTP(mail, id, otp, function(err, reply) {
      if (err) console.log(err);
    })
    var mailOptions = {
      from: config.mail.user, // sender address
      to: mail, // list of receivers
      subject: subject, // Subject line
      html: url // html body
    };
    /*
      Sending the email
     */
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      callback(null, 'done');
    });
  }
