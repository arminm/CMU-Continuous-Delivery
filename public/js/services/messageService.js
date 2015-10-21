angular.module('MessageService', [])
.service('Message', function () {

    this.getCount = function(username) {
        return this.username;
    };

    this.addToMessageQueue = function(username) {
        if (this.messageQueue[username] == undefined){
            this.messageQueue[username] = 1;
        } else {
            ++this.messageQueue[username];
        }
        ++this.badgeCount;
    };

    this.clearQueueForUser = function(username) {
        if (this.messageQueue[username] != undefined){
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
            post : function(username, data) {
                return $http.post('/messages/' + username, data);
            },
            getAll : function(messageType) {
                return $http.get('/messages?messageType=' + messageType);
            },
            getAllPrivate : function(messageType, sender, receiver) {
                return $http.get('/messages?messageType=' + messageType + '&sender=' + sender + '&receiver=' + receiver);
            },
            get : function(id) {
                return $http.get('/messages/' + id);
            }
        }
    });