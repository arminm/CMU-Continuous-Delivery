var expect = require('expect.js');
var Client = require('node-rest-client').Client;
var User = require('../../models/user.js');
var db = require('../../config/db.js');
var Message = require('../../models/message.js');

suite('Messages: REST', function() {
  var messageId;

  setup(function(done) {
    // Connect to database
    User.create('Armin', 'armin', '1234', 123123123123, function(isCreated) {});

    var messageInfo = {
      content: "Hello", 
      author: "john", 
      messageType: "WALL", 
      target: null, 
      createdAt: 1231242121412
    };

    Message.create(messageInfo, function(id, error) {
      messageId = id;

      messageInfo.messageType = "CHAT";
      messageInfo.target = "dimitris";

      Message.create(messageInfo, function(id, error) {
        messageInfo.messageType = "ANNOUNCEMENTS";
        messageInfo.target = null;
        Message.create(messageInfo, function(id, error) {
          done();
        });
      });
    });
  });

  teardown(function() {
    // Clean up
    db.run("DELETE FROM users");
    db.run("DELETE FROM messages");
  });

  test('Post a new message with an existing user', function(done) {
    client = new Client();
    var args = {
      data: { content : "hello", messageType: "WALL", postedAt: 123124124124 },
      headers:{"Content-Type": "application/json"} 
    };

    client.post("http://localhost:4444/messages/armin", args, function(data,response) {
      expect(response.statusCode).to.eql(201);
      done();
    });	
  });

  test('Post a new message with a non-existing user', function(done) {
    client = new Client();
    var args = {
      data: { content : "hello", messageType: "WALL", postedAt: 123124124124 },
      headers:{"Content-Type": "application/json"} 
    };

    client.post("http://localhost:4444/messages/dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get a specific message that exists', function(done) {
    client = new Client();
    var args = {};

    client.get("http://localhost:4444/messages/" + messageId, args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      done();
    });
  });

  test('Get a specific message that does not exist', function(done) {
    client = new Client();
    var args = {};
    client.get("http://localhost:4444/messages/0", args, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get all messages for WALL', function(done) {
    client = new Client();
    var args = {};
    client.get("http://localhost:4444/messages?messageType=WALL", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      expect(JSON.parse(data)).to.have.length(1);
      done();
    });
  });

  test('Get all messages that are not for WALL', function(done) {
    client = new Client();
    var args = {};
    client.get("http://localhost:4444/messages?messageType=CHAT", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      expect(JSON.parse(data)).to.have.length(1);
      done();
    });
  });

  test('Post a new announcement', function(done) {
    client = new Client();
    var args = {
      data: { content : "announcement", messageType: "ANNOUNCEMENTS", postedAt: 123124124124 },
      headers:{"Content-Type": "application/json"} 
    };
    client.post("http://localhost:4444/messages/armin", args, function(data,response) {
      expect(response.statusCode).to.eql(201);
      args = {};
      client.get("http://localhost:4444/messages?messageType=ANNOUNCEMENTS", args, function(data, response) {
        expect(response.statusCode).to.eql(200);
        expect(JSON.parse(data)).to.have.length(2);
        done();
      });
    }); 
  });

  test('Get all announcements', function(done) {
    client = new Client();
    var args = {};
    client.get("http://localhost:4444/messages?messageType=ANNOUNCEMENTS", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      expect(JSON.parse(data)).to.have.length(1);
      done();
    });
  });
});