angular.module('MaintenanceService', [])
.service('pendingRequests', function () {
    var pending = [];
    this.get = function() {
        return pending;
    };
    this.add = function(request) {
        pending.push(request);
    };
    this.cancelAll = function() {
        angular.forEach(pending, function(p) {
          p.canceller.resolve();
        });
        pending.length = 0;
    };

})
.factory('MaintenanceFactory', function($http, $q, pendingRequests) {
    return {
        post : function(username) {
            return $http.post('/maintenance?access_key=' + username);
        },
        delete : function(username) {
            return $http.delete('/maintenance?access_key=' + username);
        },
        postWallMessage : function(username, data) {
            var canceller = $q.defer();
            pendingRequests.add({canceller: canceller});
            var requestPromise = $http.post('/messages/' + username + '?access_key=' + username, data, {timeout : canceller.promise});
            requestPromise.finally(function() {
                canceller.resolve();
            });
            return requestPromise;
        },
        getAllWallMessages : function(username) {
            var canceller = $q.defer();
            var requestPromise =  $http.get('/messages?messageType=WALL&access_key=' + username, {timeout : canceller.promise});
            requestPromise.finally(function() {
                canceller.resolve();
            });
            return requestPromise;
        },
        abort : function() {
            pendingRequests.cancelAll();
        }
    }
});