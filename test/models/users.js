var User = require('../../models/user.js');
var expect = require('expect.js');
var db = require('../../config/db.js');

suite('Users: Model', function() {

  setup(function(done) {
    // Connect to database
    User.create('Armin', 'armin', '1234', 123123123123, function(isCreated) {
      done();
    });
  });

  teardown(function() {
    // Clean up
    db.run("DELETE FROM users");
  });

  test('Create a user that does not exist', function(done) {
    // Create a user tha does not exist
    User.create('Dimitris', 'dimitris', '1234', 1232131231231, function(isCreated) {
      expect(isCreated).to.be.ok();
      done();
    });
  });

  test('Create a user that exists', function(done) {
    User.create('Armin', 'armin', '1234', 1232131231231, function(isCreated) {
      expect(isCreated).to.not.be.ok();
      done();
    });
  });

  test('Get an existing user', function(done) {
    User.get('armin', function(user, password, error) {
      expect(user).to.be.ok();
      done();
    });
  });

  test('Get a user that does not exist', function(done) {
    User.get('whatever', function(user, password, error) {
      expect(user).to.not.be.ok();
      done();
    });
  });

  test('Update an existing user\'s info', function(done) {
    User.updateUser('armin', 123123123123, true, function(isUpdated, error) {
      expect(isUpdated).to.be.ok();
      User.get('armin', function(user, password, error) {
        expect(user.lastLoginAt).to.eql(123123123123);
        done();
      });
    });
  });

  test('Update a non-existing user\'s info', function(done) {
    User.updateUser('dimitris', 123123123123, true, function(isUpdated, error) {
      expect(isUpdated).to.be.ok();
      User.get('dimitris', function(user, password, error) {
        expect(user).to.eql(undefined);
        done();
      });
    });
  });

});
