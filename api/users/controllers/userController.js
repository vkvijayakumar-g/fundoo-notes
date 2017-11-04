  /**
  * user controller [it controls the all CRUD operations taken place in user]
  * @path controller/userController.js
  * @file userController.js
  * Scripted by Vijayakumar
  */
  var passport = require('passport');

  var UserServices = require('../services/userServices').UserServices;
  var userServices = new UserServices();

  function UserController() {}

  /**
   * @method init() => Init this object
   **/
  UserController.prototype.init = function() {}
  /*
    rendering the index.jade
   */
  UserController.prototype.index = function(req, res) {
    var alertmsg = req.flash('loginMessage') || req.query.alertmsg;
    res.render('index.jade', {
      message: alertmsg
    });
  }

  /*
    rendering the password.jade
   */
  UserController.prototype.setPasswordPage = function(req, res)
  {
    res.render('password.jade', {
      mail: req.query.email,
      id: req.query.id,
      otp: req.query.otp
    });
  }
  UserController.prototype.setPassword = function(req, res)
  {
    console.log(req.body);


    userServices.setPassword(req, function(err, data) {
      if (err) console.log(err);
      console.log(data);
      if(data=='done')
      {
      //   res.render('index.jade', {
      //     message: " User Created Sucessfully!"
      // });
      res.json({status:"done"})
      }
      if(data==null)
      {
      res.json({status:null})
      }
      if(data=='expired')
      {
        res.json({status:"expired"})
      }
    })
  }
  /*
    rendering the profile.jade
   */
  UserController.prototype.userProfile = function(req, res) {
    var user_id = req.user._id;
    var user_name = req.user.userName;
    var user_mail = req.user.local.email;
    var user_imgsrc = req.user.userImage || "./views/images/moonblue.png";
    res.render('profile.jade', {
      userid: user_id,
      username: user_name,
      usermail: user_mail,
      profilePic: user_imgsrc
    });
  }
  /*
    Changing the profile picture
   */
  UserController.prototype.updateProfile = function(req, res) {
    userServices.updateProfile(req, function(err, data) {
      if (err) res.end('Something went Wrong');
      res.redirect('/profile');
    })
  }
  /**
   * @method forgot password
   * @param  {object} req [req.body contains the user mail]
   * @param  {[type]} res [object having the status]
   * @return {[type]}     [staus and error messages ]
   */
  UserController.prototype.forgotPassword = function(req, res) {
    userServices.forgotPassword(req, function(err, data) {
      if (err) {
        res.render('forgotpassword.jade', {
          message: "User Doesn't exists"
        });
      }
      if (data) {
        res.redirect('https://accounts.google.com/signin')
      }
    })
  }
  /**
   * @method changing the password
   * @param  {object} req [contains the user query if]
   * @param  {object} res [object status message]
   */
  UserController.prototype.changePassword = function(req, res) {
    userServices.changePassword(req, function(err, data) {
      if (err) {
        res.render('changePassword.jade', {
          message: "Invalid OTP!"
        });
      } else if (data == 'expired') {
        res.render('changePassword.jade', {
          message: "OTP Expired !"
        });
      } else {
        res.render('index.jade', {
          message: "Password Changed Sucessfully!"
        });
      }
    })
  }
  /*
    rendering the jade file
   */
  UserController.prototype.forgotPassworPage = function(req, res) {
    if (req.query != null) {
      res.render('forgotpassword.jade', {
        message: req.query.err
      })
    } else {
      res.render('forgotpassword.jade', {
        message: req.flash('resetpwdmessage')
      });
    }
  }
  /*
    rendering the jade file
   */
  UserController.prototype.changePasswordPage = function(req, res) {
    res.render('changePassword.jade', {
      mail: req.query.email,
      id: req.query.id,
      otp: req.query.otp
    });
  }

  UserController.prototype.verifyUser =function(req,res)
  {
    console.log("controller");
    userServices.verifyUser(req,function(err,data)
  {
    if(err)console.log(err);
    res.send(data);
  })
  }
  UserController.prototype.getOwner = function(req,res)
  {
    userServices.getOwner(req,function(err,data)
  {
    if(err)console.log(err);
    if(data)
    {
      res.send(data);
    }
  })
  }
  module.exports = {
    UserController: UserController
  };
