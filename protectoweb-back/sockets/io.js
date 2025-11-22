let io = null;

module.exports = {
  init: (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
      cors: { origin: [ 'http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL ], credentials: true }
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket.io no inicializado!");
    return io;
  }
};
