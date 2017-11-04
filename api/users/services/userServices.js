  var userModel = require("../models/userSchema");
  var userProfile = require("./userProfileServices");
  var userEmail = require("./userEmailServices");
  var userRedis = require("./redisServices");
  var otpGenerator = require('otp-generator');
  var messageQueue = require('./messageQueueServices.js');
  var uuid = require('uuid');

  function UserServices() {

  }

  /**
   * @method init() => Init this object
   **/
  UserServices.prototype.init = function() {}

  UserServices.prototype.updateProfile = function(req, callback) {

    userProfile(req, function(err, result) {
      if (err) {
        callback(err, null)
      } else {
        callback(null, 'done');
      }
    });
  };

  UserServices.prototype.verifyUser = function(req,callback) {

    var query= {
      'local.email': req.body.email
    }
    userModel.findUser(query, function(err, user)
    {
          if (err)
            callback(err,null);
          if (user)
          {
            callback(null, 'Exists');
          }
          else
          {
            var mail= req.body.email
            var id = uuid.v4(mail);

            var otp = otpGenerator.generate(6, {
              upperCase: false,
              specialChars: false
            });
            var subject='Verify User  ✔';
            var url = "http://localhost:6056/setPassword?otp=" + otp + "&id=" + id;
            messageQueue.enqueue(mail,url,subject,id,otp,'verifyUser');
            callback(null,'done',)
          }
    });

    }

  /**
   * @method forgot Password
   * @param  {object}   req      [contains the userid]
   * @param  {Function} callback [send err/data back to the controller]
   */

  UserServices.prototype.forgotPassword = function(req, callback) {
    var query = {
      'local.email': req.body.email
    };
    userModel.findUser(query, function(err, user) {
      if (err) console.log(err);
      if (user == null) {
        callback(err, null);
      } else {

        var id = uuid.v4(req.body.email);

        var otp = otpGenerator.generate(6, {
          upperCase: false,
          specialChars: false
        });
        var mail=req.body.email;
        var subject='Reset Password Code ✔';
        var url = "http://localhost:6056/changePassword?otp=" + otp + "&id=" + id;
        /**
         * [sending email]
         * @param  {[type]} err  [return error if occurs]
         * @param  {object} data [data contains the user details]
         */
        userEmail.sendEmail(mail,url,subject,id,function(err, data) {
          if (err) console.log(err);
          else {
            callback(null, data)
          }
        })
      }
    });

  }

  /**
   * @method change password
   * @param  {object} req [updated password ]
   * @return {[type]}      [status and message]
   */
  UserServices.prototype.changePassword = function(req, callback) {
    var id= req.query.id;
    userRedis.getOTP(id, function(err, data) {

      if (err) console.log(err);
      if (data) {
        if (data.otp == req.body.otp) {
          var query = {
            "local.email": req.body.email
          };
          var update = {
            $set: {
              'local.password': userModel.generateHash(req.body.password)
            }
          };
          /**
           * userModel-description
           * @param  {[type]} err  [function err]
           * @param  {[type]} data [updated data ]
           * @return {[type]}      [status and message]
           */
          userModel.updateProfile(query, update, function(err, data) {
            if (err) console.error(err);
            else {
              userRedis.delOTP(id, function(err) {
                if (err) console.log(err);
              })
              callback(null, 'done');
            }
          })
        } else {
          callback(err, null)
        }
      } else {
        callback(err, 'expired')
      }
    })
  }

  UserServices.prototype.setPassword = function(req, callback) {
    var id= req.body.id;
    console.log("coming toset password");
    userRedis.getOTP(id, function(err, data)
    {
      console.log("checking otp");
      if (err) console.log(err);
      if (data)
      {
        if (data.otp == req.body.otp)
        {
          console.log("otp checked");
          var query={
            'username':req.body.username,
            'email':data.mail,
            "password":req.body.password
          }
          /**
           * userModel-description
           * @param  {[type]} err  [function err]
           * @param  {[type]} data [updated data ]
           * @return {[type]}      [status and message]
           */
          userModel.createUser(query, function(err, data) {
            if (err) callback(err, null)
            if(data)
            {
                callback(null, 'done');
            }
          })
        }
        else {
            callback(null,'expired');
        }
      }
    })

  }
  UserServices.prototype.getOwner= function(req,callback)
  {
    var query={'userId':req.body.userid}
    userModel.findUser(query,function(err,data)
  {
    if(err)callback(err,null)
    if(data)
    {
      var user={
        'username':data.userName,
        'email':data.local.email,
        'image':data.userImage
      }
        callback(null,user);
    }
  })
  }
  module.exports = {
    UserServices: UserServices
  };
