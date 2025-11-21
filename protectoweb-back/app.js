const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api'); // 👈 nuevo

const app = express();

app.use(cors());               // permitir peticiones desde tu front (http://localhost:5173 por ej.)
app.use(logger('dev'));
app.use(express.json());       // 👈 importante para leer JSON del body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);    // 👈 aquí montas tus endpoints: /api/login, /api/canales, etc.

module.exports = app;
