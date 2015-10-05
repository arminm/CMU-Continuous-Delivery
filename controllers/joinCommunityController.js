var User = require('../models/user.js');

module.exports = {
	signup: function(name, username, password) {
		var user = new User(name, username, password);
		user.create(user.fullname, user.username, user.password, function(isCreated) {
			if (isCreated) {
				console.log('new user inserted successfully');
			} else {
				console.log('username already exists');
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