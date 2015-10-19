angular.module('myApp')
.controller('lobbyPageController', function($scope, $location, JoinCommunity, User, Message, Socket) {
	$scope.username = User.getUsername();
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
		User.setStatus($scope.selectedStatus.name);
	};
	$scope.directory = function () {
		$scope.onlineitems = [];
		$scope.offlineitems = [];
		JoinCommunity.allUsers()
		.success(function(users) {
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
		})
		.error(function(data) {

		});
	};

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
});
