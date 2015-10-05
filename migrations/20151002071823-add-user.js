var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
    id: {type: 'int', primaryKey: true, autoIncrement: true,
                    notNull: true},
    username: {type: 'string', notNull: true, unique: true},
    password: {type: 'string', notNull: true},
    fullName: 'string',
    createdAt: {type: 'timestamp', notNull: true},
    updatedAt: 'timestamp',
    lastLoginAt: 'timestamp',
    lastStatusCode: {type: 'string', defaultValue: 'GREEN'},
    isActive: 'boolean',
    isOnline: 'boolean'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
