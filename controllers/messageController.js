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
						res.status(500);
						res.send();
					} else if (messageId) {
						io.broadcast(messageInfo.messageType, messageId, 'created', messageInfo.author, messageInfo.target);
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

	getAllMessages: function(req, res) {
		Message.getAllMessages(req.query.messageType, req.query.sender, req.query.receiver, function(messages, error) {
			if (error) {
				res.status(500);
				res.send();
			} else {
				res.status(200);
				res.send(messages);
			}
		});
	},

	getMessage: function(req, res) {
		Message.getMessage(req.params.id, function(message, error) {
			if (error) {
				res.status(500);
				res.send();
			} else if (message) {
				res.status(200);
				res.send(message);
			} else {
				res.status(404);
				res.send();
			}
		});
	}
} 