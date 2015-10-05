var sqlite3 = require('sqlite3').verbose();
var db = null;

module.exports = {
	getDB: function() {
		if (db === null) {
			db = new sqlite3.Database('../ssnoc.db')
		}
		return db;
	}
}