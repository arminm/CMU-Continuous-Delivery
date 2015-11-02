angular.module('myApp')
.controller('maintenanceController', function($scope, $location, $state, User, MaintenanceFactory) {
	$scope.duration = null;
	$scope.testMode = false;
	$scope.resultMode = false;
	$scope.start = function() {
		MaintenanceFactory.post($scope.username)
		.success(function(data) {
			console.log(data);
			$scope.test();
		})
		.error(function(data) {
			console.log(data);
		});
	};
	$scope.test = function() {
		$scope.testMode = true;
		$scope.resultMode = false;
	};
	$scope.abort = function() {
		$scope.testMode = false;
		$scope.resultMode = true;
	};
	$scope.stop = function() {
		MaintenanceFactory.delete($scope.username)
		.success(function(data) {
			$scope.abort();
		})
		.error(function(data) {
			console.log(data);
		});

	};
});
