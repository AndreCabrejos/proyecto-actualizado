const express = require("express");
const router = express.Router();

// Rutas de Autenticación
router.use("/auth", require("./auth"));

// Rutas de Canales
router.use("/canales", require("./canales"));

// Controladores habilitados
const userController = require("../controllers/userController");
const giftController = require("../controllers/giftController");
const viewerLevelController = require("../controllers/viewerLevelController");

// Rutas de usuarios y monedas
router.post("/users/:id/monedas", userController.updateCoins);

// Rutas de regalos
router.get("/regalos", giftController.getAll);
router.post("/regalos/enviar", giftController.sendGift);

// Rutas de niveles de espectadores
router.get("/viewer-levels", viewerLevelController.getAll);

// Rutas adicionales (si existen los archivos)
// Rutas adicionales (si existen los archivos)
router.use("/viewer-stats", require("./stats"));
// router.use("/monedas", require("./monedas"));

module.exports = router;
