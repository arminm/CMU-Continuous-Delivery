var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

// GET users listing. 
router.get('/', userController.getAllUsers);

// GET specific user info
router.get('/:username', userController.getUser);

module.exports = router;
