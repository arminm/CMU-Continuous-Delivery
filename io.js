var io = require('socket.io')();

// socket io operations
io.on('connection', function(client) {
  console.log("A client has connected");

  client.on('join', function(username) {
  	console.log('join: ' + username);
  	client.join(username);
  });

  client.on('disconnect', function() {
    console.log("A client has left SSNoC");
  });
});

var formNotification = function(id, action) {
	return {id: id, action: action};
};

module.exports = {
	attach: function(server) {
		io.attach(server);
	},

	broadcast: function(type, id, action, sender, receiver) {
		if (receiver) {
			io.sockets.in(sender).emit(type, formNotification(id, action));
			io.sockets.in(receiver).emit(type, formNotification(id, action));
		} else {
			io.sockets.emit(type, formNotification(id, action));
		}
	}
};