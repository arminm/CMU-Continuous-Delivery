angular.module('socketService', []).factory('Socket', function($rootScope) {
		var socket = io.connect("http://localhost:4444");
		socket.on('messages', function(data) {
			console.log('messages: ' + JSON.stringify(data));
		});
        return socket;
});
