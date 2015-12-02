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
		{name: 'HELP', color: '#c09853'},
		{name: 'EMERGENCY', color: '#b94a48'},
		{name: 'UNDEFINED', color: ''}
	];
	$scope.searchIsActive = false;
	$scope.searchText = '';
	$scope.searchString = '';

	$scope.selectedStatus = $scope.statusOptions.filter(function(option) {
		return option.name === User.getStatus().toUpperCase();
	})[0];

	$scope.setStatus = function () {
		var statusData = {
			statusUpdatedAt: Date.now(),
			statusCode: $scope.selectedStatus.name
		};
		var oldStatus = $scope.statusOptions.filter(function(option) {
			return option.name === $scope.userStatus.toUpperCase();
		})[0];
		Status.update($scope.username, statusData)
		.success(function(data) {
			User.setStatus($scope.selectedStatus.name);
			$scope.userStatus = $scope.selectedStatus.name;
			$scope.userStatusLastUpdateTime = Date.now();
		})
		.error(function(data, status, headers, config) {
			$scope.selectedStatus = oldStatus;
			$scope.translate(["ERROR_GENERIC"]).then(function (translations) {
				alert(translations.ERROR_GENERIC);
			});
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
		})
		.error(function(data, status, headers, config) {
			$scope.translate(["ERROR_UNAUTHORIZED", "ERROR_NO_USERS_FOUND", 
				"ERROR_GENERIC"]).then(function (translations) {
				if (status == '403') {
					alert(translations.ERROR_UNAUTHORIZED);
				} else if (status == '404') {
					alert(translations.ERROR_NO_USERS_FOUND);
				} else {
					alert(translations.ERROR_GENERIC);
				}
			});
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
});
