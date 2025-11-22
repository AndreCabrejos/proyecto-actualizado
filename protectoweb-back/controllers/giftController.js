const { Gift, ViewerStat, ViewerLevel, User, GiftHistory, Channel } = require("../db/models");
const { getIO } = require("../sockets/io");

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
    const senderId = req.user && req.user.id;
    const { channelId, giftId } = req.body;

    if (!senderId || !giftId) return res.status(400).json({ message: "Faltan datos" });

    const gift = await Gift.findByPk(giftId);
    if (!gift) return res.status(404).json({ message: "Gift no encontrado" });

    const user = await User.findByPk(senderId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if ((user.monedas || 0) < (gift.costo || 0)) return res.status(400).json({ message: "Monedas insuficientes" });

    user.monedas = user.monedas - (gift.costo || 0);
    await user.save();

    let stats = await ViewerStat.findOne({ where: { userId: senderId } });
    if (!stats) stats = await ViewerStat.create({ userId: senderId, nivel: 1, puntos: 0 });

    const nuevosPuntos = (stats.puntos || 0) + (gift.puntos || 0);
    const levels = await ViewerLevel.findAll({ order: [["puntos_requeridos", "ASC"]] });
    let nuevoNivel = stats.nivel || 1;
    for (const level of levels) if (nuevosPuntos >= level.puntos_requeridos) nuevoNivel = level.nivel;

    stats.puntos = nuevosPuntos;
    stats.nivel = nuevoNivel;
    await stats.save();

    const hist = await GiftHistory.create({
      senderId,
      channelId: channelId || null,
      giftId: gift.id,
      costo: gift.costo,
      puntos: gift.puntos
    });

    const payload = {
      id: hist.id,
      senderId,
      senderUsername: user.username,
      channelId: channelId || null,
      gift: { id: gift.id, nombre: gift.nombre, icono: gift.icono, costo: gift.costo, puntos: gift.puntos },
      createdAt: hist.createdAt
    };

    const io = getIO();
    if (channelId) io.to(`channel_${channelId}`).emit("gift:received", payload);
    else io.emit("gift:received", payload);

    return res.json({
      message: "Gift enviado correctamente",
      monedasRestantes: user.monedas,
      puntosTotales: stats.puntos,
      nivelActual: stats.nivel,
      historial: hist
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno al enviar gift" });
  }
};

exports.createForStreamer = async (req, res) => {
  try {
    if (req.user.role !== "streamer") return res.status(403).json({ error: "Solo streamers" });

    const { nombre, costo, puntos, icono, channelId } = req.body;
    const gift = await Gift.create({ nombre, costo, puntos, icono, streamerId: req.user.id, channelId: channelId || null });
    res.status(201).json(gift);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando gift" });
  }
};

exports.updateForStreamer = async (req, res) => {
  try {
    if (req.user.role !== "streamer") return res.status(403).json({ error: "Solo streamers" });
    const { id } = req.params;
    const gift = await Gift.findByPk(id);
    if (!gift) return res.status(404).json({ error: "Gift no encontrado" });
    if (gift.streamerId !== req.user.id) return res.status(403).json({ error: "No autorizado" });

    const { nombre, costo, puntos, icono } = req.body;
    await gift.update({ nombre, costo, puntos, icono });
    res.json(gift);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando gift" });
  }
};

exports.deleteForStreamer = async (req, res) => {
  try {
    if (req.user.role !== "streamer") return res.status(403).json({ error: "Solo streamers" });
    const { id } = req.params;
    const gift = await Gift.findByPk(id);
    if (!gift) return res.status(404).json({ error: "Gift no encontrado" });
    if (gift.streamerId !== req.user.id) return res.status(403).json({ error: "No autorizado" });

    await gift.destroy();
    res.json({ message: "Gift eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando gift" });
  }
};

exports.historyForStreamer = async (req, res) => {
  try {
    if (req.user.role !== "streamer") return res.status(403).json({ error: "Solo streamers" });
    const streamerId = req.user.id;

    const channels = await Channel.findAll({ where: { streamerId } });
    const channelIds = channels.map(c => c.id);

    const history = await GiftHistory.findAll({
      where: channelIds.length ? { channelId: channelIds } : {},
      include: [{ model: Gift }, { model: User, as: 'sender' }, { model: Channel }]
    });

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo historial" });
  }
};
