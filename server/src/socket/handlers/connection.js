import { markUserConnected, markUserDisconnected } from "../../services/gameService.js";

export const registerConnectionHandlers = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.request.session.userId;

    console.log(`Socket connected: ${socket.id}`);
    markUserConnected(userId).catch((error) => console.error("Unable to record game connection", error));

    socket.on("disconnect", async (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
      const sockets = await io.fetchSockets();
      const stillConnected = sockets.some(
        (candidate) => candidate.id !== socket.id && candidate.request.session?.userId === userId
      );
      if (!stillConnected) {
        markUserDisconnected(userId).catch((error) => console.error("Unable to record game disconnect", error));
      }
    });
  });
};
