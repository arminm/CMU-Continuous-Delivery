var app = angular.module('myApp',['ngRoute', 'ngMessages', 'ui.bootstrap']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/lobby', {
        templateUrl: 'lobby.jade'
      }).
      when('/', {
        templateUrl: 'layout.jade',
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);