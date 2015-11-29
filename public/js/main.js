var app = angular.module('myApp',['ui.router', 'ngMessages', 'ui.bootstrap', 'MainService', 'UserService', 'socketService', 'MessageService', 'StatusService', 'MaintenanceService']);

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
            templateUrl: 'partials/lobby-message.jade'
        })
        .state('announcements', {
            url: '/lobby/announcements',
            templateUrl: 'partials/lobby-announcements.jade'
        })
        .state('chat', {
            url: '/lobby/chatbuddies?username',
            templateUrl: 'partials/lobby-message.jade'
        })
        .state('maintenance', {
            url: '/maintenance',
            templateUrl: 'partials/performance.jade'
        })
});

app.directive('serverError', function (){ 
 return {
    scope: false,
    link: function(scope, elem, attr) {
        elem.bind('keyup', function () {
            if (elem[0].id == 'password') {
                scope.loginForm.password.$setValidity('server', true);
                scope.formError.password = '';
            } else if (elem[0].id == 'username') {
                scope.loginForm.username.$setValidity('server', true);
                scope.formError.username = '';
            }
            scope.loginForm.$setValidity('server', true);
            scope.formError.generic = '';
            scope.$apply();
        });
    }
 };
});

app.directive('regExpRequire', function() {
    var regexp;
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            regexp = eval(attrs.regExpRequire);
            var char;
            elem.on('keypress', function(event) {
                var key = event.which;
                // Do not prevent backspace or del
                if ((key != 8) && (key != 46)) {
                    char = String.fromCharCode(key)
                    if(!regexp.test(elem.val() + char)) {
                        event.preventDefault();
                    }
                }
            });
        }
    }
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

    $scope.disburseSocketMessage = function(data, type) {
        console.log('message: ' + JSON.stringify(data));
        if ((User.getUsername().length > 0) && (data.action === 'created')) {
            MessageFactory.get(data.id)
            .success(function(message, status, headers, config) {
                $scope.$broadcast('new message', message, type);
            })
            .error(function(data, status, headers, config) {
                // Cannot do anything here 
            });
        }
    };
    $scope.initializeSockets = function() {
        Socket.on('ANNOUNCEMENTS', function(data) {
            $scope.disburseSocketMessage(data, 'ANNOUNCEMENTS');
        });

        Socket.on('WALL', function(data) {
            $scope.disburseSocketMessage(data, 'WALL');
        });

        Socket.on('CHAT', function(data) {
            if ((User.getUsername().length > 0) && ($state.$current.url.sourcePath != '/lobby/chatbuddies')) { // If the user is logged in or the user state is present
                if (data.sender !== User.getUsername()) {
                    if (confirm("You have a new message from "+ data.sender + ". Go to chat?") == true) {
                        $state.go('chat',{ username: data.sender });
                    }
                }
            } else {
                $scope.disburseSocketMessage(data, 'CHAT');
            }
        });
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
