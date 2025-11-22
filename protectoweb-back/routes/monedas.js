const express = require("express");
const router = express.Router();

const { authRequired } = require("../middlewares/authMiddleware");
const { comprarMonedas } = require("../controllers/coinsController");

// POST /api/monedas/comprar
router.post("/comprar", authRequired, comprarMonedas);

module.exports = router;
