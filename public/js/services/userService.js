angular.module('UserService', []).service('User', function () {

	this.getUsername = function() {
    return this.username;
  };

  this.setUsername = function(username) {
    this.username = username;
  };

  this.setFirstTimeUser = function(value) {
    this.isFirstTimeUser = value;
  };

  this.checkFirstTimeUser = function() {
    return this.isFirstTimeUser;
  };

  this.reset = function() {
    this.username = '';
    this.isFirstTimeUser = false;
  };

  this.reset();

});