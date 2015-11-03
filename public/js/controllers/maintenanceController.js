angular.module('myApp')
.controller('maintenanceController', function($scope, $interval, $timeout, $location, $state, User, MaintenanceFactory) {
	$scope.duration = null;
	$scope.testMode = false;
	$scope.resultMode = false;
	$scope.username = User.getUsername();

  var requestPromise;
  var timer;

	$scope.start = function() {
		var startPromise = MaintenanceFactory.post($scope.username);
		startPromise.then(
			function(payload) { 
        $scope.test();
      },
      function(errorPayload) {
      }
    );
	};

	$scope.test = function() {
		$scope.testMode = true;
		$scope.resultMode = false;
		$scope.startTimer();
	};

	$scope.abort = function() {
		$scope.testMode = false;
		$scope.resultMode = true;
		$scope.stopTimer();
	};

	$scope.stop = function() {
		var stopPromise = MaintenanceFactory.delete($scope.username);
		// stopPromise.then(
		// 	function(payload) { 
  // 		},
  // 		function(errorPayload) {
  // 		}
  //   );
    $scope.abort();
    MaintenanceFactory.abort();
	};

	$scope.makeRequests = function() {
    if (angular.isDefined(requestPromise)) return;
		var messageData = {
      target: null,
      // The below message is exactly 20 characters long
      content: '20 character message',
      messageType: 'WALL',
      postedAt: Date.now()
    };
    requestPromise = $interval(function() {
      if ($scope.testMode) {
        var promiseA = MaintenanceFactory.postWallMessage($scope.username, messageData);
        var promiseB = MaintenanceFactory.getAllWallMessages($scope.username);
      } else {
        $scope.stopRequest();
      }
		}, 0);
  };

  $scope.startTimer = function() {
    // Don't start a new timer if we are already running one
    if (angular.isDefined(timer)) return;
    $scope.elapsedTime = $scope.duration;
    timer = $interval(function() {
      if ($scope.elapsedTime > 0) {
        $scope.elapsedTime--;
      } else {
        $scope.stopRequest();
        $scope.stop();
      }
    }, 1000);
    $scope.makeRequests();
  };

  $scope.stopTimer = function() {
    if (angular.isDefined(timer)) {
      $interval.cancel(timer);
      timer = undefined;
    }
  };

  $scope.stopRequest = function() {
    if (angular.isDefined(requestPromise)) {
      $interval.cancel(requestPromise);
      requestPromise = undefined;
    }
  };
});
