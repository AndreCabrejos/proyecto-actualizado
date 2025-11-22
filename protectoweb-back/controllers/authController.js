const { User, ViewerStat } = require("../db/models");

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const stats = await ViewerStat.findOne({ where: { userId: user.id } });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      monedas: user.monedas,
      nivel: stats?.nivel ?? null,
      puntos: stats?.puntos ?? null
    });
  } catch (err) {
    console.error("Error en /auth/me:", err);
    res.status(500).json({ error: "Error interno" });
  }
};
