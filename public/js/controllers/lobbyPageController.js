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
		var oldStatus = $scope.statusOptions.filter(function(option) {
			return option.name === $scope.userStatus;
		})[0];
		Status.update($scope.username, statusData)
		.success(function(data) {
			User.setStatus($scope.selectedStatus.name);
			$scope.userStatus = $scope.selectedStatus.name;
			$scope.userStatusLastUpdateTime = Date.now();
		})
		.error(function(data) {
			$scope.selectedStatus = oldStatus;
		});
	};
	$scope.directory = function () {
		$scope.onlineitems = [];
		$scope.offlineitems = [];
		JoinCommunity.allUsers($scope.username)
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
			var statusMatch = item.statusCode.toLowerCase().indexOf(criteria) > -1;
			var usernameMatch = item.username.toLowerCase().indexOf(criteria) > -1;
			return  usernameMatch || statusMatch;
		}
	};

	$scope.findRole = function () {
		var privilegeLevel = User.getPrivilegeLevel();
		switch (privilegeLevel) {
			case 'Coordinator':
				$scope.isAdmin = false;
				$scope.isMonitor = false;
				$scope.isCoordinator = true;
				break;
			case 'Monitor':
				$scope.isAdmin = false;
				$scope.isMonitor = true;
				$scope.isCoordinator = false;
				break;
			case 'Administrator':
				$scope.isAdmin = true;
				$scope.isMonitor = true;
				$scope.isCoordinator = true;
				break;
		}
	};
});
