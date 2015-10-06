var User = require('../models/user.js');

module.exports = {
	signup: function(fullName, username, password, createdAt, callback) {
		var user = new User(fullName, username, password);
		user.get(user.password, function(data, isPasswordCorrect) {
			if (data !== undefined) {
				if (isPasswordCorrect) {
					callback('OK');
				} else {
					callback('Unauthorized');
				}
			}
			else {
				user.create(user.fullName, user.username, user.password, createdAt, function(isCreated) {
					if (isCreated) {
						callback('Created');
					} else {
						callback('Not created');
					}
				});
			}
		});
	},

	login: function(username, password, callback) {
		var user = new User(null, username, password);
		user.get(password, function(username, isPasswordCorrect) {
			if (username !== undefined) {
				if (isPasswordCorrect) {
					callback('OK');
					user.setIsOnline(username, 1);
				} else {
					callback('Unauthorized');
				}
			} else {
				callback('Not Found');
			}
		})
	},

	logout: function(username, callback) {
		var user = new User(null, username, null);
		user.logout(function(isLoggedIn) {
			if (isLoggedIn) {
				user.setIsOnline(username, 0);
				callback('OK');
			} else {
				callback('Bad Request');
			}
		});
	}
} 