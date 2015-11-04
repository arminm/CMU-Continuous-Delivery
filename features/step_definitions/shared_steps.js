var expect = require('expect.js');

var SharedSteps = function() {
  this.Given(/^I am on the home page$/, function (callback) {
    this.visit('/', callback);
  });

  this.Then(/^I should see (.*) as the title$/, function(text, callback) {
    expect(text).to.be.eql(this.browser.text('title'));
    callback();
  });
};

module.exports = SharedSteps;
