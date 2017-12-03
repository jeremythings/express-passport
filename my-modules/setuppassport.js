// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var db = require('../my-modules/db');
var bcrypt = require('bcrypt-nodejs');

console.log("passport - connection");

// expose this function to our app using module.exports
module.exports = {

  setup: function(passport) {

    // SESSION SETUP
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // console.log("passport session setup");
    passport.serializeUser(function(user, done) {
      console.log("passport - serializeUser " + JSON.stringify(user));
      done(null, user.uid);
    });

    // used to deserialize the user
    passport.deserializeUser(function(uid, done) {
      console.log("passport - deserializeUser " + uid);
      db.getUser(uid, function(err, results) {
        console.log("deserializerUser returned from get user " + JSON.stringify(results));
        done(err, results[0]);
      });
    });

    // LOCAL SIGNUP
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
      'local-signup',
      new LocalStrategy({
          // by default, local strategy uses username and password
          usernameField: 'usernamereg',
          passwordField: 'passwordreg',
          passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
          console.log("Checking if users exists already");
          if (!req.secure) {
            return done(null, false, req.flash('error', 'Need secure login'));
          }
          // checking to see if the user trying to login already exists
          db.checkUserExists(username, function(err, results) {
            console.log("returned from get user");
            // this probably equates to user not found but the test
            // after confirms this
            if (err) {
              console.log('error', err.message);
            }
            if (results.length) {
              console.log("rows has a length");
              console.log('That username is already taken.');
              return done(null, false, req.flash('error', 'That username is already taken.'));
            } else {
              console.log("Now creating user");
              var data = {
                username: username,
                password: bcrypt.hashSync(password, null, null) // use the generateHash function in our user model
              };
              console.log("Inserting new user");

              db.addUser(data, function(err, uid) {
                if (err) {
                  console.log("Failed to insert new user")
                  return done(null, false);
                }
                data.uid = uid;
                console.log("going to return to where called from");
                data.password = "You must be joking";
                return done(null, data);
              });
            }
          });
        })
    );

    // LOCAL LOGIN
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
      'local-login',
      new LocalStrategy({
          // by default, local strategy uses username and password
          usernameField: 'username',
          passwordField: 'password',
          passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        // callback with username and password from our form
        function(req, username, password, done) {
          console.log("passport - local login " + username);
          if (!req.secure) {
            return done(null, false, req.flash('error', 'Need secure login'));
          }
          db.getUserPasswordByName(username, function(err, results) {
            console.log("passport - callback from queery");
            console.log("Results: " + JSON.stringify(results));
            if (err) {
              console.log("passport - error: " + err.message);
              return done(null, false, req.flash('error', err.message));
            }
            console.log("local login results length: " + results.length);
            if (!results.length) {
              console.log("passport - no user found");
              return done(null, false, req.flash('error', 'No user found.'));
            }
            // if the user is found but the password is wrong
            console.log("passport - user found" + JSON.stringify(results));
            if (!bcrypt.compareSync(password, results[0].password)) {
              console.log("Passwords do not match");
              return done(null, false, req.flash('error', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            console.log("Passwords match");
            // the return is the string that is used for serializing
            // should make sure it does not contain a password
            results[0].password = "Not telling you";
            return done(null, results[0]);
          });
        })
    );
  }
};
