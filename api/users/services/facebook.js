module.exports.facebook = function(passport, FacebookStrategy, User, configAuth) {
  passport.use(new FacebookStrategy({

      // pull in our app id and secret from our auth.js file
      clientID: configAuth.oAuth.facebookAuth.clientID,
      clientSecret: configAuth.oAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.oAuth.facebookAuth.callbackURL,
      enableProof: true,
      profileFields: ['id', 'email', 'displayName', 'photos'],

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {


      // asynchronous
      process.nextTick(function() {

        // find the user in the database based on their facebook id
        User.findOne({
          'userId': profile.id
        }, function(err, user) {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
            return done(err);

          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
            // set all of the facebook information in our user model
            newUser.userId = profile.id; // set the users facebook id
            newUser.userName = profile.displayName; // look at the passport user profile to see how names are returned
            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
            newUser.local.email = profile.emails[0].value;
            newUser.userImage = profile.photos[0].value;
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;

              // if successful, return the new user
              return done(null, newUser);
            });
          }

        });
      });

    }));
}
