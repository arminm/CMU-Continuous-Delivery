var io = require('socket.io')();

// socket io operations
io.on('connection', function(client) {
  console.log("A client has connected");

  client.on('join', function(username) {
  	client.join(username);
  });

  client.on('disconnect', function() {
    console.log("A client has left SSNoC");
  });
});

var formNotification = function(type, id, action) {
	return {type: type, id: id, action: action};
};

module.exports = {
	attach: function(server) {
		io.attach(server);
	},

	broadcast: function(type, id, action, sender, receiver) {
		if (receiver) {
			io.sockets.in(sender).emit(type, formNotification(type, id, action));
			io.sockets.in(receiver).emit(type, formNotification(type, id, action));
		} else {
			io.sockets.emit(type, formNotification(type, id, action));
		}
	}
};