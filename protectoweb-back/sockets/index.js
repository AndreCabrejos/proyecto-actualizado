const { getIO } = require('./io');
const { GiftHistory, Channel, User, Gift } = require("../db/models");

module.exports = (ioParam) => {
  const io = ioParam || getIO();

  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    socket.on('join', ({ channelId }) => {
      if (!channelId) return;
      socket.join(`channel_${channelId}`);
    });

    socket.on('leave', ({ channelId }) => {
      if (!channelId) return;
      socket.leave(`channel_${channelId}`);
    });

    socket.on('chat:message', (payload) => {
      const { channelId } = payload || {};
      if (!channelId) return;
      io.to(`channel_${channelId}`).emit('chat:message', {
        ...payload,
        createdAt: new Date()
      });
    });

    // gift:send via socket: backend validates, persists and emits
    socket.on('gift:send', async ({ senderId, giftId, channelId }) => {
      try {
        const gift = await Gift.findByPk(giftId);
        const user = await User.findByPk(senderId);
        if (!gift || !user) {
          socket.emit('gift:error', { message: 'Gift o usuario no encontrado' });
          return;
        }
        if ((user.monedas || 0) < (gift.costo || 0)) {
          socket.emit('gift:error', { message: 'Monedas insuficientes' });
          return;
        }

        user.monedas = user.monedas - (gift.costo || 0);
        await user.save();

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

        if (channelId) io.to(`channel_${channelId}`).emit("gift:received", payload);
        else io.emit("gift:received", payload);

      } catch (err) {
        console.error("socket gift error", err);
        socket.emit("gift:error", { message: "Error interno en gift" });
      }
    });

    socket.on('disconnect', () => {
      // cleanup
    });
  });
};
