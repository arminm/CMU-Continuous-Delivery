var User = require('../models/user.js');
var Status = require('../models/status.js');
var Utils = require('../utilities.js');

module.exports = {
	getAllUsers: function(req, res) {
		User.getAllUsers(false, function(users, error) {
			if (error) {
				res.sendStatus(500);
			} else {
				res.status(200).send(users);
			}
		});
	},

	updateUser: function(req, res) {
		User.get(req.params.username, function(user, password, error) {
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
				if (!Utils.isEmpty(req.body.statusCode)) {
					var statusInfo = {
						username: req.params.username,
						statusCode: req.body.statusCode,
						statusUpdatedAt: req.body.statusUpdatedAt
					};
					Status.createStatusCrumb(statusInfo, function(crumbID, error) {
						if (error) {
							res.sendStatus(400);
						}
					});
				}
			} else {
				res.sendStatus(404);
			}
		});
	}
}
