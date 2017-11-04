/****
 *server.js
 *@path server.js
 *@file server.js
 *@scripted by Vijayakumar
 ****/
/*
 *Module dependencies
 */
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 6056;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var redis        = require('redis');
var configDB     = require('./config/config.js');


mongoose.Promise = global.Promise;
mongoose.connect(configDB.database.url, {
  useMongoClient: true
}).catch(function(error) {
  console.error('mongo connection fail::', error);
}).then(function(mongodb) {
  console.log('mongo connected');
});

/*
 *logging every details to console
 */
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./views'));
/*
 *set up view engine to jade for templating
 */
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/views/jade'));

app.use(session({
  secret: 'secretkey'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*
 * pass passport for configuration
 */
require('./api/users/services/passport')(passport);
var userRoutes = require('./api/users/routes/userRoutes')//importing route
app.use('/', userRoutes);
var taskRoutes = require('./api/notes/routes/taskRoutes')//importing route
app.use('/', taskRoutes);

/*
 *starting the server with port number 6056
 */
app.listen(port);
console.log('Server is running on port:' + port);
