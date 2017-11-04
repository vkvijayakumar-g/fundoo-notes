var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./../../../config/config');
// load up the user model
var User = require('../models/userSchema');

// load the auth variables

// load the authentication process to be done
var googleOAuth = require('./google.js');
var facebookOAuth = require('./facebook.js');
var loginOAuth = require('./logIn.js');

module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  loginOAuth.login(passport, LocalStrategy, User, configAuth);

  googleOAuth.google(passport, GoogleStrategy, User, configAuth);

  facebookOAuth.facebook(passport, FacebookStrategy, User, configAuth);

};
