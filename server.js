// Base on tutorial https://devdactic.com/restful-api-user-authentication-1/
// Dev by WormIt and KienNguyen
// NodeJS is awesome!

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('./config/database'), // get db config file
    server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    jwt = require('jwt-simple');

// routing
var signup = require('./routes/signup'),
    login = require('./routes/login'),
    memberinfo = require('./routes/memberinfo'),
    upload = require('./routes/upload'),
    socks = require('./routes/socks'),
    getsocks_api = require('./routes/socks_api');

var fs = require('fs');
fs.existsSync('./uploads') || fs.mkdirSync('./uploads');

app.use(bodyParser.json());
// get our request parameters
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(morgan('dev')); // log to console

// Use the passport package in our application
app.use(passport.initialize());

// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

// connect to database
mongoose.connect(config.database, function(err) {
    if (err) {
        console.log('Mongo Connection Error', err);
    } else {
        console.log('Mongo Connection Successful');
    }
});

// connect the api routes under /api/*
app.use('/api/signup', signup);
app.use('/api/login', login);
app.use('/api/memberinfo', memberinfo);
app.use('/api/getsocks', getsocks_api);
app.use('/upload', upload);
app.use('/getsocks', socks);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// ----- error handlers
// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.json({ error: err })
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.json({ error: err })
// });
// -----

// Start the server
app.listen(server_port, server_ip_address, function() {
    console.log('Listening on port: http://' + server_ip_address + ":" + server_port);
});
