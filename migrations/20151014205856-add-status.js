var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('statusCrumbs', {
    crumbId: {type: 'int', primaryKey: true, autoIncrement: true,
                    notNull: true},
    username: {type: 'string', notNull: true},
    statusCode: {type: 'string', notNull: true},
    statusUpdatedAt: {type: 'timestamp', notNull: true}
  }, createStatus);
  function createStatus(error) {
    if (error) {
      callback(error);
      return;
    }
	db.insert('statusCrumbs', ['username', 'statusCode', 'statusUpdatedAt'], ['SSNAdmin', 'OK', (new Date()).getTime()], callback);
  }
};

exports.down = function(db, callback) {
  db.dropTable('statusCrumbs', callback);
};
