var db = require('../config/db.js').getDB();

function User(name, username, password) {
	this.fullname = name;
	this.username = username;
	this.password = password;
};

User.prototype.create = function() {
	// console.log('inside create, ' + this.db);
	db.get("SELECT username FROM users WHERE username='" + this.username + "'", function(err, row) {
		if (err)
			throw err;
		if (row.username !== undefined) {
			return false;
		}
		else {
			return true;
		}
	});
};

User.prototype.get = function() {
	db.get("SELECT username FROM users WHERE username='" + this.username + "'", function(err, row) {
		if (row.username !== undefined) {
			return {username: row.username};
		}
	});
};

module.exports = User;