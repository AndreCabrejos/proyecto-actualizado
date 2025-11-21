const express = require('express');
const router = express.Router();
const { authRequired } = require('../middlewares/authMiddleware');
const userController = require('../controllers/authController'); 

router.get('/me', authRequired, userController.me);

module.exports = router;
