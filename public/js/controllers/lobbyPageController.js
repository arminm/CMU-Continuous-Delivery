angular.module('myApp')
.controller('lobbyPageController', function($scope) {
	$scope.username = 'Mandy';
	$scope.oneAtATime = true;
    $scope.onlineitems = ['onlineUser 1', 'onlineUser 2', 'onlineUser 3'];
    $scope.offlineitems = ['offlineUser 1', 'offlineUser 2', 'offlineUser 3'];
    $scope.firstwelcome = true;
    $scope.closewelcome = function () {
      $scope.firstwelcome=false;
    };
 });

