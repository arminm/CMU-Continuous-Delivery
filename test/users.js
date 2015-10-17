var User = require('../models/user.js');
var expect = require('expect.js');
process.env['DB'] = 'dev';

suite('Users', function() {
  test('Create a user that does not exist', function(done) {

    // Create a user tha does not exist
    User.create('John1', 'john1', '1234', 1232131231231, function(isCreated) {
      expect(isCreated).to.be.ok();
      done();
    });

    // Delete the user created
    var db = require('../config/db.js');
    db.run("DELETE FROM users WHERE username='john1'");
  });

  test('Create a user that exists', function(done) {
    User.create('John', 'john', '1234', 1232131231231, function(isCreated) {
      expect(isCreated).to.not.be.ok();
      done();
    });
  });

  test('Get a user that exists', function(done) {
    User.get('john', function(user, password, error) {
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

});
