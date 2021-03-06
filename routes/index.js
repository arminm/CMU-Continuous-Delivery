var express = require('express');
var router = express.Router();
var joinCommunityController = require('../controllers/joinCommunityController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout');
});

router.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

// handle signup
router.post('/signup/:username', joinCommunityController.signup);

// handle login
router.post('/login/:username', joinCommunityController.login);

// handle logout
router.post('/logout/:username', joinCommunityController.logout);

module.exports = router;
