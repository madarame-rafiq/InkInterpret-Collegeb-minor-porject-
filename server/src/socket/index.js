import { Server } from "socket.io";
import { sessionMiddleware } from "../config/session.js";
import { registerConnectionHandlers } from "./handlers/connection.js";
import { registerSocketHandlers } from "./handlers/roomSocket.js";
import { registerChatHandlers } from "./handlers/chatSocket.js";

export const createSocketServer = (httpServer, allowedOrigins) => {
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  io.engine.use(sessionMiddleware);

  io.use((socket, next) => {
    if (!socket.request.session?.userId) {
      const error = new Error("Authentication required");
      error.data = { code: "UNAUTHORIZED" };
      return next(error);
    }
    next();
  });

  registerConnectionHandlers(io);
  registerSocketHandlers(io);
  registerChatHandlers(io);

  return io;
};

// Remove every connection belonging to `userId` from the given room's
// live channel. Safe to call after the room has been deleted — leaving a
// non-existent channel is a no-op.

export const revokeUserFromRoom = async (
  io,
  roomId,
  userId,
  { roomDeleted = false } = {},
) => {
  if (!io) return;

  const channel = `room:${roomId}`;
  const sockets = await io.in(channel).fetchSockets();

  const socketsToRevoke = sockets.filter((socket) => {
    // If the room was deleted, every socket in its channel is stale.
    if (roomDeleted) return true;

    // Otherwise, revoke every tab belonging to the departing user.
    return socket.request.session?.userId === userId;
  });

  await Promise.all(
    socketsToRevoke.map(async (socket) => {
      try {
        socket.emit("room:access_revoked", {
          code: roomDeleted ? "ROOM_DELETED" : "ROOM_LEFT",
          message: roomDeleted
            ? "This room no longer exists."
            : "You have left this room.",
        });
      } finally {
        // Even if an event listener/adapter throws, do not leave a stale
        // socket subscribed to a room that the database has already revoked.
        await socket.leave(channel);
      }
    }),
  );
};
