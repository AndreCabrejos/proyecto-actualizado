// controllers/coinsController.js
const { User } = require("../db/models");

exports.comprarMonedas = async (req, res) => {
  try {
    const userId = req.user.id;   // viene del middleware authRequired
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }

    const usuario = await User.findByPk(userId);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // sumar monedas
    usuario.monedas += cantidad;
    await usuario.save();

    res.json({
      message: "Monedas compradas correctamente",
      monedas: usuario.monedas
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la compra de monedas" });
  }
};
