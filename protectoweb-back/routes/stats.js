const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.get("/:userId", statsController.getProgress);

module.exports = router;
