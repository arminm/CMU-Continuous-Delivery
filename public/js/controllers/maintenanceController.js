angular.module('myApp')
.controller('maintenanceController', function($scope, $interval, $location, $state, User, MaintenanceFactory) {
	$scope.duration = null;
	$scope.testMode = false;
	$scope.resultMode = false;
	$scope.username = User.getUsername();
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
		// $scope.makeRequests();
	};
	$scope.abort = function() {
		$scope.testMode = false;
		$scope.resultMode = true;
		$scope.stopTimer();
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

	$scope.makeRequests = function() {
		var messageData = {
	        target: null,
	        // The below message is exactly 20 characters long
	        content: '20 character message',
	        messageType: 'WALL',
	        postedAt: Date.now()
	    };
    	do {
    		MaintenanceFactory.postWallMessage($scope.username, messageData)
    		.success(function(data) {
			})
			.error(function(data) {
				$scope.stop();
			});
			MaintenanceFactory.getAllWallMessages($scope.username)
    		.success(function(data) {
			})
			.error(function(data) {
				$scope.stop();
			});
		}
		while ($scope.testMode);
    };

    var stopper;
    $scope.startTimer = function() {
      // Don't start a new timer if we are already running one
      if ( angular.isDefined(stopper) ) return;
      $scope.elapsedTime = $scope.duration;
      stopper = $interval(function() {
        if ($scope.elapsedTime > 0) {
          $scope.elapsedTime--;
        } else {
          $scope.stop();
        }
      }, 1000);
    };

    $scope.stopTimer = function() {
      if (angular.isDefined(stopper)) {
        $interval.cancel(stopper);
        stopper = undefined;
      }
    };
});
