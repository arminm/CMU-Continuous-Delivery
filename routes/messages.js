var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController.js');

// POST a message on the public wall
router.post('/:username', function(req, res, next) {
	messageController.postMessageOnWall(req.params.username, req.body.content, req.body.postedAt, function(returnMessage) {
		if (returnMessage === 'Not Found') {
			res.status(404);
		} else {
			res.status(200);
		}
		res.send();
	});
});

// GET all messages from the public wall
router.get('/wall', function(req, res, next) {
	messageController.getAllMessages(function (messages) {
		res.send(messages);
	});
});

module.exports = router;