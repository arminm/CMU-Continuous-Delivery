var Status = require('../../models/status.js');
var expect = require('expect.js');
var db = require('../../config/db.js');
var Utils = require('../../utilities.js');
var now = function() {return (new Date()).getTime();};

// Creates a statusCrumb double object to be used for creating statusCrumbs
// in the database and checking the results
function createDouble(options) {
  var double = {
    username: options.username || 'Random Username ' + now(),
    statusCode: options.statusCode || 'OK',
    statusUpdatedAt: options.statusUpdatedAt || now()
  };
  return double;
};

// Compare two statusCrumb objects
function areTheSame(double, statusCrumb) {
  return Utils.areEqual(double, Utils.replacer(statusCrumb, ['crumbId']));
}

suite('Status: ', function() {
  var statusCrumbA, statusCrumbB;

  setup(function() {
    statusCrumbA = createDouble({
      username: 'armin',
      statusCode: 'Help',
      statusUpdatedAt: now()
    });

    statusCrumbB = createDouble({
      username: 'armin',
      statusCode: 'Emergency',
      statusUpdatedAt: now() + 1
    });
  });

  teardown(function() {
    // Clean up
    db.run("DELETE FROM statusCrumbs");
  });

  test('Change a user\'s status', function(done) {
    Status.createStatusCrumb(statusCrumbA, function(crumbId, error) {
      expect(crumbId).to.be.ok();
      expect(error).to.not.be.ok();
      Status.getStatusCrumb(crumbId, function(statusCrumb, error) {
        expect(areTheSame(statusCrumbA, statusCrumb)).to.be.ok();
        done();
      });
    });
  });

  test('Get an existing statusCrumb', function(done) {
    Status.createStatusCrumb(statusCrumbA, function(crumbId, error) {
      Status.getStatusCrumb(crumbId, function(statusCrumb, error) {
        expect(error).to.not.be.ok();
        expect(areTheSame(statusCrumbA, statusCrumb)).to.be.ok();
        done();
      });
    });
  });

  test('Get a non-existing statusCrumb', function(done) {
    Status.getStatusCrumb(-1, function(statusCrumb, error) {
      expect(statusCrumb).to.not.be.ok();
      expect(error).to.not.be.ok();
      done();
    });
  });

  test('Get all statusCrumbs for an existing user', function(done) {
    Status.createStatusCrumb(statusCrumbA, function() {
      Status.createStatusCrumb(statusCrumbB, function() {
        Status.getAllStatusCrumbs(statusCrumbA.username, function(statusCrumbs, error) {
          expect(error).to.not.be.ok();
          // make sure there are two statusCrumbs
          expect(statusCrumbs.length).to.eql(2);
          // make sure they are not the same statusCrumbs
          expect(areTheSame(statusCrumbs[0], statusCrumbs[1])).to.not.be.ok();
          // Count matching unique statusCrumbs
          var matchCount = 0;
          for (var statusCrumb of statusCrumbs) {
            if (areTheSame(statusCrumbA, statusCrumb) || areTheSame(statusCrumbB, statusCrumb)) {
              matchCount++;
            }
          }
          expect(matchCount).to.eql(2);
          done();
        });
      });
    });
  });

  test('Get statusCrumbs for a non-existing user', function(done) {
    Status.getAllStatusCrumbs("random username", function(statusCrumbs, error) {
      expect(error).to.not.be.ok();
      expect(statusCrumbs.length).to.eql(0);
      done();
    });
  });

});
