var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var envDB = process.env.DB || 'dev';
var db;
module.exports = {
	getDB: function() {
		if (db === undefined) {
			db = new sqlite3.Database(path.join(__dirname, '../ssnoc-' + envDB + '.db'));
			console.log("DB created");
		}
		return db;
	},

	switchToTest: function() {
		db = undefined;
		envDB = 'test';
	},

	switchBack: function() {
		db = undefined;
		envDB = process.env.DB || 'dev';
	}
}
