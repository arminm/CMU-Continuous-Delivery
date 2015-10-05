var User = require('../models/user.js');

module.exports = {
	getAllUsers: function() {
		// TODO
	},

	getUser: function(username) {
		var user = new User(null, username, null);
		user.get(function(data) {
			console.log('Result is: ' + data);
		});
	},

	update: function(username) {
	// TODO
	}
} 