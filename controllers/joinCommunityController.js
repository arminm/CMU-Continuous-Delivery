var User = require('../models/user.js');

module.exports = {
	signup: function(name, username, password) {
		var user = new User(name, username, password);
		if (user.create()) {
			console.log('new user successfully created');
		} else {
			console.log('username already exists');
		}
	},

	login: function(username, password) {
	// TODO
	},

	logout: function(username) {
	// TODO
	}
} 