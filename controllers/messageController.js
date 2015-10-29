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
		}
		User.get(req.params.author, function(user, password, error) {
			if (user) {
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
			} else if (error) {
				res.sendStatus(500);
			} else {
				res.sendStatus(404);
			}
		});
	},

	getAllMessages: function(req, res) {
		Message.getAllMessages(req.query.messageType, req.query.sender, req.query.receiver, function(messages, error) {
			if (error) {
				res.sendStatus(500);
			} else {
				res.status(200).send(messages);
			}
		});
	},

	get: function(req, res) {
		Message.get(req.params.id, function(message, error) {
			if (error) {
				res.sendStatus(500);
			} else if (message) {
				res.status(200).send(message);
			} else {
				res.sendStatus(404);
			}
		});
	}
}
