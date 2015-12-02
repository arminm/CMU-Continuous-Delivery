var User = require('../models/user.js');
var Utils = require('../utilities.js');
var io = require('../io.js');

module.exports = {
	getAllUsers: function(req, res) {
		User.get(req.query.access_key, function(user, password, error) {
			if (error) {
				res.sendStatus(500);
			} else if (user) {
				var activeOnly = (user.profile != 'ADMINISTRATOR');
				User.getAllUsers(activeOnly, function(users, error) {
					if (error) {
						res.sendStatus(500);
					} else if (users) {
						res.status(200).send(users);
					} else {
						res.sendStatus(404);
					}
				});
			} else {
				res.sendStatus(403);
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
		User.get(req.query.access_key, function(user, password, error) {
			if (error) {
				res.sendStatus(500);
			} else if (user) {
				if (user.profile == 'ADMINISTRATOR') {
					var userInfo = {
						isActive: req.body.isActive,
						givenUsername: req.body.givenUsername,
						password: req.body.password,
						profile: req.body.profile,
						username: req.params.username
					};
					User.updateUser(userInfo, function(success, updateObject, error) {
						if (error) {
							if (error.errno === 19) {
								res.sendStatus(403);
							} else {
								res.sendStatus(400);
							}
						} else if (updateObject !== {}) {
							io.broadcast('UPDATE', req.params.username, updateObject, null, null);
							res.sendStatus(200);
						}
					});
				} else {
					res.sendStatus(401);
				}
			} else {
				res.sendStatus(404);
			}
		});
	}
};