var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('messages', {
    id: {type: 'int', primaryKey: true, autoIncrement: true,
                    notNull: true},
    content: {type: 'string', notNull: true},
    author: {type: 'string', notNull: true},
    target: 'string',
    messageType: {type: 'string', notNull: true},
    createdAt: {type: 'timestamp', notNull: true}
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('messages', callback);
};
