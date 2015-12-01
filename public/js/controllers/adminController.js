angular.module('myApp')
.controller('adminController', function ($scope, User, JoinCommunity, Admin) {
	$scope.username = User.getUsername();
	$scope.title = "Admin Panel";
	$scope.isAdmin = true;
	$scope.users = [];
	$scope.formData = {};
	$scope.selectedUser = undefined;
	$scope.availableAccountStatuses = ["ACTIVE", "INACTIVE"];
	$scope.availablePrivilegeLevels = ["ADMINISTRATOR", "CITIZEN", "COORDINATOR", "MONITOR"];
	$scope.formError = {
		generic: ''
	};

	$scope.getUsers = function () {
		Admin.getUsers($scope.username)
		.success(function(users) {
			$scope.users = users.filter(function(user) {
				return (user.username != $scope.username);
			});
		})
		.error(function(data, status, headers, config) {
			var message = "";
			if (status == '403') {
				message = "You don't have access to this resource";
			} else if (status == '404') {
                message = "No users found for your call";
            } else {
            	message = "Something went wrong. Please try again later.";
            }
            alert(message);
		});
	};

	$scope.administerProfile = function (user) {
		if ($scope.selectedUser === user) {
			$scope.resetScope();
		} else {
			$scope.selectedUser = user;
			$scope.formData.accountStatus = $scope.selectedAccountStatus = $scope.selectedUser.isActive ? "ACTIVE" : "INACTIVE";
			// TODO return role from object
			$scope.formData.privilegeLevel = $scope.selectedPrivilegeLevel = $scope.selectedUser.profile;
			$scope.formData.username = $scope.selectedUsername = $scope.selectedUser.username;
		}
	};

	$scope.saveChanges = function () {
		if ($scope.editForm.$valid) {
			var editData = {
				password: $scope.formData.password,
				username: $scope.selectedUsername
			};
			if ($scope.formData.accountStatus !== $scope.selectedAccountStatus) {
				editData.isActive = $scope.formData.accountStatus === "ACTIVE" ? 1 : 0;
			}
			if ($scope.formData.privilegeLevel !== $scope.selectedPrivilegeLevel) {
				editData.profile = $scope.formData.privilegeLevel;
			}
			if ($scope.formData.username !== $scope.selectedUsername) {
				editData.givenUsername = $scope.formData.username;
			}
			Admin.updateUser($scope.selectedUsername, $scope.username, editData)
			.success(function(users) {
				$scope.resetScope();
			})
			.error(function(data, status, headers, config) {
				$scope.editForm.$setValidity('server', false);
				if (status == '400') {
					$scope.formError.generic = "Bad request. An error happened while trying to update";
				} else if (status == '401') {
                	$scope.formError.generic = "You are not an administrator";
            	} else if (status == '403') {
                	$scope.formError.generic = "The username already exists. Please enter a different username";
            	} else if (status == '404') {
                	$scope.formError.generic = "No user found matching your access_key";
            	} else {
            		$scope.formError.generic = "Something went wrong. Please try again later.";
            	}
			});
		}
	};

	$scope.resetScope = function () {
		$scope.selectedUser = null;
		$scope.selectedAccountStatus = null;
		$scope.selectedPrivilegeLevel = null;
		$scope.formData = {};
		$scope.getUsers();
	};

	$scope.getUsers();
});
