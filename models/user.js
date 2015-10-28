var db = require('../config/db.js');
var utils = require('../utilities.js');
var Status = require('./status.js');

module.exports = {
	create: function(info, callback) {
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

	getAllUsers: function(callback) {
		var users = [];
		var query = "SELECT * FROM users JOIN statusCrumbs WHERE users.username=statusCrumbs.username AND crumbId = (SELECT MAX(crumbId) FROM statusCrumbs WHERE users.username=statusCrumbs.username);";
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

	updateLogin: function(username, lastLoginAt, isOnline, callback) {
		db.run("UPDATE users SET lastLoginAt = ?, isOnline = ? WHERE username = ?;", lastLoginAt, isOnline, username, function(error) {
			if (error) {
				callback(false, error);
			} else {
				callback(true);
			}
		});
	},

	logout: function(username, callback) {
		db.run("UPDATE users SET isOnline = ? WHERE username = ?;", false, username, function(error) {
			if (error) {
				callback(error);
			} else {
				callback();
			}
		});
	}
}
