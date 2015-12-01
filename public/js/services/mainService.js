angular.module('MainService', []).factory('JoinCommunity', function($http) {
        return {
            login : function(username, loginData) {
                return $http.post('/login/' + username, loginData);
            },
            register : function(username, registrationData) {
                return $http.post('/signup/' + username, registrationData);
            },
            allUsers : function(access_key) {
                return $http.get('/users?access_key=' + access_key);
            },
            logout : function(username) {
                return $http.post('/logout/' + username);
            }
        }
    });