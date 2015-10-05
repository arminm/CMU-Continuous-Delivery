var db = require('../config/db.js');

function Message(content, author, messageType, target, createdAt) {
	this.content = content;
	this.author = author;
	this.messageType = messageType;
	this.target = target;
	this.createdAt = createdAt;
};

Message.prototype.create = function() {
// TODO
};

Message.prototype.get = function() {
// TODO
};

module.exports = Message;