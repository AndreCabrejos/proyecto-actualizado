const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");
const { authRequired } = require("../middlewares/authMiddleware");

// Públicas
router.get("/", channelController.getAll);
router.get("/:id", channelController.getById);

// Privadas (Requieren Login)
router.post("/", authRequired, channelController.createOrUpdateChannel);
router.get("/me/data", authRequired, channelController.getMyChannel); // Ruta específica para 'mi canal'

module.exports = router;