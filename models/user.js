var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/dimitris/CMU/FSE/FSE-F15-SA5-SSNoC/ssnoc.db');

function User(name, username, password) {
	this.fullname = name;
	this.username = username;
	this.password = password;
};

User.prototype.create = function() {
	console.log('inside create,' + this.username);
	console.log("SELECT EXISTS(SELECT username FROM users WHERE username='" 
		+ this.username + "' LIMIT 1);");
	var exists = db.get("SELECT EXISTS(SELECT username FROM users WHERE username='" 
		+ this.username + "' LIMIT 1);");
	if (exists === 1) {
		return false;
	}
	else {
		var stmt = db.prepare('INSERT INTO users (name, username, password) VALUES (?, ?, ?);');
    stmt.run(this.fullname, this.username, this.password);
    stmt.finalize();
		return true;
	}
};

User.prototype.get = function() {
	console.log('inside get, ' + this.username);
	console.log("SELECT username FROM users WHERE username='" + this.username + "';");
	db.get("SELECT username FROM users WHERE username='" + this.username + "';", function(err, row) {
		if (row !== undefined) {
			return row.username;
			done();
		}
	});
};

module.exports = User;