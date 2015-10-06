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
			var stmt = db.prepare('INSERT INTO users (fullName, username, password, createdAt, isActive, isOnline) VALUES (?, ?, ?, ?, ?, ?);');
  		stmt.run(fullName, username, password, new Date(), true, true);
  		stmt.finalize();
  		callback(true);
		}
	});
};

User.prototype.get = function(password, callback) {
	if (password !== null) {
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
	} else {
		db.get("SELECT * FROM users WHERE username='" + this.username + "';", function(err, row) {
			callback(
				{
					username: row.username, 
					password: row.password, 
					fullName: row.fullName,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					lastLoginAt: row.lastLoginAt,
					lastStatusCode: row.lastStatusCode,
					isActive: row.isActive,
					isOnline: row.isOnline,
				});
		});
	}
};

User.prototype.getAllUsers = function(callback) {
	var users = [];
	db.each("SELECT * FROM users;", 
		function(err, row) {
			users.push(
				{
					username: row.username, 
					password: row.password, 
					fullName: row.fullName,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					lastLoginAt: row.lastLoginAt,
					lastStatusCode: row.lastStatusCode,
					isActive: row.isActive,
					isOnline: row.isOnline,
				});
		}, function() {
			callback(users);
		}
	);
};

User.prototype.logout = function(callback) {
	db.get("SELECT isOnline FROM users WHERE username='" + this.username + "';", function(err, row) {
		if (err) {
			throw err;
		}
		if (row !== undefined) {
			callback(row.isOnline);
		}
	});
};

module.exports = User;