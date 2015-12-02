angular.module('MessageService', [])
.service('Message', function () {

    this.getCount = function(username) {
        return this.username;
    };

    this.addToMessageQueue = function(username) {
        if (this.messageQueue[username] === undefined){
            this.messageQueue[username] = 1;
        } else {
            ++this.messageQueue[username];
        }
        ++this.badgeCount;
    };

    this.clearQueueForUser = function(username) {
        if (this.messageQueue[username] !== undefined){
            this.badgeCount -= this.messageQueue[username];
            this.messageQueue[username] = undefined;
        }
    };

    this.getBadgeCount = function() {
        return this.badgeCount;
    };

    this.reset = function() {
        this.badgeCount = 0;
        this.messageQueue = {};
    };

    this.reset();
})
.factory('MessageFactory', function($http) {
        return {
            post : function(username, data, access_key) {
                return $http.post('/messages/' + username + '?access_key=' + access_key, data);
            },
            getAll : function(messageType, sender, receiver, access_key) {
                if (receiver != null) {
                    return $http.get('/messages?messageType=' + messageType + '&sender=' + sender + '&receiver=' + receiver + '&access_key=' + access_key);
                } else {
                    return $http.get('/messages?messageType=' + messageType + '&access_key=' + access_key);
                }

            },
            get : function(id, access_key) {
                return $http.get('/messages/' + id + '?access_key=' + access_key);
            }
        };
    });