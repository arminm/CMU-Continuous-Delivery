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
					User.updateUser(username, now, true);
					res.status(200);
				} else {
					res.status(401);
				}
				res.send();
			}else {
				User.create(fullName, username, password, createdAt, function(isCreated) {
					if (isCreated) {
						res.status(201);
					} else {
						res.status(500);
					}
					res.send();
				});
			}
		});
	},

	login: function(req, res) {
		var username = req.params.username;
		var password = req.body.password;
		var lastLoginAt = req.body.lastLoginAt;
		User.get(username, function(user, actualPassword) {
			if (user !== undefined) {
				if (password === actualPassword) {
					User.updateUser(username, lastLoginAt, true);
					res.status(200);
				} else {
					res.status(401);
				}
			} else {
				res.status(404);
			}
			res.send();
		});
	},

	logout: function(req, res) {
		var username = req.params.username;
		User.logout(username, function(isLoggedIn, error) {
			if (error) {
				res.status(500);
			} else {
				if (isLoggedIn) {
					User.updateUser(username, null, false);
					res.status(200);
				} else {
					res.status(400);
				}
			}
			res.send();
		});
	}
} 