angular.module('myApp')
.controller('wallController', function($scope, $location, JoinCommunity, User, Message, Socket) {
	$scope.username = User.getUsername();
	$scope.messages = [];
	$scope.logout = function () {
		// When the user opts to logout, take them to home page and clear user data regardless the call's status
		JoinCommunity.logout(User.getUsername())
		.success(function(data, status, headers, config) {	
		})
		.error(function(data, status, headers, config) {
		});
		$location.path('/');
		User.reset();
	};
	$scope.getAllMessages = function () {
		Message.getAll('WALL')
		.success(function(data, status, headers, config) {
			$scope.messages = data;
		})
		.error(function(data, status, headers, config) {
			$scope.formError.generic = "Something went wrong. Please try again.";
		});
	};
	$scope.send = function() {
		var messageData= {
			content: $scope.messageInput,
			messageType: 'WALL',
			postedAt: Date.now()
		};
		Message.post(User.getUsername(),messageData)
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
	Socket.on('messages', function(data) {
		console.log('messages: ' + JSON.stringify(data));
		if (data.action === 'created') {
			Message.get(data.id)
			.success(function(data, status, headers, config) {
				if (status == '200') {
					$scope.messages.push(data);
				}
			})
			.error(function(data, status, headers, config) {
				// TODO 
			});
		}
	});
	$scope.getPresentableTime = function(timestamp) {
		var date = new Date(Number(timestamp));
		var dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
		return dateString;
	};
});
