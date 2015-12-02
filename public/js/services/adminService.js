angular.module('AdminService', [])
.factory('Admin', function($http) {
    return {
        getUsers : function(access_key) {
            return $http.get('/users?access_key=' + access_key);
        },
        updateUser : function(username, access_key, data) {
            return $http.put('/users/' + username + '?access_key=' + access_key, data);
        }
    };
});