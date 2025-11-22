require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const apiRouter = require('./routes/api');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
];

app.use(helmet());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS not allowed"));
  },
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

// error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err?.stack || err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;
