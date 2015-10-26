var User = require('../models/user.js');
var Status = require('../models/status.js');
var Utils = require('../../utilities.js');

module.exports = {
	getAllUsers: function(req, res) {
		User.getAllUsers(function(users, error) {
			if (error) {
				res.sendStatus(500);
			} else {
				var mergedUsers = [];
				for (var user in users) {
					Status.getStatusCrumbByUsername(req.params.username, function(statusCrumb){
						mergedUsers.push(Utils.mergeObjects(user, statusCrumb));
					});
				}
				res.status(200).send(mergedUsers);
			}
		});
	},

	getUser: function(req, res) {
		User.get(req.params.username, function(user, password, error) {
			if (error) {
				res.sendStatus(500);
			} else if (user) {
				Status.getStatusCrumbByUsername(req.params.username, function(statusCrumb){
					res.status(200).send(Utils.mergeObjects(user, statusCrumb));
				});
			} else {
				res.sendStatus(404);
			}
		});
	}
}
