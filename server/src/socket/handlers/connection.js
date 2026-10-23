export const registerConnectionHandlers = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.request.session.userId;

    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });
};