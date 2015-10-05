var express = require('express');
var router = express.Router();
var joinCommunityController = require('../controllers/joinCommunityController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// handle signup
router.post('/signup/:username', function(req, res){
	joinCommunityController.signup(req.body.name, req.params.username, req.body.password);
}); 

// handle login
router.post('login/:username', function(req, res) {
	joinCommunityController.login(req.params.username, req.body.password);
});

module.exports = router;
