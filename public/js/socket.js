angular.module('socketService', ['MessageService']).factory('Socket', function($rootScope, Message) {
	var socket = io.connect("http://192.168.1.1:4444");
	return socket;
});
