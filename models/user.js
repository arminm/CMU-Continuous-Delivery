var db = require('../config/db.js');
var utils = require('../utilities.js');

module.exports = {
	create: function(fullName, username, password, createdAt, callback) {
		db.get("SELECT username FROM users WHERE username='" + username + "';", function(error, row) {
			if (error) {
				console.log(error);
				callback(false, error);
			} else {
				db.run('INSERT INTO users (fullName, username, password, createdAt, isOnline) VALUES ($1, $2, $3, $4, $5);', {
					$1: fullName,
					$2: username,
					$3: password,
					$4: createdAt,
					$5: true
				}, function(error) {
					if (error) {
						callback(false, error);
					} else {
						callback(true);
					}
				});
			}
		});
	},

	get: function(username, callback) {
		db.get("SELECT * FROM users WHERE username='" + username + "';", function(error, row) {
			if (error) {
				console.log(error);
				callback(null, null, error);
			} else if (row) {
				var user = utils.replacer(row, ['id', 'password']);
				callback(user, row.password);
			} else {
				callback();
			}
		});
	},

	getAllUsers: function(callback) {
		var users = [];
		db.each("SELECT * FROM users;", 
			function(error, row) {
				if (error) {
					console.log(error);
					callback(null, error);
				} else if (row) {
					users.push(utils.replacer(row, ['id', 'password']));
				} else {
					callback();
				}
			}, function() {
				callback(users, null);
			}
		);
	},

	updateLogin: function(username, lastLoginAt, isOnline) {
		db.run("UPDATE users SET lastLoginAt = ?, isOnline = ? WHERE username = ?;", lastLoginAt, isOnline, username);
	},

	updateStatus: function(username, lastStatusCode) {
		db.run("UPDATE users SET lastStatusCode = ? WHERE username = ?;", lastStatusCode, username);
	},

	logout: function(username, callback) {
		db.get("SELECT isOnline FROM users WHERE username = '" + username + "';", function(err, row) {
			if (err) {
				console.log(err);
				callback(null, err);
			}
			if (row !== undefined) {
				callback(row.isOnline, null);
			}
		});
	}
}