var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

var routes = require('./routes/index');
var users = require('./routes/users');
var messages = require('./routes/messages');
var status = require('./routes/status');
var routers = [ users, routes, messages, status];

var maintenance = require('./routes/maintenance');
var app = express();

// Configure Maintenance
var options = {
    current: false,                      // current state, default **false**
    httpEndpoint: true,                 // expose http endpoint for hot-switch, default **false**,
    url: '/maintenance',                     // if `httpEndpoint` is on, customize endpoint url, default **'/maintenance'**
    view: 'maintenance.jade',                // view to render on maintenance, default **'maintenance.html'**
    status: 503,                        // status code for response, default **503**
    message: 'Maintenance in progress. Please try again later...',
    routers: routers
};
maintenance(app, options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/messages', messages);
app.use('/status', status);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('partials/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('partials/error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
