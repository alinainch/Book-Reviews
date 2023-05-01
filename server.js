// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose'); //has schemas. layer on top of mongodb
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan'); //packagae that logs all reqs
var cookieParser = require('cookie-parser');//enables us to look at cookies (helps stay logged in)
var bodyParser   = require('body-parser');//get info from html forms
var session      = require('express-session');//keeps logged in

var configDB = require('./config/database.js'); //go to config folder and find db file. exports an obj. config db holds an obj that holds url dbname propery

var db

// configuration ===============================================================
//after mongoose connects the callback function runs either error or connects 
//mongoose.connect takes a url(go to config file to see) then callback func 
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration. 2nd passport runs the func

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2023a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
