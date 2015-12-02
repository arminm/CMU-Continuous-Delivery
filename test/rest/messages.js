var expect = require('expect.js');
var Client = require('node-rest-client').Client;
var User = require('../../models/user.js');
var dbModule = require('../../config/db.js');
var db = dbModule.getDB();
var Message = require('../../models/message.js');
var client = new Client();
var Utils = require('../../utilities.js');
var now = function() {return (new Date()).getTime();};

var host = "http://localhost:4444/";

// Creates a user double object to be used for creating users
// in the database and checking the results
function createUserDouble(options) {
  var currentTime = now();
  var double = {
    fullName: options.fullName || 'Random Name',
    username: options.username || 'Random Username ' + currentTime,
    password: options.password || '1234',
    createdAt: options.createdAt || currentTime,
    updatedAt: options.updatedAt || null,
    lastLoginAt: options.lastLoginAt || currentTime,
    isActive: options.isActive || true,
    isOnline: options.isOnline || true,
    statusCode: options.statusCode || 'OK',
    statusUpdatedAt: options.statusUpdatedAt || currentTime,
    profile: options.profile || 'CITIZEN'
  };
  return double;
};

// Creates a statusCrumb double object
function createMessageDouble(options) {
  var currentTime = now();
  var double = {
    content: options.content || "Random content",
    author: options.author || 'Random Username ' + currentTime,
    messageType: options.messageType || "WALL",
    target: options.target,
    postedAt: options.postedAt || currentTime,
  };
  return double;
};

// POSTs to server to create a user in the database using a user double
function postMessage(double, callback) {
  var args = {
    data: double,
    headers:{"Content-Type": "application/json"}
  };
  client.post(host+"messages/"+double.author, args, function(data,response) {
    callback(data, response);
  });
};

// GETs a message
function getMessage(messageId, access_key, callback) {
  client.get(host+"messages/"+messageId+"?access_key="+access_key, {}, function(data,response) {
    callback(data, response);
  });
};

function createMessage(double, callback) {
  Message.create(double, function(id, error) {
    callback(id);
  });
};

// Compare two user objects
function areTheSame(double, message) {
  return Utils.areEqual(Utils.replacer(double, ['postedAt']), Utils.replacer(message, ['createdAt']));
}

suite('REST: Message', function() {
  var messageId;
  var client = new Client();
  var userArmin, userDimitris;
  var messageWall, messageChat, messageAnn;
  var wallID, chatID, annID;
  setup(function(done) {
    // Connect to database
    userArmin = createUserDouble({
      fullName: 'Armin',
      username: 'armin',
      password: '1234',
      createdAt: 123123123123
    });
    userDimitris = createUserDouble({
      fullName: 'dimitris',
      username: 'dimitris',
      password: '1234',
      createdAt: 123123123123
    });
    messageWall = createMessageDouble({
      author: userArmin.username
    });
    messageChat = createMessageDouble({
      author: userArmin.username,
      target: userDimitris.username,
      messageType: 'CHAT'
    });
    messageAnn = createMessageDouble({
      author: userDimitris.username,
      messageType: 'ANNOUNCEMENTS'
    });
    User.create(userArmin, function(isCreated) {
      User.create(userDimitris, function(isCreated) {
        var info = {
          username: 'dimitris',
          profile: 'COORDINATOR'
        };
        User.updateUser(info, function(isUpdated) {
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
    var double = createMessageDouble({
      author: userArmin.username
    });

    postMessage(double, function(data,response) {
      expect(response.statusCode).to.eql(201);
      done();
    });
  });

  test('Post a new message with a non-existing user', function(done) {
    var double = createMessageDouble({
      author: "random"
    });

    postMessage(double, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get a specific message that exists', function(done) {
    createMessage(messageWall, function(id){
      getMessage(id, userDimitris.username, function(data,response) {
        expect(response.statusCode).to.eql(200);
        expect(areTheSame(messageWall, JSON.parse(data))).to.be.ok();
        done();
      });
    })
  });

  test('Get a specific message that does not exist', function(done) {
    getMessage(0, userDimitris.username, function(data,response) {
      expect(response.statusCode).to.eql(404);
      done();
    });
  });

  test('Get all messages for WALL', function(done) {
    createMessage(messageWall, function(id){
      createMessage(messageChat, function(id){

        client.get(host+"messages?messageType=WALL&access_key="+userArmin.username, {}, function(data,response) {
          expect(response.statusCode).to.eql(200);
          var messages = JSON.parse(data);
          expect(messages).to.have.length(1);
          expect(areTheSame(messageWall, messages[0])).to.be.ok();
          done();
        });
      });
    });
  });

  test('Get all messages that are not for WALL', function(done) {
    createMessage(messageWall, function(id){
      createMessage(messageChat, function(id){
        client.get(host+"messages?messageType=CHAT&sender=armin&receiver=dimitris&access_key=dimitris", {}, function(data,response) {
          expect(response.statusCode).to.eql(200);
          var messages = JSON.parse(data);
          expect(messages).to.have.length(1);
          expect(areTheSame(messageChat, messages[0])).to.be.ok();
          done();
        });
      });
    });
  });

  test('Post a new announcement', function(done) {
    createMessage(messageAnn, function(id){
      client.get(host+"messages?messageType=ANNOUNCEMENTS&access_key=dimitris", {}, function(data, response) {
        expect(response.statusCode).to.eql(200);
        var messages = JSON.parse(data);
        expect(messages).to.have.length(1);
        expect(areTheSame(messageAnn, messages[0])).to.be.ok();
        done();
      });
    });
  });

  test('Get all messages between two users', function(done) {
    createMessage(messageChat, function(id){
      var messageChat2 = createMessageDouble({
        author: messageChat.author,
        target: messageChat.target,
        messageType: messageChat.messageType,
        content: "other content"
      });
      createMessage(messageChat2, function(id2){
        client.get(host+"messages?messageType=CHAT&sender=armin&receiver=dimitris&access_key=dimitris", {}, function(data,response) {
          expect(response.statusCode).to.eql(200);
          var messages = JSON.parse(data);
          expect(messages).to.have.length(2);
          var match_count = 0;
          for (msg of messages) {
            if (areTheSame(messageChat, msg) || areTheSame(messageChat2, msg)) {
              match_count++;
            }
          }
          expect(match_count).to.eql(2);
          done();
        });
      });
    });
  });

});
