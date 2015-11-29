var User = require('../models/user.js');
var Utils = require('../utilities.js');

module.exports = {
	getAllUsers: function(req, res) {
		User.getAllUsers(true, function(users, error) {
			if (error) {
				res.sendStatus(500);
			} else {
				res.status(200).send(users);
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
	}
}
