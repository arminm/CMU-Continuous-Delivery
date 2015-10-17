var User = require('../../models/user.js');
var expect = require('expect.js');
var db = require('../../config/db.js');
var Client = require('node-rest-client').Client;

suite('Users: REST', function() {

	setup(function(done) {
		User.create('Dimitris', 'dimitris', '1234', 123123123123, function(isCreated) {
			done();
		});
	});

	teardown(function() {
    // Clean up
    	db.run("DELETE FROM users");
  	});

	test('Get an existing user', function(done) {
		client = new Client();
		var args = {
  		headers:{"Content-Type": "application/json"} 
		};

		client.get("http://localhost:4444/users/dimitris", args, function(data,response) {
    	expect(response.statusCode).to.eql(200);
    	done();
		});
	});

	test('Get a non-existing user', function(done) {
		client = new Client();
		var args = {
  		headers:{"Content-Type": "application/json"} 
		};

		client.get("http://localhost:4444/users/pragya", args, function(data,response) {
    	expect(response.statusCode).to.eql(404);
    	done();
		});
	});

	test('Get all users', function(done) {
		client = new Client();
		var args = {
			headers:{"Content-Type": "application/json"}
		};

		client.get("http://localhost:4444/users", args, function(data,response) {
    	expect(response.statusCode).to.eql(200);
    	expect(JSON.parse(data)).to.have.length(1);
    	done();
		});
	});
});