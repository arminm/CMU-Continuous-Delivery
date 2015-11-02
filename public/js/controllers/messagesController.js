angular.module('myApp')
.controller('messagesController', function($scope, $stateParams, $state, User, Message, MessageFactory, Socket) {
	$scope.buddy = null;
	$scope.username = User.getUsername();
	$scope.messages = [];
	$scope.limitResults = 1000000;
	$scope.searchText = '';
	$scope.descending = false;
	$scope.searchMode = false;
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

	$scope.clear = function() {
		$scope.searchMode = false;
		$scope.getAllMessages();
		$scope.limitResults = 1000000;
		$scope.searchText = '';
		$scope.descending = false;
	};

	$scope.search = function(param) {
		$scope.searchMode = true;
		if (param !== '') {
			$scope.searchText = param;
			if ($scope.limitResults === 1000000) {
				$scope.descending = true;
				$scope.limitResults = 10;
			}
		} else {
			$scope.getAllMessages();
			$scope.limitResults = 1000000;
			$scope.descending = false;
		}
	};

	$scope.showMoreResults = function() {
		$scope.limitResults += 10;
	};

	$scope.$on('new message', function(event, message, type) {
		if (type === $scope.messageType) {
			$scope.messages.push(message);
		}
	});
	$scope.getAllMessages();
});