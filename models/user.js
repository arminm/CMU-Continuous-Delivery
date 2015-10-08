var db = require('../config/db.js');
var utils = require('../utilities.js');

module.exports = {
	create: function(fullName, username, password, createdAt, callback) {
		db.get("SELECT username FROM users WHERE username='" + username + "';", function(error, row) {
			if (error) {
				console.log(error);
				callback(false, error);
			} else {
				var stmt = db.prepare('INSERT INTO users (fullName, username, password, createdAt, isOnline) VALUES (?, ?, ?, ?, ?);');
  				stmt.run(fullName, username, password, createdAt, true);
  				stmt.finalize();
  				callback(true);
			}
		});
	},

	get: function(username, callback) {
		db.get("SELECT * FROM users WHERE username='" + username + "';", function(error, row) {
			if (error) {
				console.log(error);
				callback(null, null, error);
			} else if (row !== undefined) {
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
				if (row === undefined) {
					callback();
				} else if (error) {
					console.log(error);
					callback(null, error);
				}
				users.push(utils.replacer(row, ['id', 'password']));
			}, function() {
				callback(users, null);
			}
		);
	},

	updateUser: function(username, lastLoginAt, isOnline) {
		db.run("UPDATE users SET lastLoginAt = " + lastLoginAt + ", isOnline = '" + isOnline + "' WHERE username = '" + username + "';");
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