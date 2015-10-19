var db = require('../config/db.js');
var utils = require('../utilities.js');
var Status = require('./status.js');

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
						var statusInfo = {
							username: username,
							statusCode: "GREEN",
							updatedAt: createdAt
						}
						Status.createStatusCrumb(statusInfo, callback);
					}
				});
			}
		});
	},

	get: function(username, callback) {
		var query = "SELECT * FROM users JOIN statusCrumbs WHERE users.username='" + username 
			+ "' AND users.username=statusCrumbs.username AND crumbId = (SELECT MAX(crumbId) FROM statusCrumbs WHERE users.username=statusCrumbs.username);";
		db.get(query, function(error, row) {
			if (error) {
				console.log(error);
				callback(null, null, error);
			} else if (row) {
				var user = utils.replacer(row, ['id', 'password', 'crumbId']);
				callback(user, row.password);
			} else {
				callback();
			}
		});
	},

	getAllUsers: function(callback) {
		var users = [];
		var query = "SELECT * FROM users JOIN statusCrumbs WHERE statusCrumbs.username=users.username" +
		 " AND crumbId = (SELECT MAX(crumbId) FROM statusCrumbs WHERE users.username=statusCrumbs.username);";
		db.each("SELECT * FROM users;", 
			function(error, row) {
				if (error) {
					console.log(error);
					callback(null, error);
				} else if (row) {
					users.push(utils.replacer(row, ['id', 'password', 'crumbId']));
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