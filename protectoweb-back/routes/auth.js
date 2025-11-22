const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { authRequired } = require("../middlewares/authMiddleware");

// register + login via userController (desunificado)
router.post("/register", userController.register);
router.post("/login", userController.login);

// obtener info del usuario autenticado
router.get("/me", authRequired, authController.me);

module.exports = router;
