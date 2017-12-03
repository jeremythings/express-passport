var express = require('express');
var passport = require('passport');

var router = express.Router();

/* GET login page. */
router.get('/login', function(req, res, next) {
  console.log("Session: " + JSON.stringify(req.session, null, 2));
  // req user I think is set automaically by passport
  console.log("user: " + JSON.stringify(req.user, null, 2));
  var username = req.user ? req.user.username : 'not logged in';
  res.render('index', {
    title: 'Passport test bed',
    user: username,
    error: req.flash('error')[0],
    success: req.flash('success')[0]
  });
});

/* POST login page. */
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/',
  successFlash: 'You are logged in!',
  failureFlash: true
}));

/* POST login page. */
router.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/',
  successFlash: 'You are registered!',
  failureFlash: true,
  session: false // this should prevent loging in automatically after registering
}));


/* GET logout page. */
router.get('/logout', function(req, res, next) {
  // req user is set automaically by passport
  console.log("user: " + JSON.stringify(req.user, null, 2));
  req.logout();
  res.redirect('/');
});

module.exports = router;
