var User = require('../models/user.js');
var Message = require('../models/message.js');

module.exports = {
	postMessageOnWall: function(username, content, postedAt, callback) {
		var user = new User(null, username, null);
		var message = new Message(content, username, 'WALL', null, postedAt);
		user.get(null, function(data) {
			if (data === undefined) {
				callback('Not Found');
			}
			else {
				message.create(function() {
					callback('OK');
				});
			}
		});
	},

	getAllMessages: function(callback) {
		var message = new Message(null, null, null, null, null);
		message.getAllMessages(function(messages) {
			callback(messages);
		});
	}
} 