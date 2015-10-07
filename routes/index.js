var express = require('express');
var router = express.Router();
var joinCommunityController = require('../controllers/joinCommunityController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

// handle signup
router.post('/signup/:username', function(req, res){
	joinCommunityController.signup(req.body.fullName, req.params.username, req.body.password, req.body.createdAt, function(returnMessage) {
		if (returnMessage === 'Created') {
			res.status(201);
		} 
		else if (returnMessage === 'Unauthorized') {
			res.status(401);
		} 
		else if (returnMessage === 'OK'){
			res.status(200);
		}
		res.send();
	});
}); 

// handle login
router.post('/login/:username', function(req, res) {
	joinCommunityController.login(req.params.username, req.body.password, req.body.lastLoginAt, function(returnMessage) {
		if (returnMessage === 'OK') {
			res.status(200);
		} 
		else if (returnMessage === 'Unauthorized') {
			res.status(401);
		} else {
			res.status(404);
		}
		res.send();
	});
});

// handle logout
router.get('/logout/:username', function(req, res) {
	joinCommunityController.logout(req.params.username, function(returnMessage) {
		if (returnMessage === 'Bad Request') {
			res.status(400);
		} else {
			res.status(200);
		}
		res.send();
	});
});

module.exports = router;
