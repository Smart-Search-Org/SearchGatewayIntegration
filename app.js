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

// ===== Middleware =====
app.use(logger('dev'));
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ===== Session & Keycloak =====
app.use(session({
  secret: "some secret",
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore }, "./keycloak-config.json");
app.use(keycloak.middleware());

// ===== Routes (pass Keycloak instance) =====
app.use('/api', require('./routes/index')(keycloak));
app.use('/api/smart-search', require('./routes/smart_search')(keycloak));
// app.use('/api/user', require('./routes/user')(keycloak)); // uncomment if needed

// ===== View engine setup =====
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// ===== Database =====
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB connection established"))
    .catch(err => console.error(err));

// ===== 404 handler =====
app.use((req, res, next) => {
  next(createError(404));
});

// ===== Error handler =====
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ===== Export both app and keycloak =====
module.exports = { app, keycloak };
