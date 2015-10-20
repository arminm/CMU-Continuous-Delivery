var User = require('../../models/user.js');
var Status = require('../../models/status.js');
var expect = require('expect.js');
var db = require('../../config/db.js');

suite('Status: Model', function() {
  var statusInfo;
  var statusCrumbID;

  setup(function(done) {
    // Connect to database

    User.create('Dimitris', 'dimitris', '1234', 123123123123, function(isCreated) {
      done();
    });

    statusInfo = {
      username: "dimitris",
      statusCode: "Help",
      updatedAt: 12314125125345436
    }

    Status.createStatusCrumb(statusInfo, function(crumbID, error) {
      statusCrumbID = crumbID;
    });
  });

  teardown(function() {
    // Clean up
    db.run("DELETE FROM users");
    db.run("DELETE FROM statusCrumbs");
  });

  test('Change an existing user\'s status', function(done) {
    statusInfo = {
      username: "dimitris",
      statusCode: "Emergency",
      updatedAt: 12314125125135252
    }
    Status.createStatusCrumb(statusInfo, function(crumbID, error) {
      expect(crumbID).to.be.a('number');
      Status.getStatusCrumb(crumbID, function(statusCrumb, error) {
        expect(statusCrumb.statusCode).to.eql('Emergency');
        done();
      });
    });
  });

  test('Get an existing statusCrumb', function(done) {
    Status.getStatusCrumb(statusCrumbID, function(statusCrumb, error) {
      expect(statusCrumb.statusCode).to.eql('Help');
      done();
    });
  });

  test('Get a non-existing statusCrumb', function(done) {
    Status.getStatusCrumb(-1, function(statusCrumb, error) {
      expect(statusCrumb).to.eql(undefined);
      done();
    });
  });

  test('Get all statusCrumbs for an existing user', function(done) {
    Status.getAllStatusCrumbs("dimitris", function(statusCrumbs, error) {
      expect(statusCrumbs).to.have.length(2);
      done();
    });
  });

  test('Get statusCrumbs for a non-existing user', function() {
    Status.getAllStatusCrumbs("armin", function(statusCrumbs, error) {
      expect(statusCrumbs).to.have.length(0);
    });
  });
});
