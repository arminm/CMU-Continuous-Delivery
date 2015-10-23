var User = require('../models/user.js');

module.exports = {
	signup: function(req, res){
		var fullName = req.body.fullName;
		var username = req.params.username;
		var password = req.body.password;
		var createdAt = req.body.createdAt;
		var now = (new Date()).getTime();
		User.get(username, function(user, actualPassword) {
			if (user !== undefined) {
				if (password === actualPassword) {
					User.updateLogin(username, now, true, function(isUpdated, error) {
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
				User.create(fullName, username, password, createdAt, function(isCreated) {
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
				if (password === actualPassword) {
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
		var username = req.params.username;
		User.logout(username, function(isLoggedIn, error) {
			if (error) {
				res.sendStatus(500);
			} else {
				if (isLoggedIn) {
					User.updateLogin(username, null, false, function(isUpdated, error) {
						if (error) {
							res.sendStatus(500);
						}
						else if (isUpdated) {
							res.sendStatus(200);
						} else {
							res.sendStatus(500);
						}
					});
				} else {
					res.sendStatus(400);
				}
			}
		});
	}
} 