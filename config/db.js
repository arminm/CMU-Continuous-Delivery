var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(path.join(__dirname, '../ssnoc-' + process.env.DB + '.db'));

module.exports = db;