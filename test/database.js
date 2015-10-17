var expect = require('expect.js');
var sqlite3 = require('sqlite3').verbose();

suite('Database', function() {
  var db;
  var username = 'testUsername';
  var password = '123456';
  var now = new Date();

  setup(function() {
    // Connect to database
    db = require('../config/db.js');
  });
  
  teardown(function() {
    // Clean up
    db.run("DELETE FROM users WHERE username='" + username + "'");
  });

  suite('Test Users', function() {
    test('Store and retrieve a new user', function(done) {
      db.serialize(function () {
        // insert a test user into the database
        var stmt = db.prepare('INSERT INTO users (username, password, createdAt) VALUES (?, ?, ?)');
        stmt.run(username, password, now);
        stmt.finalize();
        //check that the user can be retrieved from the database
        db.get("SELECT username, password, createdAt FROM users WHERE username='" + username + "'", function(err, row) {
          expect(row.username).to.eql(username);
          expect(row.password).to.eql(password);
          expect(now.getTime()).to.eql(row.createdAt);
          // Very important to call done(); since calls are asynchronous
          done(); 
        });
      });
    });
  });
});
