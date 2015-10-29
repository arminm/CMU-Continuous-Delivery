var User = require('../models/user.js');
var Status = require('../models/status.js');
var io = require('../io.js');

module.exports = {
	changeStatus: function(req, res) {
		var statusInfo = {
			username: req.params.username,
			statusCode: req.body.statusCode,
			statusUpdatedAt: req.body.statusUpdatedAt
		}
		User.get(statusInfo.username, function(user, password, error) {
			if (user) {
				Status.createStatusCrumb(statusInfo, function(crumbID, error) {
					if (error) {
						res.sendStatus(500);
					} else if (crumbID) {
						io.broadcast('status', crumbID, 'created', statusInfo.username, null);
						res.sendStatus(201);
					} else {
						res.sendStatus(500);
					}
				});
			} else if (error) {
				res.sendStatus(500);
			} else {
				res.sendStatus(404);
			}
		});
	},

	getAllStatusCrumbs: function(req, res) {
		var username = req.query.username;
		User.get(username, function(user, password, error) {
			if (user) {
				Status.getAllStatusCrumbs(username, function(statusCrumbs, error) {
					if (error) {
						res.sendStatus(500);
					} else if (statusCrumbs) {
						res.status(200).send(statusCrumbs);
					} else {
						res.sendStatus(500);
					}
				});
			} else if (error) {
				res.sendStatus(500);
			} else {
				res.sendStatus(404);
			}
		});
	},

	getStatusCrumb: function(req, res) {
		var id = req.params.id;
		Status.getStatusCrumb(req.params.id, function(statusCrumb, error) {
			if (error) {
				res.sendStatus(500);
			} else if (statusCrumb) {
				res.status(200).send(statusCrumb);
			} else {
				res.sendStatus(404);
			}
		});
	}
}
