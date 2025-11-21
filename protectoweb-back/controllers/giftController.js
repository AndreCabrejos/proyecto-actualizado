// controllers/giftController.js
const { Gift } = require("../db/models");

exports.getAll = async (req, res) => {
    try {
        const regalos = await Gift.findAll();
        res.json(regalos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al obtener regalos" });
    }
};
