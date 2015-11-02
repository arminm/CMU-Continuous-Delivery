angular.module('MaintenanceService', [])
.service('Maintenance', function () {


})
.factory('MaintenanceFactory', function($http) {
    return {
        post : function(username) {
            return $http.post('/maintenance?access_key=' + username);
        },
        delete : function(username) {
            return $http.delete('/maintenance?access_key=' + username);
        },
        postWallMessage : function(username, data) {
            return $http.post('/messages/' + username + '?access_key=' + username, data);
        },
        getAllWallMessages : function(username) {
            return $http.get('/messages?messageType=WALL&access_key=' + username);
        }
    }
});