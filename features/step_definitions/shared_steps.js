var expect = require('expect.js');

var SharedSteps = function() {
  this.Given('I am on the home page', function (callback) {
    this.visit('/', callback);
  });

  this.Given('I hit the "$button" button', function(button, callback) {
    this.browser.pressButton(button, callback);
  });

  this.Given('I provide the username "$username" and password "$password"', function(username, password, callback) {
    this.browser
      .fill('username', username)
      .fill('password', password);
    callback();
  });

  this.Given('I confirm the password "$password"', function(password, callback) {
    this.browser.fill('confirmPassword', password);
    callback();
  });

  this.Then('I should see "$title" as the title', function(title, callback) {
    expect(title).to.be.eql(this.browser.text('title'));
    callback();
  });
};

module.exports = SharedSteps;
