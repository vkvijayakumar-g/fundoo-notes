  /****
     * userSchema.js
     @path models/userSchema.js
     @file userSchema.js
     ****/

  var mongoose = require('mongoose');
  var bcrypt = require('bcrypt-nodejs');

  /**
   * define user schema for our user model
   */
  var userSchema = mongoose.Schema({
    userId: {
      type: String
    },
    userName: {
      type: String
    },
    userImage: {
      type: String,
      default: "./views/images/profile.png"
    },
    local: {
      email: String,
      password: String
    },
    google: {
      email: String
    },
    facebook: {
      email: String
    }
  });

  /**
   * encrypting the password
   * @param  {[string]} password [user login password]
   * @return {[string]}          [generating the hash code for password]
   */
  userSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  /**
   * validation of password
   * @param  {[string]} password [user login encrypted password]
   * @return {[type]}            [decrypting the hash password]
   */
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
  };
  /**
   * updateUserProfile
   * @param  {[type]} query  [contains the userId]
   * @param  {[type]} update [query contains the update data]
   */
  userSchema.statics.updateProfile = function(query, update, callback) {
    this.findOneAndUpdate(query, update).exec(callback);
  }

  /**
   * authenticate the user
   * @param  {[type]}   query    [contains the valid user mail id ]
   * @param  {Function} callback [return back the processed data ]
   */
  userSchema.statics.findUser = function(query, callback) {
    this.findOne(query,function(err,data)
  {
    if(err)callback(err,null)
    else {
      callback(null,data);
    }
  })
  }
  userSchema.statics.createUser = function(data,callback)
  {
      var newUser = new this();
      // set the user's local credentials
      newUser.userId = newUser._id
      newUser.userName = data.username;
      newUser.local.email = data.email;
      newUser.local.password = this.generateHash(data.password);

      // save the user
      newUser.save(function(err) {
        if (err)
          callback(err,null)
        else {
          callback(null,'done');
        }

      });

  }


  module.exports = mongoose.model('User', userSchema);
