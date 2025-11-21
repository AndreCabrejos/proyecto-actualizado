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
