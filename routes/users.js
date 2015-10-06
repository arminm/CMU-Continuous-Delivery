var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

// GET users listing. 
router.get('/', function(req, res, next) {
	userController.getAllUsers(function(users) {
		res.send(users);
	});
});

// GET specific user info
router.get('/:username', function(req, res, next) {
	userController.getUser(req.params.username, function(user) {
		res.send(user);
	});
});

module.exports = router;
