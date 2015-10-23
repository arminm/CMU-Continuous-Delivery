angular.module('UserService', []).service('User', function () {

	this.getUsername = function() {
    return this.username;
  };

  this.getStatus = function() {
    return this.status;
  };

  this.getLastStatusUpdated= function() {
    return this.lastStatusUpdated;
  };

  this.setLastStatusUpdated= function(time) {
    this.lastStatusUpdated = time;
  };

  this.setUsername = function(username) {
    this.username = username;
  };

  this.setFirstTimeUser = function(value) {
    this.isFirstTimeUser = value;
  };

  this.setStatus = function(value) {
    this.status = value;
  };

  this.checkFirstTimeUser = function() {
    return this.isFirstTimeUser;
  };

  this.reset = function() {
    this.username = '';
    this.isFirstTimeUser = false;
    this.status = 'Undefined';
    this.lastStatusUpdated = Date.now();
    this.users = [];
  };
  this.resetFirstTimeUser = function() {
    this.isFirstTimeUser = false;
  };

  this.setUsers = function(users) {
    this.users = users;
  };

  this.getUser = function(username) {
    var status = {code: 'OK', lastUpdatedAt: Date.now()};
    angular.forEach(this.users, function(user){
      if (username === user.username) {
        status.code = user.statusCode;
        status.lastUpdatedAt = user.statusUpdatedAt;
      }
    });
    return status;
  }

  this.reset();
  this.resetFirstTimeUser();
});