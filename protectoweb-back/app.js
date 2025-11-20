var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var authRoutes = require('./routes/authRoutes');
var userRoutes = require('./routes/userRoutes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;
