var dbModule = require('../config/db.js');
var utils = require('../utilities.js');


module.exports = {
	create: function(info, callback) {
		var db = dbModule.getDB();
		if (info.content === '') {
			callback();
			return;
		}
		db.run('INSERT INTO messages (content, author, messageType, target, createdAt) VALUES ($1, $2, $3, $4, $5);', {
			$1: info.content,
			$2: info.author,
			$3: info.messageType,
			$4: info.target,
			$5: info.createdAt || (new Date()).getTime()
		},function(error) {
			if (error) {
				callback(null, error);
			} else {
				db.get('SELECT MAX(id) as id FROM messages', function(error, row) {
					if (error) {
						console.log(error);
						callback(null, error);
					} else if (row) {
  						callback(row.id);
					} else {
						callback();
					}
  				});
  			}
  		});
	},

	getAllMessages: function(messageType, userA, userB, callback) {
		var db = dbModule.getDB();
		var messages = [];
		var query = '';
		if (userA && userB) {
			query = "SELECT messages.* FROM messages JOIN users ON messages.author = users.username WHERE messages.messageType='" + messageType + "' AND ((messages.author='" + userA + "' AND messages.target='" + userB + "') OR (messages.author='" + userB + "' AND messages.target='" + userA + "')) AND users.isActive;";
		} else if (messageType !== 'CHAT') {
			query = "SELECT messages.* FROM messages, users WHERE messageType='" + messageType + "' AND users.isActive AND user.username = message.author;";
		} else {
			callback();
		}
		db.each(query,
			function(error, row) {
				if (error) {
					console.log(error);
					callback(null, error);
				} else {
					messages.push(utils.replacer(row, ['id']));
				}
			}, function() {
				callback(messages, null);
			}
		);
	},

	get: function(id, callback) {
		var db = dbModule.getDB();
		db.get("SELECT * FROM messages WHERE id=" + id + ";", function(error, row) {
			if (error) {
				callback(null, error);
			} else if (row) {
				var message = utils.replacer(row, ['id']);
				callback(message, null);
			} else {
				callback();
			}
		});
	}
};
