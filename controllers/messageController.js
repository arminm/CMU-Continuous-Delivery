var User = require('../models/user.js');
var Message = require('../models/message.js');
var io = require('../bin/www');

console.log(io);

module.exports = {
	postMessage: function(req, res) {
		var messageInfo = {
			content: req.body.content, 
			author: req.params.author, 
			messageType: req.body.messageType, 
			target: req.body.targetUsername, 
			createdAt: req.body.postedAt
		}
		User.get(req.params.author, function(user, password, error) {
			if (user) {
				Message.create(messageInfo, function() {
					res.status(201);
					res.send();
				});
			} else if (error) {
				res.status(500);
				res.send();
			} else {
				res.status(404);
				res.send();
			}
			io.broadcast.emit('public message', "hello world");
		});
	},

	getAllMessages: function(req, res) {
		Message.getAllMessages(req.query.messageType, function(messages, error) {
			if (error) {
				res.status(500);
				res.send();
			} else {
				res.status(200);
				res.send(messages);
			}
		});
	}
} 