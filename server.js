const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const cors = require('cors');
const session = require('express-session');
const mongoose = require("mongoose");

require('dotenv').config();

var generalRouter = require('./src/routes/general.routes');
var generalController = require('./src/controllers/general.controllers');

/**
 * Express is a routing and middleware web framework.
 * App object denotes the express application
 */
const app = express();
const port = process.env.PORT || 8080;

app.options('*', cors());
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: "COINBOX",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 }
}));

// Database Mongo
const DBUrl = process.env.DB_CONNECTION;
const DBName = process.env.DB_NAME;

mongoose
    .connect(DBUrl + DBName)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));


// Body parser
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // for post value parse application/x-www-form-urlencoded


/**
 * Run everyday at 1:00 a.m.
 * second (0 - 59, OPTIONAL)
 * minute (0 - 59)
 * hour (0 - 23)
 * day of month (1 - 31)
 * month (1 - 12)
 * day of week (0 - 7) (0 or 7 is Sun)
 */
const job = schedule.scheduleJob('0 0 1 * * *', function() {
    generalController.createChartImages();
});

// Every 10 minutes
const interval = setInterval(function() {
    generalController.updateNews();
}, 600000);


// express static file
app.use(express.static(__dirname + '/src/public'));

// routing
app.use('/', generalRouter);

// start listen server
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(err.status || 404).json({
        message: "No such route exists"
    })
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: "Error Message"
    })
});