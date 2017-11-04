/**
 * authentication of valid user in session
 * @param  {object}   req  [contains all the user details for a period of seesion]
 * @param  {[type]}   res  [response status]
 * @param  {Function} next [if authenticated user then next process has to be take place ]
 * @return {[type]}        [next return the process that to be take place]
 */
module.exports.auth = function(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
