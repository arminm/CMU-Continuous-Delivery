var socket = io.connect("http://localhost:4444");

socket.emit('join', 'jim');

socket.on('messages', function(data) {
	console.log('messages: ' + JSON.stringify(data));
});
