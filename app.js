const createError = require('http-errors');
const formData = require("express-form-data");
const express = require('express');
const os = require("os");
const fs = require("fs");
const path = require('path');
const logger = require('morgan');

const storage = require('./storage');
storage.loadData('books.json');

const apiRouter = require('./routes/api');
const booksRouter = require('./routes/books');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');

const app = express();

const thumbnailsDir = path.join(__dirname, 'public', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir);
}

const options = {
  uploadDir: thumbnailsDir,
  autoClean: false
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(formData.parse(options));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
