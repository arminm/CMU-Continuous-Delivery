angular.module('myApp')
.controller('lobbyPageController', function($scope, $location, $state, JoinCommunity, User, Message, Socket, Status) {
	$scope.username = User.getUsername();
	$scope.userStatus = User.getStatus();
	$scope.userStatusLastUpdateTime = User.getLastStatusUpdated();
	$scope.onlineitems = [];
	$scope.offlineitems = [];
	$scope.firstwelcome = User.checkFirstTimeUser();
	$scope.statuses = ['OK', 'Help', 'Emergency', 'Undefined'];
	$scope.statusOptions= [
		{name: 'OK', color: '#468847'},
		{name: 'Help', color: '#c09853'},
		{name: 'Emergency', color: '#b94a48'},
		{name: 'Undefined', color: ''}
	];

	$scope.selectedStatus = $scope.statusOptions.filter(function(option) {
		return option.name === User.getStatus();
	})[0];

	$scope.setStatus = function () {
		var statusData = {
			statusUpdatedAt: Date.now(),
			statusCode: $scope.selectedStatus.name
		};
		$scope.userStatus = $scope.selectedStatus.name;
		$scope.userStatusLastUpdateTime = Date.now();
		Status.update($scope.username, statusData)
		.success(function(data) {
			User.setStatus($scope.selectedStatus.name);
		})
		.error(function(data) {

		});
	};
	$scope.directory = function () {
		$scope.onlineitems = [];
		$scope.offlineitems = [];
		JoinCommunity.allUsers()
		.success(function(users) {
			User.setUsers(users);
			// Filter the current user
			var usersWithoutCurrentUser = users.filter(function(user){
				return (user.username != $scope.username);
			});
			// Filter online users
			$scope.onlineitems = usersWithoutCurrentUser.filter(function(user){
				return user.isOnline == true;
			});
			$scope.offlineitems = usersWithoutCurrentUser.filter(function(user){
				return user.isOnline == false;
			});
			console.log($scope.onlineitems);
			console.log($scope.offlineitems);
		})
		.error(function(data) {

		});
	};
	Socket.on('CHAT', function(data) {
		console.log('messages: ' + JSON.stringify(data));
		Message.addToMessageQueue(data.sender);
		$scope.badgeCount = Message.getBadgeCount();
		if ((data.sender !== $scope.username) && $state.$current.url.sourcePath !== '/lobby/chatbuddies') {
			if (confirm("You have a new message from "+data.sender + ". Go to chat?") == true) {
	 			$state.go('chat',{ username: data.sender });
	    	}
		}
	});
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
	$scope.badgeCount = Message.getBadgeCount();

	$scope.getPresentableTime = function(timestamp) {
		var date = new Date(Number(timestamp));
		var dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
		return dateString;
	};
	$scope.resetFirstTimeUser = function() {
		User.resetFirstTimeUser();
	};
	$scope.directory();
});
