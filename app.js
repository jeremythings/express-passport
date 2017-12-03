var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

// passport dependencies
const passport = require('passport')
const session = require('express-session')

var index = require('./routes/index');
var auth = require('./routes/auth');

var app = express();

// set up ports to use for the server
app.locals.hostname = 'localhost';
app.locals.httpport = 3000;
app.locals.httpsport = 3443;
app.locals.urlhttp = 'http://' + app.locals.hostname + ':' + app.locals.httpport;
app.locals.urlhttps = 'https://' + app.locals.hostname + ':' + app.locals.httpsport;

// ===================
// Passport middleware
// ===================

// set passport bits
app.use(session({secret: 'mysecret',
                 saveUninitialized: true,
                 resave: true}));
app.use(passport.initialize());
app.use(passport.session());
// set up the strategies
var setpassport = require('./my-modules/setuppassport');
setpassport.setup(passport);

// ==========================
// End of Passport middleware
// ==========================

// middle ware Set locals for all
app.use(function(req, res, next) {
  if (req.user) {
    console.log("User: " + req.user.username);
    res.locals = {
      currentusername: req.user.username,
    };
  }
  next();
});

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
