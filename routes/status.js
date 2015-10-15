var express = require('express');
var router = express.Router();
var statusController = require('../controllers/statusController.js');

// POST a new status for the specified user
router.post('/:username', statusController.changeStatus);

// GET all the statusCrumbs for a specific user (parameter username should be provided)
router.get('/', statusController.getAllStatusCrumbs);

// GET a statusCrumb specified by id 
router.get('/:id', statusController.getStatusCrumb);

module.exports = router;
