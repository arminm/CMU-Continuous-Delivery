var db = require('../config/db.js');
var utils = require('../utilities.js');


module.exports = {
	create: function(info, callback) {
		db.run('INSERT INTO messages (content, author, messageType, target, createdAt) VALUES ($1, $2, $3, $4, $5);', { 
				$1: info.content, 
				$2: info.author, 
				$3: info.messageType, 
				$4: info.target, 
				$5: info.createdAt 
			},function() {
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
		});
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
	},

	getMessage: function(id, callback) {
		db.get("SELECT * FROM messages WHERE id='" + id + "';", function(error, row) {
			if (error) {
				console.log(error);
				callback(null, error);
			} else if (row) {
				var message = utils.replacer(row, ['id', 'messageType']);
				callback(message, row.password);
			} else {
				callback();
			}
		});
	}
}