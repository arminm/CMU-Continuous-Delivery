var db = require('../config/db.js').getDB();

function User(name, username, password) {
	this.fullname = name;
	this.username = username;
	this.password = password;
};

User.prototype.create = function() {
	console.log('inside create', this.username);
	var exists = db.get("SELECT EXISTS(SELECT username FROM users WHERE username='" 
		+ this.username + "' LIMIT 1) ");
	if (exists === 1) {
		return false;
	}
	else {
		var stmt = db.prepare('INSERT INTO users (name, username, password) VALUES (?, ?, ?)');
        stmt.run(this.name, this.username, this.password);
        stmt.finalize();
		return true;
	}
};

User.prototype.get = function() {
	db.get("SELECT username FROM users WHERE username='" + this.username + "'", function(err, row) {
		if (row !== null) {
			return {username: row.username};
		}
	});
};

module.exports = User;