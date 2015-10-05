var User = require('../models/user.js');

module.exports = {
	getAllUsers: function() {
		// TODO
	},

	getUser: function(username) {
		var user = new User(null, username, null);
		console.log('Return result: ' + user.get());
	},

	update: function(username) {
	// TODO
	}
} 