var db = require('../config/db.js');

function Message(content, author, messageType, target, createdAt) {
	this.content = content;
	this.author = author;
	this.messageType = messageType;
	this.target = target;
	this.createdAt = createdAt;
};

Message.prototype.create = function(callback) {
	var stmt = db.prepare('INSERT INTO messages (content, author, messageType, target, createdAt) VALUES (?, ?, ?, ?, ?);');
  stmt.run(this.content, this.author, this.messageType, this.target, this.createdAt);
  stmt.finalize();
  callback();
};

Message.prototype.getAllMessages = function(callback) {
	var messages = [];
	db.each("SELECT * FROM messages WHERE messageType='WALL';", 
		function(err, row) {
			messages.push(
				{
					content: row.content, 
					author: row.author, 
					target: row.target,
					messageType: row.messageType,
					createdAt: row.createdAt,
				});
		}, function() {
			callback(messages);
		}
	);
};

module.exports = Message;