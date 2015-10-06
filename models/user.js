var db = require('../config/db.js');

function User(fullName, username, password) {
	this.fullName = fullName;
	this.username = username;
	this.password = password;
};

User.prototype.create = function(fullName, username, password, createdAt, callback) {
	db.get("SELECT username FROM users WHERE username='" + username + "';", function(err, row) {
		if (row !== undefined) {
			callback(false);
		}
		else {
			var stmt = db.prepare('INSERT INTO users (fullName, username, password, createdAt, isActive, isOnline) VALUES (?, ?, ?, ?, ?, ?);');
  		stmt.run(fullName, username, password, createdAt, true, true);
  		stmt.finalize();
  		callback(true);
		}
	});
};

User.prototype.get = function(password, callback) {
	db.get("SELECT * FROM users WHERE username='" + this.username + "';", function(err, row) {
		if (row !== undefined) {
			var user = {
				username: row.username, 
				password: row.password, 
				fullName: row.fullName,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
				lastLoginAt: row.lastLoginAt,
				lastStatusCode: row.lastStatusCode,
				isActive: row.isActive,
				isOnline: row.isOnline,
			};
			if (row.password === password) {
				callback(user, true);
			} else {
				callback(user, false);
			}
		} else {
			callback(undefined, undefined);
		}
	});
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

User.prototype.setIsOnline = function(username, isOnline) {
	db.run("UPDATE users SET isOnline = " + isOnline + " WHERE username = '" + username + "';");
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