const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const canalesRoutes = require("./canales");
const giftsRoutes = require("./gifts");
const monedasRoutes = require("./monedas");
const statsRoutes = require("./stats");
const viewerLevelController = require("../controllers/viewerLevelController");

router.use("/auth", authRoutes);
router.use("/canales", canalesRoutes);
router.use("/regalos", giftsRoutes);
router.use("/monedas", monedasRoutes);
router.use("/viewer-stats", statsRoutes);

router.get("/viewer-levels", viewerLevelController.getAll);

module.exports = router;
