var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController.js');

// POST a message on the public wall
router.post('/:username', function(req, res, next) {
	messageController.postMessageOnWall(req.params.username);
	res.send("ok");
});

// GET all messages on the public wall
router.get('/wall', function(req, res, next) {
	messageController.getMessages();
	res.send("ok");
});

module.exports = router;