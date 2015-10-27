var User = require('../models/user.js');
var Status = require('../models/status.js');
var io = require('../io.js');

module.exports = {
	changeStatus: function(req, res) {
		var statusInfo = {
			username: req.params.username,
			statusCode: req.body.statusCode,
			updatedAt: req.body.updatedAt
		}
		User.get(statusInfo.username, function(user, password, error) {
			if (user) {
				Status.createStatusCrumb(statusInfo, function(crumbID, error) {
					if (error) {
						res.status(500);
						res.send();
					} else if (crumbID) {
						io.broadcast('status', crumbID, 'created', statusInfo.username, null);
						res.status(201);
						res.send();
					} else {
						res.status(500).send();
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
						res.status(500);
						res.send();
					} else if (statusCrumbs) {
						res.status(200);
						res.send(statusCrumbs);
					} else {
						res.status(500).send();
					}
				});
			} else if (error) {
				res.status(500);
				res.send();
			} else {
				res.status(404);
				res.send();
			}
		});
	},

	getStatusCrumb: function(req, res) {
		var id = req.params.id;
		Status.getStatusCrumb(req.params.id, function(statusCrumb, error) {
			if (error) {
				res.status(500);
				res.send();
			} else if (statusCrumb) {
				res.status(200);
				res.send(statusCrumb);
			} else {
				res.status(404);
				res.send();
			}
		});
	}
}
