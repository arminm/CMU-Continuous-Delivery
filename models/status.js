var dbModule = require('../config/db.js');
var utils = require('../utilities.js');

module.exports = {
	createStatusCrumb: function(info, callback) {
		var db = dbModule.getDB();
		db.run('INSERT INTO statusCrumbs (username, statusCode, statusUpdatedAt) VALUES ($1, $2, $3);', {
			$1: info.username,
			$2: info.statusCode,
			$3: info.statusUpdatedAt
		},function(error) {
			if (error) {
				callback(null, error);
			} else {
				db.get('SELECT MAX(crumbID) as id FROM statusCrumbs', function(error, row) {
					if (error) {
						console.log(error);
						callback(null, error);
					} else if (row) {
  						callback(row.id);
					} else {
						callback();
					}
  				});
  			}
  		});
	},

	getAllStatusCrumbs: function(username, callback) {
		var db = dbModule.getDB();
		var statusCrumbs = [];
		db.each("SELECT * FROM statusCrumbs WHERE username='" + username + "';",
			function(error, row) {
				if (error) {
					console.log(error);
					callback(null, error);
				} else {
					statusCrumbs.push(utils.replacer(row, ['id']));
				}
			}, function() {
				callback(statusCrumbs, null);
			}
		);
	},

	getStatusCrumb: function(id, callback) {
		var db = dbModule.getDB();
		db.get("SELECT * FROM statusCrumbs WHERE crumbID=" + id + ";", function(error, row) {
			if (error) {
				callback(null, error);
			} else if (row) {
				var statusCrumb = utils.replacer(row, ['crumbId']);
				callback(statusCrumb, null);
			} else {
				callback();
			}
		});
	}
};