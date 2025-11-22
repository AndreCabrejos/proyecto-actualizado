

const { ViewerStat, ViewerLevel } = require("../db/models");

exports.getProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Obtener stats del usuario
    const stats = await ViewerStat.findOne({ where: { userId } });

    if (!stats) {
      return res.status(404).json({ message: "Stats no encontradas" });
    }

    const puntos = stats.puntos;

    // 2. Nivel actual
    const nivelActual = await ViewerLevel.findOne({
      where: { nivel: stats.nivel }
    });

    // 3. Siguiente nivel
    const siguienteNivel = await ViewerLevel.findOne({
      where: { nivel: stats.nivel + 1 }
    });

    // Último nivel
    if (!siguienteNivel) {
      return res.json({
        nivelActual: stats.nivel,
        puntos,
        siguienteNivel: null,
        puntosNecesarios: null,
        progresoPorcentaje: 100
      });
    }

    // 4. Cálculo del progreso
    const min = nivelActual.puntos_requeridos;
    const max = siguienteNivel.puntos_requeridos;

    const porcentaje = ((puntos - min) / (max - min)) * 100;

    return res.json({
      nivelActual: stats.nivel,
      puntos,
      siguienteNivel: siguienteNivel.nivel,
      puntosNecesarios: siguienteNivel.puntos_requeridos,
      progresoPorcentaje: Math.max(0, Math.min(100, porcentaje.toFixed(2)))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};
