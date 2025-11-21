// controllers/viewerLevelController.js
const { ViewerLevel } = require("../db/models");

exports.getAll = async (req, res) => {
    try {
        const levels = await ViewerLevel.findAll({ order: [["nivel", "ASC"]] });
        res.json(levels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al obtener niveles" });
    }
};
