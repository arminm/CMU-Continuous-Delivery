var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var envDB = process.env.DB || 'dev';
var db = new sqlite3.Database(path.join(__dirname, '../ssnoc-' + envDB + '.db'));

module.exports = db;
