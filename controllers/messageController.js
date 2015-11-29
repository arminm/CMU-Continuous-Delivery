var User = require('../models/user.js');
var Message = require('../models/message.js');
var io = require('../io.js');

module.exports = {
	postMessage: function(req, res) {
		var messageInfo = {
			content: req.body.content,
			author: req.params.author,
			messageType: req.body.messageType,
			target: req.body.target,
			createdAt: req.body.postedAt
		};
		User.get(req.params.author, function(user, password, error) {
			if (user) {
				if ((messageInfo.messageType == 'ANNOUNCEMENTS') && (user.profile != 'COORDINATOR')) {
					res.sendStatus(401);
				} else {
					Message.create(messageInfo, function(messageId, error) {
						if (error) {
							res.sendStatus(500);
						} else if (messageId) {
							io.broadcast(messageInfo.messageType, messageId, 'created', messageInfo.author, messageInfo.target);
							res.sendStatus(201);
						} else {
							res.sendStatus(500);
						}
					});
				}
			} else if (error) {
				res.sendStatus(500);
			} else {
				res.sendStatus(404);
			}
		});
	},

	getAllMessages: function(req, res) {
		if (req.query.messageType == 'ANNOUNCEMENTS') {
			if (req.params.access_key) {
				User.get(req.params.access_key, function(user, password, error) {
					if (user && (user.profile != 'COORDINATOR')) {
						res.sendStatus(401);
						Message.getAllMessages(req.query.messageType, req.query.sender, req.query.receiver, function(messages, error) {
							if (error) {
								res.sendStatus(500);
							} else {
								res.status(200).send(messages);
							}
						});
					}
				});
			} else {
				res.sendStatus(404);
			}
		} 
	},

	get: function(req, res) {
		User.get(req.params.access_key, function(user, password, error) {
			Message.get(req.params.id, function(message, error) {
				if (error) {
					res.sendStatus(500);
				} else if (message) {
					if ((message.messageType == 'ANNOUNCEMENTS') && (user.profile != 'COORDINATOR')) {
						res.sendStatus(401);
					} else {
						res.status(200).send(message);
					}
				} else {
					res.sendStatus(404);
				}
			});
		});
	}
}
