var assert = require("assert");
var sqlite3 = require("sqlite3").verbose();

describe('Database', function() {
  var db;
  var username = 'testUsername';
  var password = '123456';
  var now = new Date();
  before(function() {
    // Connect to database
    db = new sqlite3.Database('ssnoc.db');
  });
  
  after(function() {
    // Clean up
    db.run("DELETE FROM users WHERE username='" + username + "'");
    db.close();
  });

  describe('#checkDB', function() {
    it('should correctly insert and retrieve a new user into database', function(done) {
      db.serialize(function () {
        // insert a test user into the database
        var stmt = db.prepare('INSERT INTO users (username, password, createdAt) VALUES (?, ?, ?)');
        stmt.run(username, password, now);
        stmt.finalize();
        //check that the user can be retrieved from the database
        db.get("SELECT username, password, createdAt FROM users WHERE username='" + username + "'", function(err, row) {
          assert.equal(username, row.username);
          assert.equal(password, row.password);
          assert.equal(now.getTime(), row.createdAt);
          // Very important to call done(); since calls are asynchronous
          done(); 
        });
      });
    });
  });
});
