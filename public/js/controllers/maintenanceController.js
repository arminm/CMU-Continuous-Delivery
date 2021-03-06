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
      .error(function(data, status, headers, config) {
        $scope.translate(["ERROR_WRONG_CREDENTIALS", "ERROR_UNAUTHORIZED",
          "ERROR_GENERIC"]).then(function (translations) {
          if (status == '401') {
            alert(translations.ERROR_WRONG_CREDENTIALS);
          } else if (status == '403') {
            alert(translations.ERROR_UNAUTHORIZED);
          } else {
            alert(translations.ERROR_GENERIC);
          }
        });
      });
    })
    .error(function(data, status, headers, config) {
      $scope.translate(["ERROR_NO_PERMISSION_FOR_PERFOMANCE_TEST", "ERROR_NO_MATCHING_USER",
        "ERROR_GENERIC"]).then(function (translations) {
        if (status == '401') {
          alert(translations.ERROR_NO_PERMISSION_FOR_PERFOMANCE_TEST);
        } else if (status == '404') {
          alert(translations.ERROR_NO_MATCHING_USER);
        } else {
          alert(translations.ERROR_GENERIC);
        }
      });
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
    $scope.stopRequest();
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
      if (($scope.totalSuccessfulPosts + $scope.totalUnsuccessfulPosts) < $scope.limit) {
        if ($scope.totalCalls < $scope.limit) {        
          $scope.totalCalls++;
          MaintenanceFactory.postWallMessage($scope.username, $scope.access_key, messageData)
          .success(function() {
            if($scope.testMode) $scope.totalSuccessfulPosts++;
          })
          .error(function() {
            if($scope.testMode) $scope.totalUnsuccessfulPosts++;
          });
          MaintenanceFactory.getAllWallMessages($scope.username, $scope.access_key)
          .success(function() {
            if($scope.testMode) $scope.totalSuccessfulGets++;
          })
          .error(function() {
            if($scope.testMode) $scope.totalUnsuccessfulGets++;
          });
        }
      } else {
        $scope.stop();
      }
    }, 0);
  };

  $scope.startTimer = function() {
    // Don't start a new timer if we are already running one
    if (angular.isDefined(timer)) return;
    $scope.elapsedTime = 0;
    timer = $interval(function() {
      if ($scope.elapsedTime < $scope.duration) {
        $scope.elapsedTime++;
      } else {
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
