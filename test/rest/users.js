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
    	db.run("DELETE FROM statusCrumbs");
  	});

  test('Create a new user that does not exist', function(done) {
  	client = new Client();
    var args = {
      data: { fullName: "Armin", password: "1234", createdAt: 12312421444124 },
      headers:{"Content-Type": "application/json"} 
    };
    client.post("http://localhost:4444/signup/armin", args, function(data,response) {
      expect(response.statusCode).to.eql(201);
      done();
    });	
  });

  test('Create a new user that exists: correct password', function(done) {
  	client = new Client();
    var args = {
      data: { fullName: "Dimitris", password: "1234", createdAt: 12312421444124 },
      headers:{"Content-Type": "application/json"} 
    };
    client.post("http://localhost:4444/signup/dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      done();
    });	
  });

  test('Create a new user that exists: wrong password', function(done) {
  	client = new Client();
    var args = {
      data: { fullName: "Dimitris", password: "password", createdAt: 12312421444124 },
      headers:{"Content-Type": "application/json"} 
    };
    client.post("http://localhost:4444/signup/dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(401);
      done();
    });	
  });

	test('Get an existing user', function(done) {
		client = new Client();
		var args = {};

		client.get("http://localhost:4444/users/dimitris", args, function(data,response) {
    		expect(response.statusCode).to.eql(200);
    		done();
		});
	});

	test('Get a non-existing user', function(done) {
		client = new Client();
		var args = {};
		client.get("http://localhost:4444/users/pragya", args, function(data,response) {
    		expect(response.statusCode).to.eql(404);
    		done();
		});
	});

	test('Get all users', function(done) {
		client = new Client();
		var args = {};
		client.get("http://localhost:4444/users", args, function(data,response) {
    		expect(response.statusCode).to.eql(200);
    		expect(JSON.parse(data)).to.have.length(1);
    		done();
		});
	});
});