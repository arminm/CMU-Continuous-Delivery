var User = require('../../models/user.js');
var expect = require('expect.js');
var db = require('../../config/db.js');
var Utils = require('../../utilities.js');
var now = function() {return (new Date()).getTime();};

// Creates a user double object to be used for creating users
// in the database and checking the results
function createDouble(options) {
  var currentTime = now();
  var double = {
    fullName: options.fullName || 'Random Name',
    username: options.username || 'Random Username ' + currentTime,
    password: options.password || '1234',
    createdAt: options.createdAt || currentTime,
    updatedAt: options.updatedAt || null,
    lastLoginAt: options.lastLoginAt || currentTime,
    isActive: options.isActive || true,
    isOnline: options.isOnline || true
  };
  return double;
};

// Gets actual users from the database
function getUser(username, callback) {
  User.get(username, function(user, password, error) {
    expect(error).to.not.be.ok();
    if (user && !error) {
      expect(password).to.be.ok();
      callback(user, password);
    } else {
      callback(null, null, error);
    }
  });
};

// Creates the actual user in the database using a user double
function createUser(double, callback) {
  User.create(double, function(isCreated, error) {
    if (isCreated && !error) {
      getUser(double.username, function(user, password){
        expect(double.password === password).to.be.ok();
        callback(isCreated, error, user);
      });
    } else {
      callback(isCreated, error);
    }
  });
};

// Updates a user in the database
function updateLogin(double, callback) {
  User.updateLogin(double.username, double.lastLoginAt, double.isOnline, function(isUpdated, error) {
    if (isUpdated && !error) {
      getUser(double.username, function(user){
        callback(isUpdated, error, user);
      });
    } else {
      callback(isUpdated, error);
    }
  });
};

// Compare two user objects
function areTheSame(double, user) {
  return Utils.areEqual(Utils.replacer(double, ['password']), user);
}

suite('User: ', function() {
  // Create user doubles to verify actual users with
  var userArmin, userDimitris;

  setup(function() {
    // Setup
    userArmin = createDouble({
      fullName: 'Armin',
      username: 'armin',
      password: '1234'
    });

    userDimitris = createDouble({
      fullName: 'Dimitris',
      username: 'dimitris',
      password: '1234'
    });
  });

  teardown(function() {
    // Clean up
    db.run("DELETE FROM users");
  });

  test('Create a new user and get it', function(done) {
    createUser(userDimitris, function(isCreated, error, user) {
      expect(isCreated).to.be.ok();
      expect(error).to.not.be.ok();
      expect(areTheSame(userDimitris, user)).to.be.ok();
      done();
    });
  });

  test('Create a user that exists', function(done) {
    createUser(userArmin, function() {
      createUser(userArmin, function(isCreated, error) {
        expect(isCreated).to.not.be.ok();
        expect(error).to.be.ok();
        done();
      });
    });
  });

  test('Get all users', function(done){
    createUser(userArmin, function() {
      createUser(userDimitris, function() {
        User.getAllUsers(function(users, error) {
          expect(error).to.not.be.ok();
          // make sure there are two results, and they are both what we expected
          expect(users.length).to.eql(2);
          // make sure they are not the same user
          expect(areTheSame(users[0], users[1])).to.not.be.ok();
          // Count matching unique users
          var matchCount = 0;
          for (var user of users) {
            if (areTheSame(userArmin, user) || areTheSame(userDimitris, user)) {
              matchCount++;
            }
          }
          expect(matchCount).to.eql(2);
          done();
        });
      });
    });
  });

  test('Get a user that does not exist', function(done) {
    getUser(null, function(user) {
      expect(user).to.not.be.ok();
      done();
    });
  });

  test('Update an existing user\'s info', function(done) {
    userArmin.isOnline = false;
    createUser(userArmin, function() {
      // update the double user
      userArmin.lastLoginAt = now();

      updateLogin(userArmin, function(isUpdated, error, user) {
        expect(isUpdated).to.be.ok();
        expect(error).to.not.be.ok();
        expect(areTheSame(userArmin, user)).to.be.ok();
        done();
      });
    });
  });

  test('Update a non-existing user\'s info', function(done) {
    updateLogin(userArmin, function(isUpdated, error, user) {
      expect(isUpdated).to.be.ok();
      expect(error).to.not.be.ok();
      expect(user).to.not.be.ok();
      done();
    });
  });

  test('Logout', function(done){
    createUser(userArmin, function() {
      userArmin.isOnline = true;
      User.logout(userArmin.username, function(error){
        expect(error).to.not.be.ok();
        getUser(userArmin.username, function(user){
          userArmin.isOnline = false;
          expect(areTheSame(userArmin, user)).to.be.ok();
          done();
        });
      });
    });
  });

});
