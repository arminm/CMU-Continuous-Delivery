var assert = require("assert");
var sqlite3 = require("sqlite3").verbose();

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('Database', function() {
	var db;
	before(function() {
		db = new sqlite3.Database('ssnoc.db');
	});

	describe('#checkDB', function() {
		it('should correctly insert and retrieve a new user into database', function() {
			// create a dump user
			var username = 'test';
			var password = 12345;

			db.serialize(function () {
				// insert the user into the database
  				var stmt = db.prepare('INSERT INTO users VALUES(?, ?)');
  				stmt.run(username, password);
  				stmt.finalize();

  				//check that the user can be retrieved from the database
  				db.get("SELECT username, password FROM users WHERE username='" + username 
  					+ "' AND password=" + password, function(err, row) {
  					assert.equal(username, row.username);
  					assert.equal(password, row.password); 
  				});
  			});
		});
	});
});
