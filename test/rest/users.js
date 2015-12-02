var User = require('../../models/user.js');
var expect = require('expect.js');
var dbModule = require('../../config/db.js');
var db = dbModule.getDB();
var Client = require('node-rest-client').Client;
var client = new Client();
var Utils = require('../../utilities.js');
var now = function() {return (new Date()).getTime();};

var host = "http://localhost:4444/";

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
    isOnline: options.isOnline || true,
    statusCode: options.statusCode || 'OK',
    statusUpdatedAt: options.statusUpdatedAt || currentTime,
    profile: options.profile || 'CITIZEN'
  };
  return double;
};

// POSTs to server to create a user in the database using a user double
function postUser(double, callback) {
  var args = {
    data: double,
    headers:{"Content-Type": "application/json"}
  };
  client.post(host+"signup/"+double.username, args, function(data,response) {
    callback(data, response);
  });
};

// GETs a user from server
function getUser(double, callback) {
  var args = {
    data: double,
    headers:{"Content-Type": "application/json"}
  };
  client.get(host+"users/"+double.username, args, function(data,response) {
    callback(data, response);
  });
};

// PUTs a user (updates a user)
function putUser(options, access_key, callback) {
  var args = {
    data: options,
    headers:{"Content-Type": "application/json"}
  };
  client.put(host+"users/"+options.username+"?access_key="+access_key, args, function(data,response) {
    callback(data, response);
  });
};

// Compare two user objects
function areTheSame(double, user) {
  return Utils.areEqual(Utils.replacer(double, ['password']), user);
}

// Create admin
function createAdmin(callback) {
  db.run('INSERT INTO users (profile, username, password, createdAt) VALUES ($1, $2, $3, $4);', {
    $1: "ADMINISTRATOR",
    $2: "SSNAdmin",
    $3: "admin",
    $4: 1231234442231
  }, function(error) {
    expect(error).not.to.be.ok();

    db.run('INSERT INTO statusCrumbs (username, statusCode, statusUpdatedAt) VALUES ($1, $2, $3);', {
      $1: "SSNAdmin",
      $2: "OK",
      $3: 1231234442231
    },function(error) {
      expect(error).not.to.be.ok();
      callback();
    });
  });
};

suite('REST: User', function() {
  // Create user doubles to verify actual users with
  var userArmin, userDimitris;
  setup(function(done) {
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
    postUser(userDimitris, function(data,response) {
      expect(response.statusCode).to.eql(201);
      done();
    });
  });

  teardown(function() {
    // Clean up
    db.run("DELETE FROM users");
    db.run("DELETE FROM statusCrumbs");
  });

  test('Create a new user that does not exist and get it', function(done) {
    postUser(userArmin, function(data,response) {
      expect(response.statusCode).to.eql(201);
      getUser(userArmin, function(data,response) {
        expect(response.statusCode).to.eql(200);
        expect(areTheSame(userArmin, JSON.parse(data))).to.be.ok();
        done();
      });
    });
  });

  test('Create a new user that exists: correct password', function(done) {
    postUser(userDimitris, function(data,response) {
      expect(response.statusCode).to.eql(200);
      done();
    });
  });

  test('Create a new user that exists: wrong password', function(done) {
    userDimitris.password = "wrong";
    postUser(userDimitris, function(data,response) {
      expect(response.statusCode).to.eql(401);
      done();
    });
  });

  test('Get a non-existing user', function(done) {
    getUser({username: "pragya"}, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Non-existing user cant update an existing user', function(done) {
    var options = {
      isActive: 1,
      givenUsername: "newDimitris",
      profile: "COORDINATOR",
      username: userDimitris.username
    };

    putUser(options, "none", function(data,response){
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Citizen cant update an existing user', function(done) {
    var options = {
      isActive: 1,
      givenUsername: "newDimitris",
      profile: "COORDINATOR",
      username: userDimitris.username
    };
    userDimitris.isActive = options.isActive;
    userDimitris.username = options.givenUsername;
    userDimitris.password = options.password;
    userDimitris.profile = options.profile;

    postUser(userArmin, function(data,response) {
      expect(response.statusCode).to.eql(201);

      putUser(options, userArmin.username, function(data,response){
        expect(response.statusCode).to.eql(401);
        done();
      });
    });
  });

  test('Admin updates an existing user', function(done) {
    createAdmin(function(){

      var options = {
        isActive: 0,
        givenUsername: "newDimitris",
        profile: "COORDINATOR",
        username: userDimitris.username
      };
      userDimitris.isActive = options.isActive;
      userDimitris.username = options.givenUsername;
      userDimitris.password = options.password;
      userDimitris.profile = options.profile;

      putUser(options, "SSNAdmin", function(data,response){
        expect(response.statusCode).to.eql(200);

        getUser(userDimitris, function(data, response){
          expect(response.statusCode).to.eql(200);
          expect(areTheSame(userDimitris, JSON.parse(data))).to.be.ok();
          done();
        });
      });
    });
  });

  test('Citizen gets all users', function(done) {
    createAdmin(function(){
      postUser(userArmin, function(data,response) {
        expect(response.statusCode).to.eql(201);
        var options = {
          isActive: 0,
          username: userArmin.username
        };
        putUser(options, "SSNAdmin", function(data,response) {
          expect(response.statusCode).to.eql(200);
          client.get(host+"users?access_key="+userDimitris.username, {}, function(data,response) {
            expect(response.statusCode).to.eql(200);
            var parsedData = JSON.parse(data);
            expect(parsedData).to.have.length(2);
            for(obj of parsedData) {
              expect(obj.isActive).to.eql(1);
              expect(obj.username).not.to.eql(userArmin.username);
            }
            done();
          });
        });
      });
    });
  });

  test('Admin gets all users', function(done) {
    createAdmin(function(){
      postUser(userArmin, function(data,response) {
        expect(response.statusCode).to.eql(201);
        var options = {
          isActive: 0,
          username: userArmin.username
        };
        putUser(options, "SSNAdmin", function(data,response) {
          expect(response.statusCode).to.eql(200);
          client.get(host+"users?access_key=SSNAdmin", {}, function(data,response) {
            expect(response.statusCode).to.eql(200);
            var parsedData = JSON.parse(data);
            expect(parsedData).to.have.length(3);
            for(obj of parsedData) {
              if (obj.username == userArmin.username) {
                expect(obj.isActive).to.eql(0);
              } else {
                expect(obj.isActive).to.eql(1);
              }
            }
            done();
          });
        });
      });
    });
  });
});
