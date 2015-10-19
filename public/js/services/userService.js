angular.module('UserService', []).service('User', function () {

	this.getUsername = function() {
    return this.username;
  };

  this.getStatus = function() {
    return this.status;
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
  };

  this.reset();

});