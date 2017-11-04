module.exports.google = function(passport,GoogleStrategy,User,configAuth)
{
  passport.use(new GoogleStrategy({

    clientID: configAuth.oAuth.googleAuth.clientID,
    clientSecret: configAuth.oAuth.googleAuth.clientSecret,
    callbackURL: configAuth.oAuth.googleAuth.callbackURL,

  },
  function(token, refreshToken, profile, done)
  {
    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {
      // try to find the user based on their google id
      User.findOne({
        'userId': profile.id
      }, function(err, user) {
        if (err)
          return done(err);

        if (user) {

          // if a user is found, log them in
          return done(null, user);
        } else {
          // if the user isnt in our database, create a new user
          var newUser = new User();

          // set all of the relevant information
          newUser.userId = profile.id;
          newUser.userName = profile.displayName;
          newUser.google.email = profile.emails[0].value; // pull the first email
          newUser.local.email = profile.emails[0].value;
          newUser.userImage = profile._json.image.url;

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });

  }));
}
