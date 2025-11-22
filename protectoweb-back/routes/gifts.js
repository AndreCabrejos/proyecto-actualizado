const express = require("express");
const router = express.Router();
const giftController = require("../controllers/giftController");
const { authRequired, allowRoles } = require("../middlewares/authMiddleware");

// catálogo público
router.get("/", giftController.getAll);

// enviar gift (autenticado)
router.post("/enviar", authRequired, giftController.sendGift);

// CRUD para streamers
router.post("/", authRequired, allowRoles("streamer"), giftController.createForStreamer);
router.put("/:id", authRequired, allowRoles("streamer"), giftController.updateForStreamer);
router.delete("/:id", authRequired, allowRoles("streamer"), giftController.deleteForStreamer);

// Historial (streamer)
router.get("/historial/streamer", authRequired, allowRoles("streamer"), giftController.historyForStreamer);

module.exports = router;
