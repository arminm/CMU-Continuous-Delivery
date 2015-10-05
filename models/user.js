var db = require('../config/db.js');

function User(name, username, password) {
	this.fullname = name;
	this.username = username;
	this.password = password;
};

User.prototype.create = function(fullname, username, password, callback) {
	db.get("SELECT username FROM users WHERE username='" + username + "';", function(err, row) {
		if (row !== undefined) {
			callback(false);
		}
		else {
			var stmt = db.prepare('INSERT INTO users (name, username, password) VALUES (?, ?, ?);');
  		stmt.run(fullname, username, password);
  		stmt.finalize();
  		callback(true);
		}
	});
};

User.prototype.get = function(callback) {
	db.get("SELECT username FROM users WHERE username='" + this.username + "';", function(err, row) {
		if (row !== undefined) {
			callback(row.username);
		}
	});
};

module.exports = User;