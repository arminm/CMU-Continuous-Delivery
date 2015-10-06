var User = require('../models/user.js');

module.exports = {
	getAllUsers: function(callback) {
		var user = new User(null, null, null);
		user.getAllUsers(function(users) {
			callback(users);
		});
	},

	getUser: function(username, callback) {
		var user = new User(null, username, null);
		user.get(null, function(data, dummy) {
			callback(data);
		});
	},

	update: function(username) {
	// TODO
	}
} 