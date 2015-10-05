var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

// GET users listing. 
router.get('/', function(req, res, next) {
	userController.getAllUsers();
	res.send("ok");
});

// GET specific user info
router.get('/:username', function(req, res, next) {
	userController.getUser(req.params.username);
	res.send("ok");
});

// Update user info
router.put('/:username', function(req, res, next) {
	userController.updateUser(req.params.username);
	res.send("ok");
});

module.exports = router;
