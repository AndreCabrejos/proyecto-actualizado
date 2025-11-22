// controllers/channelController.js
const { Channel } = require("../db/models");

exports.getAll = async (req, res) => {
    try {
        const canales = await Channel.findAll();
        res.json(canales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al obtener canales" });
    }
};
exports.getById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const canal = await Channel.findByPk(id);
  
      if (!canal) {
        return res.status(404).json({ message: "Canal no encontrado" });
      }
  
      res.json(canal);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno" });
    }
  };
  
