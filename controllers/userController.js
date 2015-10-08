var User = require('../models/user.js');

module.exports = {
	getAllUsers: function(req, res) {
		User.getAllUsers(function(users, error) {
			if (error) {
				res.status(500);
				res.send();
			} else {
				res.status(200);
				res.send(users);
			}
		});
	},

	getUser: function(req, res) {
		User.get(req.params.username, function(user, password, error) {
			if (error) {
				res.status(500);
				res.send();
			} else if (user) {
				res.status(200);
				res.send(user);
			} else {
				res.status(404);
				res.send();
			}
		});
	}
} 