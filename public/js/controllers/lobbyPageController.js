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
	$scope.resetFirstTimeUser = function() {
		User.resetFirstTimeUser();
	};

    Socket.on('CHAT', function(data) {
        if ($state.$current.url.sourcePath != '/lobby/chatbuddies') { // If the user is logged in or the user state is present
            if (data.sender !== User.getUsername()) {
                if (confirm("You have a new message from "+ data.sender + ". Go to chat?") == true) {
                    $state.go('chat',{ username: data.sender });
                }
            }
        }
    });
});
