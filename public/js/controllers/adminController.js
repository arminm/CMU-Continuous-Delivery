angular.module('myApp')
.controller('adminController', function ($scope, User, JoinCommunity, Admin) {
	$scope.username = User.getUsername();
	$scope.title = "Admin Panel";
	$scope.isAdmin = true;
	$scope.users = [];
	$scope.formData = {};
	$scope.selectedUser = undefined;
	$scope.availableAccountStatuses = ["Active", "Inactive"];
	$scope.availablePrivilegeLevels = ["Administrator", "Citizen", "Coordinator", "Monitor"];

	$scope.getUsers = function () {
		Admin.getUsers()
		.success(function(users) {
			$scope.users = users.filter(function(user) {
				return (user.username != $scope.username);
			});
		})
		.error(function(data) {
		});
	};

	$scope.administerProfile = function (user) {
		if ($scope.selectedUser === user) {
			$scope.resetScope();
		} else {
			$scope.selectedUser = user;
			$scope.formData.accountStatus = $scope.selectedUser.isActive ? "Active" : "Inactive";
			// TODO return role from object
			$scope.formData.privilegeLevel = "Citizen";
			$scope.formData.username = $scope.selectedUsername = $scope.selectedUser.username;
		}
		console.log($scope.selectedUser);
	};

	$scope.saveChanges = function () {
		if ($scope.editForm.$valid) {
			var editData = {
				accountStatus: $scope.formData.accountStatus,
				privilegeLevel: $scope.formData.privilegeLevel,
				username: $scope.formData.username,
				password: $scope.formData.password
			};
			Admin.updateUser($scope.selectedUsername, $scope.username, editData)
			.success(function(users) {
				$scope.resetScope();
			})
			.error(function(data) {
				// TODO 
				$scope.formError.generic = "Something went wrong. Please try again.";
			});
		}
	};

	$scope.resetScope = function () {
		$scope.selectedUser = null;
		$scope.selectedAccountStatus = null;
		$scope.selectedPrivilegeLevel = null;
		$scope.formData = {};
	};

	$scope.getUsers();
});