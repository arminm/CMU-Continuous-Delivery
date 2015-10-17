var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var dbEnv = process.env.DB;
var db = new sqlite3.Database(path.join(__dirname, '../ssnoc-' + dbEnv + '.db'));

module.exports = db;