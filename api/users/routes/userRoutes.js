var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../services/authenticate.js').auth;
var UserController = require('../controllers/userController').UserController;
userCntrl = new UserController();
userCntrl.init();

router.get('/', userCntrl.index);
router.post('/verifyUser',userCntrl.verifyUser);
router.get('/profile',auth,userCntrl.userProfile);
router.post('/updateProfile', userCntrl.updateProfile);
router.post('/getOwner',userCntrl.getOwner);
router.get('/setPassword',userCntrl.setPasswordPage);
router.post('/updateUser',userCntrl.setPassword);
router.get('/forgotPassword', userCntrl.forgotPassworPage);
router.get('/changePassword', userCntrl.changePasswordPage);
router.post('/forgotPassword', userCntrl.forgotPassword);
router.post('/changePassword', userCntrl.changePassword);


router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

/**
 *the callback after google has authenticated the user
 */
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

/**
 * facebook routes
 * route for facebook authentication and login
 */
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

/**
 * the callback after facebook has authenticated the user
 */
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));


router.get('/trash',auth,function(req,res)
{
  res.render('trash.jade');
})
router.get('/archive',auth,function(req,res)
{
  res.render('archive.jade');
})
router.get('/reminders',auth,function(req,res)
{
  res.render('time.jade');
})
router.get('/signup',function (req,res)
 {
   res.render('signup.jade');
})

router.get('/logout', function(req, res) {
  req.session.destroy(function(e) {
    req.logout();
    res.redirect('/');
  });
});


module.exports = router;
