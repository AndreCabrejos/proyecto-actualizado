var express = require('express');
var cookieParser = require('cookie-parser');
require('dotenv').config();

var authRoutes = require('./routes/authRoutes');
var userRoutes = require('./routes/userRoutes');

var cors = require('cors');
var app = express();

// 🔹 CORS configurado
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;
