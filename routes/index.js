var express = require('express');
var router = express.Router();
var joinCommunityController = require('../controllers/joinCommunityController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

// handle signup
router.post('/signup/:username', function(req, res){
	joinCommunityController.signup(req.body.fullName, req.params.username, req.body.password, function(returnMessage) {
		if (returnMessage === 'Created') {
			res.status(201);
		} 
		else if (returnMessage === 'Unauthorized') {
			res.status(401);
		} else {
			res.status(200);
		}
		res.send();
	});
}); 

// handle login
router.post('login/:username', function(req, res) {
	joinCommunityController.login(req.params.username, req.body.password);
	res.send("ok");
});

module.exports = router;
