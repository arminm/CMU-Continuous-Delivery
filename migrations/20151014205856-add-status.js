var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('statusCrumbs', {
    crumbId: {type: 'int', primaryKey: true, autoIncrement: true},
    username: {type: 'string', notNull: true},
    // should be one of "GREEN", "YELLOW", "RED"
    statusCode: {type: 'string', notNull: true},
    createdAt: {type: 'timestamp', notNull: true},
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('statusCrumbs', callback);
};
