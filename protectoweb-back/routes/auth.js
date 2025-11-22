const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authRequired } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);


router.get("/me", authRequired, async (req, res) => {
  const { User, ViewerStat } = require("../db/models");

  const user = await User.findByPk(req.user.id);
  const stats = await ViewerStat.findOne({ where: { userId: req.user.id } });

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    monedas: user.monedas,
    nivel: stats.nivel,
    puntos: stats.puntos,
  });
});

module.exports = router;
