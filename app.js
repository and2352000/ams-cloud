var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var gethRouter = require('./routes/geth');
var uploadRouter = require('./routes/upload');
var downloadRouter = require('./routes/download');
var getFileRouter = require('./routes/getFile');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
//app.use('/geth', gethRouter);
app.post('/geth', gethRouter);
app.get('/geth', gethRouter);

app.use('/upload', uploadRouter);

app.get('/download/:hashId',downloadRouter);
app.get('/download',downloadRouter);
app.post('/download',downloadRouter);

app.get('/file/:hashId',getFileRouter);

// app.get('/upload', uploadRouter);
//app.get('/upload/:id', uploadRouter);
//app.post('/upload', uploadRouter);


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
