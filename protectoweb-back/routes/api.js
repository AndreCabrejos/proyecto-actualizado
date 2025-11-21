// routes/api.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const channelController = require("../controllers/channelController");
const giftController = require("../controllers/giftController");
const viewerLevelController = require("../controllers/viewerLevelController");

// Auth
router.post("/register", userController.register);
router.post("/login", userController.login);

// Monedas
router.post("/users/:id/monedas", userController.updateCoins);

// Catálogos
router.get("/canales", channelController.getAll);
router.get("/regalos", giftController.getAll);
router.get("/viewer-levels", viewerLevelController.getAll);

module.exports = router;
