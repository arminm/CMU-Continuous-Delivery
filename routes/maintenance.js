var dbModule = require('../config/db.js');
var User = require('../models/user.js');

function maintenance(app, options) {
	var mode = false,
		endpoint = false,
		url ='/maintenance',
		accessKey,
		view = 'maintenance.html',
		api = false,
		status = 503,
		message = 'sorry, we are on maintenance', 
		routers;
	if (typeof options === 'boolean') {
		mode = options;
	} else if (typeof options === 'object') {
		mode = options.current || mode;
		endpoint = options.httpEndpoint || endpoint;
		url = options.url || url;
		view = options.view || view;
		api = options.api || api;
		status = options.status || status;
		message = options.message || message;
		routers = options.routers;
	} else {
		throw new Error('unsuported options');
	}

	var checkAccess = function (req, res, next) {

		var match = !accessKey || req.query.access_key === accessKey;
		if (!accessKey) {
			// Check user profile
			User.get(req.query.access_key, function(user, password, error) {
				if (error) {
					res.sendStatus(500);
				} else if (user && (user.profile == 'MONITOR' || user.profile == 'ADMINISTRATOR')) {
					next();
				} else {
					res.sendStatus(404);
				}
			});
		} else if (req.query.access_key === accessKey) {
			next();
		} 
		else {
			res.sendStatus(401);
		}
	};

	var server = function (app) {
		if (endpoint) {
			app.post(url, checkAccess, function (req, res) {
				dbModule.switchToTest();
				accessKey = req.query.access_key; // Update access_key to limit connections to single user
				mode = true;
				res.status(200);
				res.json({maintenance: mode});
			});

			app.delete(url, checkAccess, function (req, res) {
				var db = dbModule.getDB();
				db.run("DELETE FROM messages");
				db.run("DELETE FROM users");
				dbModule.switchBack();
				accessKey = null;	// clear the accessKey to allow for other admins to connect
				mode = false;
				res.status(200);
				res.json({maintenance: mode});
			});
		}
		return app;
	};

	var handle = function (req, res) {
		var isApi = api && req.url.indexOf(api) === 0;

		res.status(status);

		if (isApi) {
			return res.json({message: message});
		}

		return res.render(view);
	};

	var middleware = function (req, res, next) {
		if (mode && req.query.access_key !== accessKey) {
			return handle(req, res);
		}

		next();
	};

	var inject = function (app) {
		for (var i in routers) {
			var router = routers[i];
			router.use(middleware);
		}

		return app;
	};

	return server(inject(app));
}

module.exports = maintenance;
