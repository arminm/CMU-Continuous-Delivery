angular.module('UserService', []).service('User', function () {
	this.username = '';
	this.isFirstTimeUser = false;

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
});