angular.module('socketService', ['MessageService']).factory('Socket', function($rootScope) {
	var socket = io.connect("http://" + window.location.hostname + ":4444");
	console.log(socket);
	return socket;
});
