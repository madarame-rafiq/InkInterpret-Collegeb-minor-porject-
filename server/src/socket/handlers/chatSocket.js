import { z } from "zod";
import { pool } from "../../database/pool.js";
import {
  createChatMessage,
  getChatHistory,
  getLiveRoomMembership,
} from "../../services/chatService.js";

const roomCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6,8}$/);

const sendMessageSchema = z.object({
  code: roomCodeSchema,
  content: z.string().min(1).max(1000),
});

const historySchema = z.object({
  code: roomCodeSchema,
  limit: z.number().int().min(1).max(100).optional(),
  before: z
    .object({
      createdAt: z.string(),
      id: z.string().uuid(),
    })
    .optional(),
});

const RATE_LIMIT_WINDOW_MS = 10_000;
const MAX_MESSAGES_PER_WINDOW = 8;

const messageTimestamps = new Map();

const errorResponse = (code, message) => ({
  status: "error",
  error: { code, message },
});

const successResponse = (data) => ({
  status: "success",
  data,
});

const isRateLimited = (socket) => {
  const now = Date.now();

  const timestamps = (messageTimestamps.get(socket.id) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_MESSAGES_PER_WINDOW) {
    messageTimestamps.set(socket.id, timestamps);
    return true;
  }

  timestamps.push(now);
  messageTimestamps.set(socket.id, timestamps);

  return false;
};

// Remove sockets whose room membership has been revoked.
const pruneUnauthorizedSockets = async (io, roomId) => {
  const channel = `room:${roomId}`;

  const [membersResult, sockets] = await Promise.all([
    pool.query(
      `SELECT user_id
       FROM room_members
       WHERE room_id = $1`,
      [roomId]
    ),
    io.in(channel).fetchSockets(),
  ]);

  const memberIds = new Set(membersResult.rows.map((row) => row.user_id));

  await Promise.all(
    sockets.map(async (socket) => {
      const userId = socket.request.session?.userId;

      if (!userId || !memberIds.has(userId)) {
        await socket.leave(channel);
      }
    })
  );
};

export const registerChatHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("chat:send", async (payload, acknowledge) => {
      const reply =
        typeof acknowledge === "function" ? acknowledge : () => {};

      const parsed = sendMessageSchema.safeParse(payload);

      if (!parsed.success) {
        return reply(
          errorResponse(
            "INVALID_MESSAGE",
            "Provide a valid room code and a message of 1–1000 characters."
          )
        );
      }

      if (isRateLimited(socket)) {
        return reply(
          errorResponse(
            "RATE_LIMITED",
            "Too many messages. Please wait before sending more."
          )
        );
      }

      try {
        const userId = socket.request.session?.userId;

        if (!userId) {
          return reply(
            errorResponse("UNAUTHORIZED", "Authentication required.")
          );
        }

        // Authorize BEFORE writing anything to the database.
        const membership = await getLiveRoomMembership({
          roomCode: parsed.data.code,
          userId,
        });

        if (
          !membership ||
          !socket.rooms.has(`room:${membership.roomId}`)
        ) {
          return reply(
            errorResponse(
              "ROOM_ACCESS_DENIED",
              "Join the room before sending messages."
            )
          );
        }

        const roomId = membership.roomId;
        const channel = `room:${roomId}`;

        const result = await createChatMessage({
          roomCode: parsed.data.code,
          userId,
          content: parsed.data.content,
        });

        if (result.error) {
          return reply(
            errorResponse(
              result.error,
              result.error === "INVALID_MESSAGE"
                ? "Message content is invalid."
                : "Room not found or you are not a member."
            )
          );
        }

        const { message } = result;

        await pruneUnauthorizedSockets(io, roomId);

        // The message is already persisted in PostgreSQL.
        io.to(channel).emit("chat:message", message);

        return reply(successResponse({ message }));
      } catch (error) {
        console.error("Chat send error:", error);

        return reply(
          errorResponse("INTERNAL_ERROR", "Unable to send message.")
        );
      }
    });

    socket.on("chat:history", async (payload, acknowledge) => {
      const reply =
        typeof acknowledge === "function" ? acknowledge : () => {};

      const parsed = historySchema.safeParse(payload);

      if (!parsed.success) {
        return reply(
          errorResponse(
            "INVALID_HISTORY_REQUEST",
            "The room code, limit, or pagination cursor is invalid."
          )
        );
      }

      try {
        const userId = socket.request.session?.userId;

        if (!userId) {
          return reply(
            errorResponse("UNAUTHORIZED", "Authentication required.")
          );
        }

        const history = await getChatHistory({
          roomCode: parsed.data.code,
          userId,
          limit: parsed.data.limit,
          before: parsed.data.before,
        });

        if (history.error) {
          return reply(
            errorResponse(
              history.error,
              "Room not found or you are not a member."
            )
          );
        }

        return reply(successResponse(history));
      } catch (error) {
        console.error("Chat history error:", error);

        return reply(
          errorResponse(
            "INTERNAL_ERROR",
            "Unable to retrieve chat history."
          )
        );
      }
    });

    socket.on("disconnect", () => {
      messageTimestamps.delete(socket.id);
    });
  });
};
