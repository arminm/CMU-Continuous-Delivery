var User = require('../models/user.js');
var Status = require('../models/status.js');
var io = require('../io.js');

module.exports = {
	changeStatus: function(req, res) {
		var statusInfo = {
			username: req.params.username,
			statusCode: req.body.statusCode,
			createdAt: req.body.updatedAt
		}
		User.get(statusInfo.username, function(user, password, error) {
			if (user) {
				Status.createStatusCrumb(statusInfo, function(crumbID, error) {
					if (error) {
						res.status(500);
						res.send();
					} else if (crumbId) {
						io.broadcast('status', crumbId, 'created', statusInfo.username, statusInfo.statusCode);
						res.status(201);
						res.send();
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

	}
} 