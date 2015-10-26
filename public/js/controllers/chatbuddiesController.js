angular.module('myApp')
.controller('chatbuddiesController', function($scope, $stateParams, $location, JoinCommunity, User, Message, MessageFactory, Socket) {
	$scope.username = User.getUsername();
	$scope.buddy = $stateParams.username;
	$scope.messages = [];
	$scope.title = "To: " + $scope.buddy;
	$scope.getAllMessages = function () {
		MessageFactory.getAllPrivate('CHAT', User.getUsername(), $scope.buddy)
		.success(function(data, status, headers, config) {
			$scope.messages = data;
			scrollToBottom(false, '#scrollingMessages');
		})
		.error(function(data, status, headers, config) {
			$scope.formError.generic = "Something went wrong. Please try again.";
		});
	};

	$scope.status = function(username) {
		return User.getUser(username);
	};
	
	$scope.send = function() {
		var messageData= {
			target: $scope.buddy,
			content: $scope.messageInput,
			messageType: 'CHAT',
			postedAt: Date.now()
		};
		MessageFactory.post(User.getUsername(), messageData)
		.success(function(data, status, headers, config) {
			if (status == '201') {
				$scope.messageInput = '';
			}
			
		})
		.error(function(data, status, headers, config) {
			// TODO 
			if (status == '404') {
				$scope.formError.generic = "The username doesn't exist";
			} else {
				$scope.formError.generic = "Something went wrong. Please try again.";
			}
		});
	};
	$scope.getAllMessages();
	Message.clearQueueForUser($scope.buddy);
});
