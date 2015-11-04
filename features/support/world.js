const Browser = require('zombie');
Browser.localhost('localhost', 4444);
Browser.silent = true;

function World() {
  this.browser = new Browser(); // this.browser will be available in step definitions

  this.visit = function (url, callback) {
    this.browser.visit(url, callback);
  };
}

module.exports = function() {
  this.World = World;
};
