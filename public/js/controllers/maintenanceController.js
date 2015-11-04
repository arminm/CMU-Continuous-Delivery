angular.module('myApp')
.controller('maintenanceController', function($scope, $interval, $timeout, $location, $state, User, MaintenanceFactory) {
	$scope.duration = null;
	$scope.testMode = false;
	$scope.resultMode = false;
  $scope.username = "dummy";
	$scope.access_key = User.getUsername();
  $scope.limit = 1000;
  $scope.totalCalls = 0;
  $scope.totalSuccessfulGets = 0;
  $scope.totalUnsuccessfulGets = 0;
  $scope.totalSuccessfulPosts = 0;
  $scope.totalUnsuccessfulPosts = 0;
  var requestPromise;
  var timer;

	$scope.start = function() {
    $scope.totalCalls = 0;
    $scope.totalSuccessfulGets = 0;
    $scope.totalUnsuccessfulGets = 0;
    $scope.totalSuccessfulPosts = 0;
    $scope.totalUnsuccessfulPosts = 0;
		MaintenanceFactory.post($scope.access_key)
    .success(function(data) {
      var registerData = {
        password: '1111',
        fullName: '',
        createdAt: Date.now()
      };
      MaintenanceFactory.register($scope.username, $scope.access_key, registerData)
      .success(function(data) {
        $scope.test();
      })
      .error(function(data) {
      });
    })
    .error(function(data) {
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
		$scope.stopTimer();
	};

	$scope.stop = function() {
		var stopPromise = MaintenanceFactory.delete($scope.access_key);
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
      if ($scope.totalCalls <= $scope.limit) {
        $scope.totalCalls += 2;
        MaintenanceFactory.postWallMessage($scope.username, $scope.access_key, messageData)
        .success(function() {
          $scope.totalSuccessfulPosts++;
        })
        .error(function() {
          $scope.totalUnsuccessfulPosts++;
        });
        MaintenanceFactory.getAllWallMessages($scope.username, $scope.access_key)
        .success(function() {
          $scope.totalSuccessfulGets++;
        })
        .error(function() {
          $scope.totalUnsuccessfulGets++;
        });
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
