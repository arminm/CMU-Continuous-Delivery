var db = require('../config/db.js');
var utils = require('../utilities.js');


module.exports = {
	create: function(info, callback) {
		var stmt = db.prepare('INSERT INTO messages (content, author, messageType, target, createdAt) VALUES (?, ?, ?, ?, ?);');
  		stmt.run(info.content, info.author, info.messageType, info.target, info.createdAt);
  		stmt.finalize();
  		callback();
	},

	getAllMessages: function(messageType, callback) {
		var messages = [];
		db.each("SELECT * FROM messages WHERE messageType='" + messageType + "';", 
			function(error, row) {
				if (error) {
					console.log(error);
					callback(null, error);
				}
				messages.push(utils.replacer(row, ['id', 'messageType']));
			}, function() {
				callback(messages, null);
			}
		);
	}
}