var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController.js');

// GET users listing. 
router.get('/users', adminController.getAllUsers);

// Update a specific user
router.put('/:username', adminController.updateUser);

module.exports = router;
