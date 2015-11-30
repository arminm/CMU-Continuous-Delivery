var dbModule = require('../config/db.js');
var utils = require('../utilities.js');
var Status = require('./status.js');

module.exports = {
	create: function(info, callback) {
		var db = dbModule.getDB();
		db.run('INSERT INTO users (fullName, username, password, createdAt, lastLoginAt) VALUES ($1, $2, $3, $4, $5);', {
			$1: info.fullName,
			$2: info.username,
			$3: info.password,
			$4: info.createdAt,
			$5: info.createdAt // it's the same because the user was just created
		}, function(error) {
			if (error) {
				callback(false, error);
			} else {
				var statusInfo = {
					username: info.username,
					statusCode: "OK",
					statusUpdatedAt: info.createdAt
				};
				Status.createStatusCrumb(statusInfo, function(crumbId, error) {
					if (crumbId) {
						callback(true);
					} else {
						db.run("DELETE FROM users WHERE username='" + info.username + "';", function(error) {
							callback(false, error);
						});
					}
				});
			}
		});
	},

	get: function(username, callback) {
		var db = dbModule.getDB();
		var query ="SELECT * FROM users JOIN statusCrumbs WHERE users.username='" + username + "' AND users.username=statusCrumbs.username AND crumbId = (SELECT MAX(crumbId) FROM statusCrumbs WHERE users.username=statusCrumbs.username);";
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

	getAllUsers: function(activeOnly, callback) {
		var db = dbModule.getDB();
		var users = [];
		var query = "SELECT * FROM users JOIN statusCrumbs WHERE ";
		if (activeOnly) {
			query += "users.isActive AND ";
		}
		query += "users.username=statusCrumbs.username AND crumbId = (SELECT MAX(crumbId) FROM statusCrumbs WHERE users.username=statusCrumbs.username);";
		db.each(query,
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

	updateUser: function(info, callback) {
		var db = dbModule.getDB();
		var query = "UPDATE users SET ";
		var firstValue = true;
		var updateObject = {};
		if (!utils.isEmpty(info.isActive)) {
			query += (firstValue? "" : ", ") + "isActive = " + info.isActive;
			firstValue = false;
			updateObject.isActive = info.isActive;
		}
		if (!utils.isEmpty(info.profile)) {
			query += (firstValue? "" : ", ") + "profile = '" + info.profile + "'";
			firstValue = false;
			updateObject.profile = info.profile;
		}		
		if (!utils.isEmpty(info.newUsername)) {
			query += (firstValue? "" : ", ") + "username = '" + info.newUsername + "'";
			firstValue = false;
			updateObject.username = info.username;
		}		
		if (!utils.isEmpty(info.password)) {
			query += (firstValue? "" : ", ") + "password = '" + info.password + "'";
			firstValue = false;
			updateObject.password = info.password;
		}
		if (!firstValue) { // If firstValue is still true, it means no value was updated	
			query += " WHERE username = '" + info.username + "';"
			db.run(query, function(error) {
				if (error) {
					callback(false, null, error);
				} else {
					callback(true, updateObject);
				}
			});
		} else {
			callback(false, null, "Nothing to update");
		}
	},

	updateLogin: function(username, lastLoginAt, isOnline, callback) {
		var db = dbModule.getDB();
		db.run("UPDATE users SET lastLoginAt = ?, isOnline = ? WHERE username = ?;", lastLoginAt, isOnline, username, function(error) {
			if (error) {
				callback(false, error);
			} else {
				callback(true);
			}
		});
	},

	logout: function(username, callback) {
		var db = dbModule.getDB();
		db.run("UPDATE users SET isOnline = ? WHERE username = ?;", false, username, function(error) {
			if (error) {
				callback(error);
			} else {
				callback();
			}
		});
	}
}
