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
        post : function(access_key) {
            return $http.post('/maintenance?access_key=' + access_key);
        },
        delete : function(access_key) {
            return $http.delete('/maintenance?access_key=' + access_key);
        },
        postWallMessage : function(username, access_key, data) {
            var canceller = $q.defer();
            pendingRequests.add({canceller: canceller, type: 'post'});
            var requestPromise = $http.post('/messages/' + username + '?access_key=' + access_key, data, {timeout : canceller.promise});
            requestPromise.finally(function() {
                canceller.resolve();
            });
            return requestPromise;
        },
        getAllWallMessages : function(username, access_key) {
            var canceller = $q.defer();
            pendingRequests.add({canceller: canceller, type: 'get'});
            var requestPromise =  $http.get('/messages?messageType=WALL&access_key=' + access_key, {timeout : canceller.promise});
            requestPromise.finally(function() {
                canceller.resolve();
            });
            return requestPromise;
        },
        abort : function() {
            pendingRequests.cancelAll();
        },
        register : function(username, access_key, registrationData) {
            return $http.post('/signup/' + username + '?access_key=' + access_key, registrationData);
        }
    };
});