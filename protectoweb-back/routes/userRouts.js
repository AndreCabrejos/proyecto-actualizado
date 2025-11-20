const express = require('express');
const router = express.Router();
const { authRequired } = require('../middlewares/authMiddleware');

router.get('/me', authRequired, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
