require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();
const memoryStore = new session.MemoryStore();

app.use(session({
  secret: "some secret",
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Initialize Keycloak
const keycloak = new Keycloak({ store: memoryStore }, "./keycloak-config.json");
app.use(keycloak.middleware());

// Pass Keycloak instance when mounting routers
app.use('/api', require('./routes/index')(keycloak));
app.use('/api/smart-search', require('./routes/smart_search')(keycloak));
//app.use('/api/user', require('./routes/user')(keycloak)); // modify if user routes need protection

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// DB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("db connection established"))
    .catch(err => console.error(err));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = { app, keycloak };
