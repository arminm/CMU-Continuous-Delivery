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

  this.getPrivilegeLevel = function () {
    return this.privilegeLevel;
  };

  this.getLanguage = function () {
    if (this.selectedLang === undefined ) {
      this.selectedLang = {
        id: "en",
        language: "English"
      };
    }
    return this.selectedLang;
  };

  this.setLanguage = function(lang) {
    this.selectedLang = lang;
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

  this.setPrivilegeLevel = function (value) {
    this.privilegeLevel = value;
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

  this.getUsers = function() {
    return this.users;
  };

  this.getStatus = function(username) {
    if (username === undefined) {
      return this.status;
    }
    var status = {code: 'OK', lastUpdatedAt: Date.now()};
    angular.forEach(this.users, function(user){
      if (username === user.username) {
        status.code = user.statusCode;
        status.lastUpdatedAt = user.statusUpdatedAt;
      }
    });
    return status;
  };

  this.reset();
  this.resetFirstTimeUser();
});