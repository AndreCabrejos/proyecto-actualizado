// routes/index.js
const express = require('express');
const router = express.Router();

// Ruta base: http://localhost:3001/
router.get('/', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente 🚀' });
});

module.exports = router;
