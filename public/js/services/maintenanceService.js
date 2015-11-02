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
            }
        }
    });