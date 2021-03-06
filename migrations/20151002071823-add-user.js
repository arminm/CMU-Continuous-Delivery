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
    isActive: {type: 'boolean', notNull: true, defaultValue: 1},
    isOnline: {type: 'boolean', notNull: true, defaultValue: 1},
    profile: {type: 'string', notNull: true, defaultValue: 'CITIZEN'}
  }, createAdmin);
  function createAdmin(error) {
    if (error) {
      callback(error);
      return;
    }
    db.insert('users', ['username', 'password', 'createdAt', 'profile', 'isOnline'], ['SSNAdmin', 'admin', (new Date()).getTime(), 'ADMINISTRATOR', 0], callback);
  }
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
