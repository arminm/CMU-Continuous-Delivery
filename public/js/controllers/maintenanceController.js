angular.module('myApp')
.controller('maintenanceController', function($scope, $interval, $location, $state, User, MaintenanceFactory) {
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
		$scope.startTimer();
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

    var stop;
    $scope.startTimer = function() {
      // Don't start a new timer if we are already running one
      if ( angular.isDefined(stop) ) return;
      $scope.elapsedTime = $scope.duration;
      stop = $interval(function() {
        if ($scope.elapsedTime > 0) {
          $scope.elapsedTime--;
        } else {
          $scope.stopTimer();
        }
      }, 1000);
    };

    $scope.stopTimer = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };
});
