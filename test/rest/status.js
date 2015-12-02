var expect = require('expect.js');
var Client = require('node-rest-client').Client;
var User = require('../../models/user.js');
var Status = require('../../models/status.js');
var dbModule = require('../../config/db.js');
var db = dbModule.getDB();
var client = new Client();
var Utils = require('../../utilities.js');
var now = function() {return (new Date()).getTime();};

var host = "http://localhost:4444/";

// Creates a user double object to be used for creating users
// in the database and checking the results
function createUserDouble(options) {
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

// Creates a statusCrumb double object
function createStatusDouble(options) {
  var currentTime = now();
  var double = {
    username: options.username || 'Random Username ' + currentTime,
    statusCode: options.statusCode || 'OK',
    statusUpdatedAt: options.statusUpdatedAt || currentTime
  };
  return double;
};

// POSTs to server to create a user in the database using a user double
function postStatus(double, callback) {
  var args = {
    data: double,
    headers:{"Content-Type": "application/json"}
  };
  client.post(host+"status/"+double.username, args, function(data,response) {
    callback(data, response);
  });
};

suite('REST: Status', function() {
  var statusCrumbID;
  var statusInfo;
  var client = new Client();
  var userArmin;
  setup(function(done) {
    // Connect to database
    userArmin = createUserDouble({
      fullName: 'Armin',
      username: 'armin',
      password: '1234'
    });
    User.create(userArmin, function(isCreated) {
      statusInfo = {
        username: "armin",
        statusCode: "Help",
        statusUpdatedAt: 12314125125345436
      }

      Status.createStatusCrumb(statusInfo, function(crumbID, error) {
        statusCrumbID = crumbID;
        done();
      });
    });
  });

  teardown(function() {
    // Clean up
    db.run("DELETE FROM users");
    db.run("DELETE FROM statusCrumbs");
  });


  test('Update the status of an existing user', function(done) {
    var double = createStatusDouble({
      username: userArmin.username,
      statusCode: "Help",
      statusUpdatedAt: 1232121421521
    });
    postStatus(double, function(data,response) {
      expect(response.statusCode).to.eql(201);
      done();
    });
  });

  test('Update the status of a non existing user', function(done) {
    var double = createStatusDouble({
      username: "random",
      statusCode: "Help",
      statusUpdatedAt: 1232121421521
    });
    postStatus(double, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get an existing statusCrumb', function(done) {
    client.get(host+"status/"+statusCrumbID, {}, function(data, response) {
      expect(response.statusCode).to.eql(200);
      done();
    });
  });

  test('Get a non-existing statusCrumb', function(done) {
    client.get(host+"status/-1", {}, function(data, response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get all status crumbs for an existing user', function(done) {
    client.get(host+"status?username="+userArmin.username, {}, function(data,response) {
      expect(response.statusCode).to.eql(200);
      expect(JSON.parse(data)).to.have.length(2);
      done();
    });
  });

  test('Get all status crumbs for a non-existing user', function(done) {
    client.get(host+"status?username=pragya", {}, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });
});
