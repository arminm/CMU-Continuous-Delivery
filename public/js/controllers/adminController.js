angular.module('myApp')
.controller('adminController', function ($scope, $translate, User, JoinCommunity, Admin) {
	$scope.username = User.getUsername();
	$scope.title = "ADMIN_PANEL";
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
			$scope.users = users;
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
					$scope.formError.generic = "ERROR_BAD_REQUEST";
				} else if (status == '401') {
                	$scope.formError.generic = "ERROR_NOT_AN_ADMIN";
            	} else if (status == '403') {
                	$scope.formError.generic = "ERROR_USERNAME_TAKEN";
            	} else if (status == '404') {
                	$scope.formError.generic = "ERROR_ACCESS_KEY";
            	} else {
            		$scope.formError.generic = "ERROR_GENERIC";
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
