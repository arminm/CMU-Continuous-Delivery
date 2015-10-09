var app = angular.module('myApp',['ngRoute', 'ngMessages', 'ui.bootstrap', 'mainService', 'socketService']);

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