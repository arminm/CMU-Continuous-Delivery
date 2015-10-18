angular.module('MessageService', []).factory('Message', function($http) {
        return {
            post : function(username, data) {
                return $http.post('/messages/' + username, data);
            },
            getAll : function(messageType) {
                return $http({method: 'GET', url:'/messages', params:{messageType: messageType}});
            },
            get : function(id) {
                return $http.get('/messages/' + id);
            },
            postAnnouncement : function(username, data) {
                return $http.post('/messages/' + username, data);
            }
        }
    });