angular.module('socketService', ['MessageService']).factory('Socket', function($rootScope) {
	var socket = io.connect();
	console.log(socket);
	return socket;
});
