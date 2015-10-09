angular.module('MainService', []).factory('JoinCommunity', function($http) {
        return {
            login : function(username, loginData) {
                return $http.post('/login/' + username, loginData);
            },
            register : function(username, registrationData) {
                return $http.post('/signup/' + username, registrationData);
            },
            allUsers : function() {
                return $http.get('/users');
            },
            logout : function(username) {
                return $http.get('/logout/' + username);
            }
        }
    });