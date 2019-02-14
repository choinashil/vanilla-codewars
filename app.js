const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser'); // post방식의 데이터를 json형식으로 받을 수 있게 해주는 외부모듈
const ejs = require('ejs'); // 동적 html 생성하는 외부모듈->html과 함께 사용시 <%%>영역을 프로그램 실행영역으로 처리되어 동적 html 생성
const mongoose = require('mongoose');

const index = require('./routes/index');

const app = express(); // app = express instance 

// app.set('views', path.join(__dirname, 'views'));
// app.set('views', './views');  // default
app.set('view engine', 'ejs');


const DB_URL = 'mongodb://localhost:27017/codewars';
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.once('open', function() {
  console.log('connected to database at ' + DB_URL);
});



// 정적파일 위치 지정 
app.use(express.static('public'));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

app.use('/', index);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
