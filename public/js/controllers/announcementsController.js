angular.module('myApp')
.controller('announcementsController', function($scope, $location, JoinCommunity, User, Message, MessageFactory, Socket) {
	$scope.announcements = [];
	$scope.title = "Announcements";
	$scope.getAllAnnouncements = function () {
		MessageFactory.getAll('ANNOUNCEMENTS')
		.success(function(data, status, headers, config) {
			$scope.announcements = data;
			console.log(data);
		})
		.error(function(data, status, headers, config) {
			$scope.formError.generic = "Something went wrong. Please try again.";
		});
	};

	$scope.status = function(username) {
		return User.getUser(username);
	};
	
	$scope.post = function() {
		var messageData= {
			target: null,
			content: $scope.announcementInput,
			messageType: 'ANNOUNCEMENTS',
			postedAt: Date.now()
		};
		MessageFactory.post(User.getUsername(),messageData)
		.success(function(data, status, headers, config) {
			if (status == '201') {
				$scope.announcementInput = '';
			}
		})
		.error(function(data, status, headers, config) {
			// TODO 
			$scope.formError.generic = "Something went wrong. Please try again.";
		});
	};
	$scope.getAllAnnouncements();
	Socket.on('ANNOUNCEMENTS', function(data) {
		console.log('announcements: ' + JSON.stringify(data));
		if (data.action === 'created') {
			MessageFactory.get(data.id)
			.success(function(data, status, headers, config) {
				$scope.announcements.push(data);
			})
			.error(function(data, status, headers, config) {
				// TODO 
			});
		}
	});
});