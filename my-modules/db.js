// db.js
// =====
const uuid = require('../my-modules/simpleuuid');
const bcrypt = require('bcrypt-nodejs');

// This is a simple data structure for users
// it is non persistent so any changes are lost when
// you stop/start the server
var users = {
  'jeremy': {
    uid: uuid.uuid(),
    username: 'jeremy',
    password: bcrypt.hashSync('blah', null, null)
  },
  'fred': {
    uid: uuid.uuid(),
    username: 'fred',
    password: bcrypt.hashSync('blah', null, null)
  }
};
// This is used to index the users by uid
var usersbyid = {};
// This builds the initial index
for (var key in users) {
  if (users.hasOwnProperty(key)) {
    usersbyid[users[key].uid] = users[key].username;
  }
}
// list the initial data
console.log('Initial data: ' + JSON.stringify(users, null, 2));
console.log('Indexes on userid: ' + JSON.stringify(usersbyid, null, 2));

// These are the database routines, as a rule I never return the passowrd wit
// any of the database queeries other than a specific queery to get the password
// I do not want to risk return a user object with a password in it
module.exports = {
  getUserByName: function(username, cb) {
    console.log("getUserByName");
    var err = null;
    var data = [];
    if (!(username in users)) {
        err = new Error('getUserByName - user does not exist');
    } else {
      data.push({ username: users[username].username, uid: users[username].uid});
    }
    if (err) {
        console.log('getUserByName - ' + err + ' ' + JSON.stringify(data));
    }
    cb(err, data);
  },
  getUserPasswordByName: function(username, cb) {
    console.log("getUserPasswordByName");
    var err = null;
    var data = [];
    if (!(username in users)) {
        err = new Error('user does not exist');
    } else {
      data.push({ username: users[username].username, password: users[username].password, uid: users[username].uid});
    }
    if (err) {
        console.log('getUserPasswordByName - ' + err + ' ' + JSON.stringify(data));
    }
    cb(err, data);
  },
  // this should never return password
  getUser: function(uid, cb) {
    console.log("getUser - " + uid);
    var err = null;
    var data = [];
    if (!(uid in usersbyid)) {
        err = new Error('user does not exist');
    } else {
      data.push({ username: users[usersbyid[uid]].username, uid: users[usersbyid[uid]].uid});
    }
    if (err) {
        console.log('getUser - ' + err.message + ' ' + JSON.stringify(data));
    }
    cb(err, data);
  },
  checkUserExists: function(username, cb) {
    console.log("checkUserExists " + username);
    var err = null;
    var data = [];
    if (!(username in users)) {
       err = new Error('user does not exist');
    } else {
      data.push({ username: users[username].username });
    }
    if (err) {
        console.log('checkUserExists - ' + err.message + ' ' + JSON.stringify(data));
    }
    cb(err, data);
  },
  addUser: function(data, cb) {
    console.log("addUser - about to insert " + JSON.stringify(data));
    err = null;
    users[data.username] = {uid: uuid.uuid(), username: data.username, password: data.password};
    usersbyid[users[data.username].uid] = users[data.username].username;
    console.log("addUser - users are now: " + JSON.stringify(users,null,2));
    console.log("addUser - usersbyid are now: " + JSON.stringify(usersbyid,null,2));
    if (!(data.username in users)) {
        err = new Error('failed to add user');
    }
    if (err) {
        console.log('addUser - ' + err.message)
        cb(err, false);
    } else {
      console.log("addUser - Returning id: " + users[data.username].uid);
      cb(err, users[data.username].uid);
    }
  }
};
