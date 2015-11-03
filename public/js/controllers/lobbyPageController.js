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
	$scope.searchIsActive = false;
	$scope.searchText = '';
	$scope.searchString = '';

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

	$scope.showSearch = function() {
		$scope.searchIsActive = true;
	};

	$scope.clear = function() {
		$scope.searchText = '';
		$scope.searchString = '';
		$scope.searchIsActive = false;
	};

	$scope.search = function(param) {
		if (param !== '') {
			var params = param.toLowerCase().split(/[^A-Za-z0-9]/);
			$scope.searchText = params[0];
			$scope.$apply();
		} else {
			$scope.searchText = '';
		}
	};

	$scope.filterUsers = function(criteria) {
		return function(item) {
			if (criteria.length === 0) {
				return true;
			}
			statuses = [];
			for (var i = 0; i < $scope.statuses.length; i++) {
				statuses.push($scope.statuses[i])
			}
			if (statuses.indexOf(criteria)) {
				// we are searching for status
				return item.statusCode.toLowerCase() === criteria;
			} else {
				// we are searching for username
				return item.username.indexOf(criteria) > -1;
			}
		}
	};
});
