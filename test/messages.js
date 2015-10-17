var Message = require('../models/message.js');
var expect = require('expect.js');
var db = require('../config/db.js');

suite('Messages', function() {
  var messageId;

  setup(function(done) {
    // Connect to database
    var messageInfo = {
      content: "Hello", 
      author: "john", 
      messageType: "WALL", 
      target: null, 
      createdAt: 1231242121412
    };

    Message.create(messageInfo, function(id, error) {
      messageId = id;
      done();
    });
      
    messageInfo.content = "Hello1";

    Message.create(messageInfo, function(id, error) {
    });

    messageInfo.messageType = "CHAT";
    messageInfo.target = "john1";
    Message.create(messageInfo, function(id, error) {});
  });

  teardown(function() {
    // Clean up
    db.run("DELETE FROM messages");
  });

  test('Create a new message', function(done) {
    var messageInfo = {
      content: "Hello1", 
      author: "john", 
      messageType: "WALL", 
      target: null, 
      createdAt: 1231242121412
    };

    Message.create(messageInfo, function(id, error) {
      expect(id).to.be.a('number');
      done();
    });
  });

  test('Get a message that exists', function(done) {
    Message.getMessage(messageId, function(message, error) {
      expect(message).to.be.ok();
      done();
    });
  });

  test('Get a message that does not exist', function(done) {
    Message.getMessage(-1, function(message, error) {
      expect(message).to.not.be.ok();
      done();
    });
  });

  test('Get all messages for WALL', function(done) {
    Message.getAllMessages("WALL", function(messages, error) {
      expect(messages).to.eql([{
        content: "Hello", 
        author: "john", 
        target: null, 
        createdAt: 1231242121412
      }, {
        content: "Hello1", 
        author: "john", 
        target: null, 
        createdAt: 1231242121412
      }]);
      done();
    });
  });

  test('Do not get messages that are not for WALL', function(done) {
    Message.getAllMessages("WALL", function(messages, error) {
      expect(messages).to.not.contain({
        content: "Hello", 
        author: "john", 
        messageType: "CHAT", 
        target: "john1", 
        createdAt: 1231242121412
      });
      done();
    });
  });
});
