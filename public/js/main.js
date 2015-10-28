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

app.controller('mainController', function($scope, $rootScope, $location, $state, User, JoinCommunity, Socket, MessageFactory) {
    $scope.logout = function () {
        // When the user opts to logout, take them to home page and clear user data regardless the call's status
        JoinCommunity.logout(User.getUsername())
        .success(function(data, status, headers, config) {  
        })
        .error(function(data, status, headers, config) {
        });
        $location.path('/');
        User.reset();
        Socket.removeAllListeners('CHAT');
        Socket.removeAllListeners('ANNOUNCEMENTS');
        Socket.removeAllListeners('WALL');
    };
    
    $scope.getPresentableTime = function(timestamp) {
        var date = new Date(Number(timestamp));
        var dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        return dateString;
    };

});

function scrollToBottom(animated, id) {
    if ($(id)[0] != undefined) {  
        if (animated) {
            $(id).animate({ scrollTop: $(id)[0].scrollHeight}, 1000);
        } else {
            $(id).scrollTop($(id)[0].scrollHeight);
        }
    }
}
