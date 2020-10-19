var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

const { sequelize } = require('./models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  const err = new Error();
  err.status = 404;
  err.message = 'Page not found';
  res.render('page-not-found', { err });
});

// error handler
app.use(function(err, req, res, next) {
  if(err.status === 404){
    res.status(404).render('page-not-found', { err });
  } else {
    err.message = err.message || 'Server error. Please try again.';
    res.status(err.status || 500).render('error', { err });
  }
});

module.exports = app;
