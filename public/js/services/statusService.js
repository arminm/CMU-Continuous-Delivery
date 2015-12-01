 angular.module('StatusService', []).factory('Status', function($http) {
        return {
            update : function(username, data) {
                return $http.post('/status/' + username, data);
            }
        }
    });