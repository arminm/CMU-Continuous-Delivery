var User = require('../models/user.js');

module.exports = {
	signup: function(req, res){
		var userInfo = {
			fullName: req.body.fullName,
			username: req.params.username,
			password: req.body.password,
			createdAt: req.body.createdAt
		};

		var now = (new Date()).getTime();
		User.get(userInfo.username, function(user, actualPassword) {
			if (user !== undefined) {
				if (!user.isActive) {
					res.sendStatus(403);
				} else if (userInfo.password === actualPassword) {
					User.updateLogin(userInfo.username, now, true, function(isUpdated, error) {
						if (isUpdated) {
							res.status(200).send(user);
						} else {
							res.sendStatus(500);
						}
					});
				} else {
					res.sendStatus(401);
				}
			}else {
				User.create(userInfo, function(isCreated) {
					if (isCreated) {
						res.sendStatus(201);
					} else {
						res.sendStatus(500);
					}
				});
			}
		});
	},

	login: function(req, res) {
		var username = req.params.username;
		var password = req.body.password;
		var lastLoginAt = req.body.lastLoginAt;
		User.get(username, function(user, actualPassword, error) {
			if (error) {
				res.status(500).send();
			} else if (user !== undefined) {
				if (!user.isActive) {
					res.sendStatus(403);
				} else if (password === actualPassword) {
					User.updateLogin(username, lastLoginAt, true, function(isUpdated, error) {
						if (error) {
							res.sendStatus(500);
						}
						else if (isUpdated) {
							res.status(200).send(user);
						} else {
							res.sendStatus(500);
						}
					});
				} else {
					res.sendStatus(401);
				}
			} else {
				res.sendStatus(404);
			}
		});
	},

	logout: function(req, res) {
		User.logout(req.params.username, function(error) {
			if (error) {
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		});
	}

};
