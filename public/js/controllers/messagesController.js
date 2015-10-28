angular.module('myApp')
.controller('messagesController', function($scope, $stateParams, $state, User, Message, MessageFactory, Socket) {
	$scope.buddy = null;
	$scope.username = User.getUsername();
	$scope.messages = [];
	switch ($state.$current.url.sourcePath) {
		case '/lobby/announcements':
			$scope.title = "Announcements";
			$scope.messageType = 'ANNOUNCEMENTS';
			break;
		case '/lobby/chatbuddies':
			$scope.messageType = 'CHAT';
			$scope.title = "To: " + $stateParams.username;
			$scope.buddy = $stateParams.username;
			break;
		case '/lobby/wall':
			$scope.messageType = 'WALL';
			$scope.title = "Wall";
			break;
	}

	$scope.getAllMessages = function () {
		MessageFactory.getAll($scope.messageType, User.getUsername(), $scope.buddy)
		.success(function(data, status, headers, config) {
			$scope.messages = data;
			scrollToBottom(false, '#scrollingMessages');
		})
		.error(function(data, status, headers, config) {
			$scope.formError.generic = "Something went wrong. Please try again.";
		});
	};

	$scope.status = function(username) {
		return User.getStatus(username);
	};
	
	$scope.post = function() {
		var messageData= {
			target: $scope.buddy,
			content: $scope.messageInput,
			messageType: $scope.messageType,
			postedAt: Date.now()
		};
		MessageFactory.post($scope.username,messageData)
		.success(function(data, status, headers, config) {
			$scope.messageInput = '';
		})
		.error(function(data, status, headers, config) {
			// TODO 
			$scope.formError.generic = "Something went wrong. Please try again.";
		});
	};

	$scope.$on('new message', function(event, message, type) {
		if (type === $scope.messageType) {
			$scope.messages.push(message);
		}
	});
	$scope.getAllMessages();
});