const { Gift, ViewerStat, ViewerLevel, User } = require("../db/models");

exports.getAll = async (req, res) => {
    try {
        const regalos = await Gift.findAll();
        res.json(regalos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al obtener regalos" });
    }
};

exports.sendGift = async (req, res) => {
    try {
        const { viewerId, channelId, giftId } = req.body;

        if (!viewerId || !giftId) {
            return res.status(400).json({ message: "viewerId y giftId son obligatorios" });
        }

        const gift = await Gift.findByPk(giftId);
        if (!gift) {
            return res.status(404).json({ message: "Gift no encontrado" });
        }

        const user = await User.findByPk(viewerId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const costo = gift.costo || 0;
        const monedasActuales = user.monedas || 0;

        if (monedasActuales < costo) {
            return res.status(400).json({ message: "Monedas insuficientes para enviar este gift" });
        }

        user.monedas = monedasActuales - costo;
        await user.save();

        let stats = await ViewerStat.findOne({ where: { userId: viewerId } });

        if (!stats) {
            stats = await ViewerStat.create({
                userId: viewerId,
                nivel: 1,
                puntos: 0
            });
        }

        const puntosNuevos = (stats.puntos || 0) + (gift.puntos || 0);

        const levels = await ViewerLevel.findAll({
            order: [["puntos_requeridos", "ASC"]]
        });

        let nuevoNivel = stats.nivel || 1;

        for (const level of levels) {
            if (puntosNuevos >= level.puntos_requeridos) {
                nuevoNivel = level.nivel;
            }
        }

        stats.puntos = puntosNuevos;
        stats.nivel = nuevoNivel;
        await stats.save();

        return res.json({
            message: "Gift enviado correctamente",
            monedasRestantes: user.monedas,
            puntosTotales: stats.puntos,
            nivelActual: stats.nivel
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error interno al enviar gift" });
    }
};
