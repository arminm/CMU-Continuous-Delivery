var express = require('express');
var router = express.Router();
var joinCommunityController = require('../controllers/joinCommunityController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SSNoC' });
});

// handle signup
router.post('/signup/:username', joinCommunityController.signup); 

// handle login
router.post('/login/:username', joinCommunityController.login);

// handle logout
router.get('/logout/:username', joinCommunityController.logout);

module.exports = router;
