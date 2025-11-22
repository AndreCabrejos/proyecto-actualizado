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

// NUEVA RUTA PARA ENVIAR GIFT
router.post("/regalos/enviar", giftController.sendGift);

router.use("/viewer-stats", require("./stats"));

router.use("/canales", require("./canales"));

router.use("/auth", require("./auth"));

router.use("/monedas", require("./monedas"));






module.exports = router;
