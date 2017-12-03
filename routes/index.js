var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Session: " + JSON.stringify(req.session, null, 2));
  // req user is set automaically by passport
  console.log("user: " + JSON.stringify(req.user, null, 2));
  var username = req.user ? req.user.username : 'not logged in';
  res.render('index', {
    title: 'Passport test bed',
    user: username,
    error: req.flash('error')[0],
    success: req.flash('success')[0]
  });
});

module.exports = router;
