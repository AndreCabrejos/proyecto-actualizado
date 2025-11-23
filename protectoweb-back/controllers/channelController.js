const { Channel, User } = require("../db/models");

module.exports = {
  // --- CREAR O ACTUALIZAR CANAL ---
  createOrUpdateChannel: async (req, res) => {
    try {
      const { nombre, categoria, imagen } = req.body;
      const userId = req.user.id;

      // Verificar si ya existe un canal con ese nombre
      let canal = await Channel.findOne({ where: { nombre } });

      if (canal) {
        // Actualizar existente
        await canal.update({ nombre, categoria, imagen });
        return res.json({ message: "Canal actualizado correctamente", canal });
      }

      // Crear nuevo
      canal = await Channel.create({
        nombre,
        categoria,
        imagen,
        viewers: 0
      });

      res.status(201).json({ message: "Canal creado exitosamente", canal });

    } catch (error) {
      console.error("Error en canal:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // --- OBTENER MI CANAL (Dashboard) ---
  getMyChannel: async (req, res) => {
    try {
      const userId = req.user.id;
      // Por ahora retornamos un mensaje ya que no hay relación userId
      return res.status(404).json({ message: "No tienes un canal creado aún." });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener tu canal." });
    }
  },

  // --- OBTENER TODOS (Home) ---
  getAll: async (req, res) => {
    try {
      const canales = await Channel.findAll();
      res.json(canales);
    } catch (error) {
      console.error("Error en getAll canales:", error);
      res.status(500).json({ message: "Error al cargar canales" });
    }
  },

  // --- OBTENER POR ID (Opcional, para vista de viewer) ---
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const canal = await Channel.findByPk(id);
  
      if (!canal) return res.status(404).json({ message: "Canal no encontrado" });
      res.json(canal);
    } catch (error) {
      console.error("Error en getById canal:", error);
      res.status(500).json({ error: "Error interno" });
    }
  }
};
