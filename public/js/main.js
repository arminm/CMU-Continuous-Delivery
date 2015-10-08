var app = angular.module('myApp',['ngRoute', 'ngMessages', 'ui.bootstrap']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/lobby', {
        templateUrl: 'partials/lobby.jade'
      }).
      when('/', {
        templateUrl: 'partials/index.jade'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);