var db = require('../config/db.js');

function User(fullName, username, password) {
	this.fullName = fullName;
	this.username = username;
	this.password = password;
};

User.prototype.create = function(fullName, username, password, callback) {
	db.get("SELECT username FROM users WHERE username='" + username + "';", function(err, row) {
		if (row !== undefined) {
			callback(false);
		}
		else {
			var stmt = db.prepare('INSERT INTO users (fullName, username, password, createdAt, isActive) VALUES (?, ?, ?, ?, ?);');
  		stmt.run(fullName, username, password, new Date(), true);
  		stmt.finalize();
  		callback(true);
		}
	});
};

User.prototype.get = function(password, callback) {
	db.get("SELECT username, password FROM users WHERE username='" + this.username + "';", function(err, row) {
		if (row !== undefined) {
			if (row.password === password) {
				callback(row.username, true);
			} else {
				callback(row.username, false);
			}
		} else {
			callback(undefined, undefined);
		}
	});
};

module.exports = User;