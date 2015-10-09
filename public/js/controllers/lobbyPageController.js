angular.module('myApp')
.controller('lobbyPageController', function($scope, $location, JoinCommunity, User, Message, Socket) {
	$scope.username = User.getUsername();
	$scope.oneAtATime = true;
	$scope.onlineitems = [];
	$scope.offlineitems = [];
	$scope.messages = [];
	$scope.firstwelcome = User.checkFirstTimeUser();
	$scope.seedirectory = false;
	$scope.seelobby = !$scope.firstwelcome;
	$scope.seesettings = false;
	$scope.closewelcome = function () {
		$scope.firstwelcome = false;
		$scope.seelobby = true;
	};
	$scope.tabLobby = function () {
		$scope.seedirectory = false;
		$scope.seelobby = true;
		$scope.seesettings = false;
	};
	$scope.tabSettings = function () {
		$scope.seedirectory = false;
		$scope.seelobby = false;
		$scope.seesettings = true;
	};
	$scope.directory = function () {
		$scope.onlineitems = [];
		$scope.offlineitems = [];
		$scope.seedirectory = true;
		$scope.seelobby = false;
		$scope.seesettings = false;
		JoinCommunity.allUsers()
		.success(function(users) {
			// Filter the current user
			var usersWithoutCurrentUser = users.filter(function(user){
				return (user.username != $scope.username);
			});
			// Filter online users
			$scope.onlineitems = usersWithoutCurrentUser.filter(function(user){
				return user.isOnline == true;
			});
			$scope.offlineitems = usersWithoutCurrentUser.filter(function(user){
				return user.isOnline == false;
			});
			console.log(users);
		})
		.error(function(data) {

		});
	};
	$scope.logout = function () {
		JoinCommunity.logout(User.getUsername())
		.success(function(data, status, headers, config) {
			$location.path('/');
		})
		.error(function(data, status, headers, config) {
			if (status == '400') {
				$scope.formError.generic = "The user is not logged out";
			} else {
				$scope.formError.generic = "Something went wrong. Please try again.";
			}
		});
	};
	$scope.getAllMessages = function () {
		Message.getAll('WALL')
		.success(function(data, status, headers, config) {
			$scope.messages = data;
		})
		.error(function(data, status, headers, config) {
			if (status == '400') {
				$scope.formError.generic = "The user is not logged out";
			} else {
				$scope.formError.generic = "Something went wrong. Please try again.";
			}
		});
	};
	$scope.send = function() {
		var messageData= {
			content: $scope.messageInput,
			messageType: "WALL",
			postedAt: Date.now()
		};
		Message.post(User.getUsername(),messageData)
		.success(function(data, status, headers, config) {
			if (status == '201') {
				$scope.messageInput = '';
			}
			
		})
		.error(function(data, status, headers, config) {
			// TODO 
			if (status == '404') {
				$scope.formError.generic = "The username doesn't exist";
			} else {
				$scope.formError.generic = "Something went wrong. Please try again.";
			}
		});
	};
	$scope.getAllMessages();
	Socket.on('messages', function(data) {
		console.log('messages: ' + JSON.stringify(data));
		if (data.action === 'created') {
			Message.get(data.id)
			.success(function(data, status, headers, config) {
				if (status == '200') {
					$scope.messages.push(data);
				}
			})
			.error(function(data, status, headers, config) {
				// TODO 
			});
		}
	});
	$scope.getPresentableTime = function(timestamp) {
		var date = new Date(Number(timestamp));
		var dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
		return dateString;
	};

});

