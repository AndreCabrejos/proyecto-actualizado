const express = require("express");
const router = express.Router();

const { authRequired } = require("../middlewares/authMiddleware");
const { comprarMonedas } = require("../controllers/coinsController");

router.post("/comprar", authRequired, comprarMonedas);

router.get("/balance", authRequired, async (req, res) => {
  const { User } = require("../db/models");
  const user = await User.findByPk(req.user.id);
  res.json({ monedas: user.monedas });
});

module.exports = router;
