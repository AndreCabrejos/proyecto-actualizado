const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");
const { authRequired, allowRoles } = require("../middlewares/authMiddleware");

router.get("/", channelController.getAll);
router.get("/:id", channelController.getById);

router.post("/", authRequired, allowRoles("streamer"), channelController.create);
router.put("/:id", authRequired, allowRoles("streamer"), channelController.update);
router.delete("/:id", authRequired, allowRoles("streamer"), channelController.delete);

module.exports = router;
