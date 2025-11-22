// app.js
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const apiRouter = require('./routes/api');

const app = express();

// ✅ Permitir tanto 5173 como 3000 (Vite o CRA)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente 🚀' });
});

app.use('/api', apiRouter);

module.exports = app;
