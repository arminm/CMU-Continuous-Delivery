var socket = io.connect("http://localhost:4444");

socket.on('public message', function(data) {
	console.log(data);
});