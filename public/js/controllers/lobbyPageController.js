angular.module('myApp')
.controller('lobbyPageController', function($scope, $location, JoinCommunity, User) {
	$scope.username = User.getUsername();
	$scope.oneAtATime = true;
	$scope.onlineitems = ['onlineUser 1', 'onlineUser 2', 'onlineUser 3'];
	$scope.offlineitems = ['offlineUser 1', 'offlineUser 2', 'offlineUser 3'];
	$scope.firstwelcome = User.checkFirstTimeUser();
	$scope.seedirectory = false;
	$scope.seelobby = false;
	$scope.seesettings = false;
	$scope.closewelcome = function () {
		$scope.firstwelcome = false;
	};
	$scope.tabDirectory = function () {
		$scope.seedirectory = true;
		$scope.seelobby = false;
		$scope.seesettings = false;
	};
	$scope.tabLobby = function () {
		$scope.seedirectory = false;
		$scope.seelobby = true;
		$scope.seesettings = false;
	};
	$scope.tabSettings = function () {
		$scope.seedirectory = false;
		$scope.seelobby = false;
		$scope.seesettings = true;
	};
	$scope.logout = function () {
		JoinCommunity.logout($scope.username)
		.success(function(data, status, headers, config) {
			$location.path('/');
		})
		.error(function(data, status, headers, config) {
			if (status == '400') {
				$scope.formError.generic = "The user is not logged out";
			} else {
				$scope.formError.generic = "Something went wrong. Please try again.";
			}
		});
	};
});

