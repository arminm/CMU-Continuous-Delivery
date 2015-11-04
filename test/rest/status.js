var expect = require('expect.js');
var Client = require('node-rest-client').Client;
var User = require('../../models/user.js');
var Status = require('../../models/status.js');
var dbModule = require('../../config/db.js');
var db = dbModule.getDB();

suite('REST: Status', function() {
  var statusCrumbID;
  var statusInfo;
  var client = new Client();

  setup(function(done) {
    // Connect to database
    var userInfo = {
      fullName: 'Armin',
      username: 'armin',
      password: '1234',
      createdAt: 123123123123
    }
    User.create(userInfo, function(isCreated) {
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
    var args = {
      data : {statusCode: "Help", statusUpdatedAt: 1232121421521},
      headers: {"Content-Type": "application/json"}
    };
    client.post("http://localhost:4444/status/armin", args, function(data,response) {
      expect(response.statusCode).to.eql(201);
      done();
    });
  });

  test('Update the status of a non existing user', function(done) {
    var args = {
      data : {statusCode: "Help", statusUpdatedAt: 1232121421521},
      headers: {"Content-Type": "application/json"}
    };
    client.post("http://localhost:4444/status/dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get an existing statusCrumb', function(done) {
    var args = {};
    client.get("http://localhost:4444/status/" + statusCrumbID, args, function(data, response) {
      expect(response.statusCode).to.eql(200);
      done();
    });
  });

  test('Get a non-existing statusCrumb', function(done) {
    var args = {};
    client.get("http://localhost:4444/status/" + "-1", args, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get all status crumbs for an existing user', function(done) {
    var args = {};
    client.get("http://localhost:4444/status?username=armin", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      expect(JSON.parse(data)).to.have.length(2);
      done();
    });
  });

  test('Get all status crumbs for a non-existing user', function(done) {
    var args = {};
    client.get("http://localhost:4444/status?username=pragya", args, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });
});
