var User = require('../models/user.js');

module.exports = {
	signup: function(name, username, password, callback) {
		var user = new User(name, username, password);
		user.get(user.password, function(username, isPasswordCorrect) {
			console.log();
			if (username !== undefined) {
				if (isPasswordCorrect) {
					console.log('username already exists and password correct');
					callback('OK');
				} else {
					console.log('username exists but password wrong');
					callback('Unauthorized');
				}
			}
			else {
				console.log('username: ' + user.username);
				user.create(user.fullName, user.username, user.password, function(isCreated) {
					if (isCreated) {
						console.log('new user inserted successfully');
					}
					callback('Created');
				});
			}
		});
	},

	login: function(username, password) {
	// TODO
	},

	logout: function(username) {
	// TODO
	}
} 