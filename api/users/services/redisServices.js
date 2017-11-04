  var redis = require('redis');
  var uuid = require('uuid');
  var redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
  });

  /**
   * setting the one time password to redis cache memory
   * @param  {object}   req      [contains the user details]
   * @param  {var}   id       [as a variable with unique value ]
   * @param  {var}   otp      [one time password]
   * @param  {Function} callback [sends err/data back]
   */
  module.exports.setOTP = function(mail, id, otp, callback) {
    redisClient.hmset(id, "mail", mail, "otp", otp, function(err, reply) {
      if (err) callback(err, null);
      else {
        redisClient.expire(id, 5*60*60);
        callback(null, reply);
      }
    })
  }
  /**
   * retrieving the otp for that particular user which is setted on forgot password
   * @param  {object}   req      [contains the user details]
   * @param  {Function} callback [sends err/data back]
   */
  module.exports.getOTP = function(id, callback)
  {
    redisClient.hgetall(id, function(err, data) {
      if (err) callback(err, null)
      else {
        callback(err, data)
      }
    })
  }
  /**
   * deletoing the otp once the password is setted
   * @param  {object}   req      [contains the user details]
   * @param  {Function} callback [sends err/data back]
   */
  module.exports.delOTP = function(req, callback) {
    redisClient.del(id, function(err, data) {
      if (err) callback(err);
    })
  }
