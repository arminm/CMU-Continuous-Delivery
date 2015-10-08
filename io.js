var io = require('socket.io')();

// socket io operations
io.on('connection', function(client) {
  console.log("A client has connected");

  client.on('disconnect', function() {
    console.log("A client has left SSNoC");
  });
});

module.exports = io;