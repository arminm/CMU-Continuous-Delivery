angular.module('myApp')
.controller('messagesController', function($scope, $stateParams, $state, User, Message, MessageFactory, Socket) {
	$scope.buddy = null;
	$scope.username = User.getUsername();
	$scope.messages = [];
	$scope.limitResults = 1000000;
	$scope.filteredParam = [];
	$scope.descending = false;
	$scope.searchIsActive = false;
	$scope.searchMode = false;
	$scope.stopWords = ['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 'either', 'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'he', 'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'least', 'let', 'like', 'likely', 'may', 'me', 'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off', 'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say', 'says', 'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to', 'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet', 'you', 'your'];
	switch ($state.$current.url.sourcePath) {
		case '/lobby/announcements':
			$scope.title = "Announcements";
			$scope.messageType = 'ANNOUNCEMENTS';
			break;
		case '/lobby/chatbuddies':
			$scope.messageType = 'CHAT';
			$scope.title = "To: " + $stateParams.username;
			$scope.buddy = $stateParams.username;
			break;
		case '/lobby/wall':
			$scope.messageType = 'WALL';
			$scope.title = "Wall";
			break;
	}

	$scope.getAllMessages = function () {
		MessageFactory.getAll($scope.messageType, User.getUsername(), $scope.buddy)
		.success(function(data, status, headers, config) {
			$scope.messages = data;
			scrollToBottom(false, '#scrollingMessages');
		})
		.error(function(data, status, headers, config) {
			$scope.formError.generic = "Something went wrong. Please try again.";
		});
	};

	$scope.status = function(username) {
		return User.getStatus(username);
	};
	
	$scope.post = function() {
		var messageData= {
			target: $scope.buddy,
			content: $scope.messageInput,
			messageType: $scope.messageType,
			postedAt: Date.now()
		};
		MessageFactory.post($scope.username,messageData)
		.success(function(data, status, headers, config) {
			$scope.messageInput = '';
		})
		.error(function(data, status, headers, config) {
			// TODO 
			$scope.formError.generic = "Something went wrong. Please try again.";
		});
	};

	$scope.showSearch = function() {
		$scope.searchIsActive = true;
	}

	$scope.clear = function() {
		$scope.searchMode = false;
		$scope.getAllMessages();
		$scope.limitResults = 1000000;
		$scope.searchString = '';
		$scope.filteredParam = [];
		$scope.descending = false;
		$scope.searchIsActive = false;
	};

	$scope.filterMessages = function(criteria) {
		return function(msg) {
			if (criteria.length === 0) {
				return true;
			}
			var contents = msg.content.toLowerCase().split(/[^A-Za-z0-9]/);	
			for (var j = 0; j < contents.length; j++) {
				if (criteria.indexOf(contents[j]) > -1) {
					return true;
				}
			}
			return false;
		}
	};

	$scope.search = function(param) {
		if (param !== '') {
			$scope.searchMode = true;
			var params = param.toLowerCase().split(/[^A-Za-z0-9]/);
			$scope.filteredParam = [];
			for (var i = 0; i < params.length; i++) {
				if ($scope.stopWords.indexOf(params[i]) === -1) {
					$scope.filteredParam.push(params[i]);
				}
			}
			if ($scope.limitResults === 1000000) {
				$scope.descending = true;
				$scope.limitResults = 10;
			}
			$scope.$apply();
		} else {
			$scope.searchMode = false;
			$scope.filteredParam = [];
			$scope.getAllMessages();
			$scope.limitResults = 1000000;
			$scope.descending = false;
		}
	};

	$scope.showMoreResults = function() {
		$scope.limitResults += 10;
	};

	$scope.$on('new message', function(event, message, type) {
		if (type === $scope.messageType) {
			$scope.messages.push(message);
			scrollToBottom(true, '#scrollingMessages');
		}
	});
	$scope.getAllMessages();
});