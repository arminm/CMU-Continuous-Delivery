var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController.js');

// POST a message (author is the sender's username)
router.post('/:author', messageController.postMessage);

// GET all messages (parameter messageType should be provided)
router.get('/', messageController.getAllMessages);

router.get('/:id', messageController.getMessage);

module.exports = router;