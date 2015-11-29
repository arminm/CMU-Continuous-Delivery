var User = require('../models/user.js');
var Utils = require('../utilities.js');

module.exports = {
	getAllUsers: function(req, res) {
		User.get(req.params.access_key, function(user, password, error) {
			if (error) {
				res.sendStatus(500);
			} else if (user) {
				var activeOnly = (user.profile != 'ADMINISTRATOR');
				User.getAllUsers(activeOnly, function(users, error) {
					if (error) {
						res.sendStatus(500);
					} else {
						res.status(200).send(users);
					}
				});
			} else {
				res.sendStatus(404);
			}
		});
	},

	getUser: function(req, res) {
		User.get(req.params.username, function(user, password, error) {
			if (error) {
				res.sendStatus(500);
			} else if (user) {
				res.status(200).send(user);
			} else {
				res.sendStatus(404);
			}
		});
	},

	updateUser: function(req, res) {
		User.get(req.params.access_key, function(user, password, error) {
			if (error) {
				res.sendStatus(500);
			} else if (user && user.profile == 'ADMINISTRATOR') {
				var userInfo = {
					isActive: req.body.isActive,
					givenUsername: req.body.givenUsername,
					password: req.body.password,
					profile: req.body.profile,
					username: req.params.username
				};
				User.updateUser(userInfo, function(success, error) {
					if (error) {
						res.sendStatus(400);
					}
				});
			} else {
				res.sendStatus(404);
			}
		});
	}
}
