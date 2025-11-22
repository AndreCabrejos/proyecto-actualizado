const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");

// Obtener todos los canales
router.get("/", channelController.getAll);

// Obtener canal por ID
router.get("/:id", channelController.getById);

module.exports = router;
