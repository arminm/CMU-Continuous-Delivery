var db = require('../config/db.js');
var utils = require('../utilities.js');
var Status = require('./status.js');

module.exports = {
	create: function(fullName, username, password, createdAt, callback) {
		db.run('INSERT INTO users (fullName, username, password, createdAt) VALUES ($1, $2, $3, $4);', {
			$1: fullName,
			$2: username,
			$3: password,
			$4: createdAt
		}, function(error) {
			if (error) {
				callback(false, error);
			} else {
				var statusInfo = {
					username: username,
					statusCode: "OK",
					updatedAt: createdAt
				}
				Status.createStatusCrumb(statusInfo, callback);
			}
		});
	},

	get: function(username, callback) {
		var query = "SELECT * FROM users WHERE users.username='" + username + "'";
		db.get(query, function(error, row) {
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
		var query = "SELECT * FROM users";
		db.each(query,
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
		db.get("SELECT isOnline FROM users WHERE username = '" + username + "';", function(err, row) {
			if (err) {
				console.log(err);
				callback(null, err);
			} else if (row !== undefined) {
				callback(row.isOnline, null);
			} else {
				callback();
			}
		});
	}
}
