var User = require('../../models/user.js');
var Message = require('../../models/message.js');
var expect = require('expect.js');
var dbModule = require('../../config/db.js');
var db = dbModule.getDB();
var Utils = require('../../utilities.js');
var now = function() {return (new Date()).getTime();};

// Creates a message double object to be used for creating messages
// in the database and checking the results
function createDouble(options) {
  var double = {
    content: options.content || 'Random Message',
    author: options.author || 'Random Author ' + now(),
    target: options.target,
    messageType: options.messageType || 'WALL',
    createdAt: options.createdAt || now()
  };
  return double;
};


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

// Gets an actual message from the database
function getMessage(id, callback) {
  Message.get(id, function(message, error) {
    expect(error).to.not.be.ok();
    callback(message, error);
  });
};

// Creates the actual message in the database using a message double
function createMessage(double, callback) {
  Message.create(double, function(id, error) {
    if (id && !error) {
      getMessage(id, function(message){
        callback(message, error);
      });
    } else {
      callback(null, error);
    }
  });
};

// Compare two message objects
function areTheSame(double, message) {
  return Utils.areEqual(double, message);
}

suite('Message: ', function() {
  var messageWallId;
  var messageWallA, messageWallB, messageChat, userA, userB, userC;

  setup(function() {
    userA = createUserDouble({
      username: "john"
    });
    User.create(userA, function(isCreated, error) {});
    messageWallA = createDouble({
      content: "Hello",
      author: "john",
      messageType: "WALL"
    });
    userB = createUserDouble({
      username: "armin"
    });
    User.create(userB, function(isCreated, error) {});
    messageWallB = createDouble ({
      content: "Bye",
      author: "armin",
      messageType: "WALL"
    });
    userC = createUserDouble({
      username: "mandy"
    });
    User.create(userC, function(isCreated, error) {});
    messageChat = createDouble ({
      content: "Let's chat!",
      author: "armin",
      target: "mandy",
      messageType: "CHAT"
    });
  });

  teardown(function() {
    // Clean up
    db.run("DELETE FROM messages");
  });

  test('Create a new message and get it', function(done) {
    createMessage(messageWallA, function(message, error) {
      expect(error).to.not.be.ok();
      expect(areTheSame(messageWallA, message)).to.be.ok();
      done();
    });
  });

  test('Get a message that does not exist', function(done) {
    getMessage(-1, function(message, error) {
      expect(error).to.not.be.ok();
      expect(message).to.not.be.ok();
      done();
    });
  });

  test('Get all messages for WALL', function(done) {
    // Create 2 wall messages (messageWallA and messageWallB)
    // and a chat message (messageChat)
    createMessage(messageWallA, function() {
      createMessage(messageWallB, function() {
        createMessage(messageChat, function() {

          // get all wall messages and expect messageWallA and messageWallB
          Message.getAllMessages('WALL', undefined, undefined, function(messages, error) {
            expect(error).to.not.be.ok();
            // make sure there are two results, and they are both what we expected
            expect(messages.length).to.eql(2);
            // make sure they are not the same message
            expect(areTheSame(messages[0], messages[1])).to.not.be.ok();
            // Count matching unique messages
            var matchCount = 0;
            for (var message of messages) {
              if (areTheSame(messageWallA, message) || areTheSame(messageWallB, message)) {
                matchCount++;
              }
            }
            expect(matchCount).to.eql(2);
            done();
          });
        });
      });
    });
  });

  test('Get all CHAT messages between two users', function(done) {
    // Create 2 wall messages (messageWallA and messageWallB)
    // and a chat message (messageChat)
    createMessage(messageWallA, function() {
      createMessage(messageWallB, function() {
        createMessage(messageChat, function() {
          // get all chat messages and expect messageWallChat only
          Message.getAllMessages('CHAT', messageChat.author, messageChat.target, function(messages, error) {
            expect(error).to.not.be.ok();
            expect(messages.length).to.eql(1);
            expect(areTheSame(messageChat, messages[0])).to.be.ok();
            done();
          });
        });
      });
    });
  });
});
