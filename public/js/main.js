var app = angular.module('myApp',['ui.router', 'ngMessages', 'ui.bootstrap', 'MainService', 'UserService', 'socketService', 'MessageService', 'StatusService']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/index.jade'
        })
        .state('lobby', {
            url: '/lobby',
            templateUrl: 'partials/lobby.jade'
        })
        .state('wall', {
            url: '/lobby/wall',
            templateUrl: 'partials/lobby-wall.jade'
        })
        .state('announcements', {
            url: '/lobby/announcements',
            templateUrl: 'partials/lobby-announcements.jade'
        })
        .state('chat', {
            url: '/lobby/chatbuddies?username',
            templateUrl: 'partials/lobby-chatbuddies.jade'
        })
});

app.directive('serverError', function (){ 
 return {
    require: '?ngModel',
    link: function(scope, elem, attr, ngModel) {
        elem.bind('keyup change', function () {
          ngModel.$setValidity('server', true);
          scope.formError.generic = '';
        });
    }
 };
});

app.controller('mainController', function($scope, $location, $state, User, JoinCommunity, Socket, MessageFactory) {
    $scope.logout = function () {
        // When the user opts to logout, take them to home page and clear user data regardless the call's status
        JoinCommunity.logout(User.getUsername())
        .success(function(data, status, headers, config) {  
        })
        .error(function(data, status, headers, config) {
        });
        $location.path('/');
        User.reset();
    };
    
    $scope.getPresentableTime = function(timestamp) {
        var date = new Date(Number(timestamp));
        var dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        return dateString;
    };

    Socket.on('CHAT', function(data) {
        console.log($state);
        console.log($state.$current);
        if (User.getUsername().length > 0) { // If the user is logged in or the user state is present
            if ($state.$current.url.sourcePath == '/lobby/chatbuddies') {
                if (data.action === 'created') {
                    MessageFactory.get(data.id)
                    .success(function(data, status, headers, config) {
                        if (status == '200') {
                            $state.$current.messages.push(data);
                            scrollToBottom(true, '#scrollingMessages');
                        }
                    })
                    .error(function(data, status, headers, config) {
                        // TODO 
                    });
                }
            } else if (data.sender !== $scope.username) {
                if (confirm("You have a new message from "+data.sender + ". Go to chat?") == true) {
                    $state.go('chat',{ username: data.sender });
                }
            }
        }
    });
});

function scrollToBottom(animated, id) {
  if (animated) {
    $(id).animate({ scrollTop: $(id)[0].scrollHeight}, 1000);
  } else {
    $(id).scrollTop($(id)[0].scrollHeight);
  }
}
