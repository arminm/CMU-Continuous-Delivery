var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

// GET users listing. 
router.get('/', function(req, res, next) {
  userController.getAllUsers();
});

// GET specific user info
router.get('/:username', function(req, res, next) {
	userController.getUser(req.params.username);
});

// Update user info
router.put('/:username', function(req, res, next) {
	userController.updateUser(req.params.username);
});

module.exports = router;
