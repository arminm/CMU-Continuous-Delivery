angular.module('myApp')
.controller('wallController', function($scope, $location, JoinCommunity, User, Message, MessageFactory, Socket) {
	$scope.username = User.getUsername();
	$scope.messages = [];
	$scope.getAllMessages = function () {
		MessageFactory.getAll('WALL')
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
			content: $scope.messageInput,
			messageType: 'WALL',
			postedAt: Date.now()
		};
		MessageFactory.post(User.getUsername(),messageData)
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
	// $scope.directory();
	Socket.on('WALL', function(data) {
		console.log('messages: ' + JSON.stringify(data));
		if (data.action === 'created') {
			MessageFactory.get(data.id)
			.success(function(data, status, headers, config) {
				if (status == '200') {
					$scope.messages.push(data);
					scrollToBottom(true, '#scrollingMessages');
				}
			})
			.error(function(data, status, headers, config) {
				// TODO 
			});
		}
	});
});
