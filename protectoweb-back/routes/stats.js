const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

// Soporta dos rutas: /:userId y /progress/:userId para compatibilidad con frontend
router.get("/:userId", statsController.getProgress);
router.get("/progress/:userId", statsController.getProgress);

module.exports = router;
