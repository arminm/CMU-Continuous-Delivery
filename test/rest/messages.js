var expect = require('expect.js');
var Client = require('node-rest-client').Client;
var User = require('../../models/user.js');
var dbModule = require('../../config/db.js');
var db = dbModule.getDB();
var Message = require('../../models/message.js');

function createMessage(messageType, author, content, target, callback) {
  var messageInfo = {
      content: content,
      author: author,
      messageType: messageType,
      target: target,
      createdAt: 1231242121412
  };
  Message.create(messageInfo, function(id, error) {
    callback(id);
  });
};

function isEqual(messageType, content, target, message) {
  return message.messageType === messageType && message.content === content && message.target === target;
}

suite('REST: Message', function() {
  var messageId;
  var client = new Client();

  setup(function(done) {
    // Connect to database
    var userInfo = {
      fullName: 'Armin',
      username: 'armin',
      password: '1234',
      createdAt: 123123123123
    };
    User.create(userInfo, function(isCreated) {});

    var userInfo = {
      fullName: 'dimitris',
      username: 'dimitris',
      password: '1234',
      createdAt: 123123123123
    };
    User.create(userInfo, function(isCreated) {});
    var info = {
      username: 'dimitris',
      profile: 'COORDINATOR'
    };
    User.updateUser(info, function(isUpdated) {});
    createMessage('WALL', 'armin', 'Hello', null, function(id) {
      messageId = id;

      createMessage('CHAT', 'armin', 'Hello2', 'dimitris', function(id){
        createMessage('ANNOUNCEMENTS', 'dimitris', 'Hello World!', null, function() {
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
    var args = {
      data: { content : "hello", messageType: "WALL", postedAt: 123124124124 },
      headers:{"Content-Type": "application/json"}
    };

    client.post("http://localhost:4444/messages/pragya", args, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get a specific message that exists', function(done) {
    var args = {};

    client.get("http://localhost:4444/messages/" + messageId + "?access_key=dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      done();
    });
  });

  test('Get a specific message that does not exist', function(done) {
    var args = {};
    client.get("http://localhost:4444/messages/0?access_key=dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get all messages for WALL', function(done) {
    var args = {};
    client.get("http://localhost:4444/messages?messageType=WALL&access_key=dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      var messages = JSON.parse(data);
      expect(messages).to.have.length(1);
      expect(isEqual('WALL', 'Hello', null , messages[0])).to.be.ok();
      done();
    });
  });

  test('Get all messages that are not for WALL', function(done) {
    var args = {};
    client.get("http://localhost:4444/messages?messageType=CHAT&sender=armin&receiver=dimitris&access_key=dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      expect(JSON.parse(data)).to.have.length(1);
      var messages = JSON.parse(data);
      expect(messages).to.have.length(1);
      expect(isEqual('CHAT', 'Hello2', 'dimitris' , messages[0])).to.be.ok();
      done();
    });
  });

  test('Post a new announcement', function(done) {
    var args = {
      data: { content : "announcement", messageType: "ANNOUNCEMENTS", postedAt: 123124124124 },
      headers:{"Content-Type": "application/json"}
    };
    client.post("http://localhost:4444/messages/dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(201);
      args = {};
      client.get("http://localhost:4444/messages?messageType=ANNOUNCEMENTS&access_key=dimitris", args, function(data, response) {
        expect(response.statusCode).to.eql(200);
        var messages = JSON.parse(data);
        expect(messages).to.have.length(2);
        expect(isEqual('ANNOUNCEMENTS', 'announcement', null , messages[1])).to.be.ok();
        done();
      });
    });
  });

  test('Get all announcements', function(done) {
    var args = {};
    client.get("http://localhost:4444/messages?messageType=ANNOUNCEMENTS&access_key=dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      var messages = JSON.parse(data);
      expect(messages).to.have.length(1);
      expect(isEqual('ANNOUNCEMENTS', 'Hello World!', null , messages[0])).to.be.ok();
      done();
    });
  });

  test('Get all messages between two users', function(done) {
    var args = {};
    client.get("http://localhost:4444/messages?messageType=CHAT&sender=armin&receiver=dimitris&access_key=dimitris", args, function(data,response) {
      expect(response.statusCode).to.eql(200);
      var messages = JSON.parse(data);
      expect(messages).to.have.length(1);
      expect(isEqual('CHAT', 'Hello2', 'dimitris' , messages[0])).to.be.ok();
      done();
    });
  });
});
