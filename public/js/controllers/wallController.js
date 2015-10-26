angular.module('myApp')
.controller('wallController', function($scope, $location, JoinCommunity, User, Message, MessageFactory, Socket) {
	$scope.username = User.getUsername();
	$scope.messages = [];
	$scope.limitResults = 1000000;
	$scope.searchText = '';
	$scope.searchMode = false;

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

	$scope.searchOn = function() {
		$scope.searchMode = true;
	};

	$scope.searchOff = function() {
		$scope.searchMode = false;
		$scope.getAllMessages();
		$scope.limitResults = 1000000;
		$scope.searchText = '';
	};

	$scope.search = function() {
		if ($scope.searchString !== '') {
			$scope.searchText = $scope.searchString;
			$scope.messages.reverse();
			if ($scope.limitResults === 1000000) {
				$scope.limitResults = 10;
			}
		} else {
			$scope.getAllMessages();
			$scope.limitResults = 1000000;
			$scope.searchText = '';
		}
	};

	$scope.showMoreResults = function() {
		$scope.limitResults += 10;
	};
	
	$scope.getPresentableTime = function(timestamp) {
		var date = new Date(Number(timestamp));
		var dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
		return dateString;
	};
});
