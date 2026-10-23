
import { z } from "zod";
import { pool } from "../../database/pool.js";
import { LIVE_CHAT_ROOM_STATUSES } from "../../services/chatService.js";

const joinRoomSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6,8}$/),
});

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("room:join", async (payload, acknowledge) => {
      const reply =
        typeof acknowledge === "function" ? acknowledge : () => {};

      const parsed = joinRoomSchema.safeParse(payload);

      if (!parsed.success) {
        return reply({
          status: "error",
          error: {
            code: "INVALID_ROOM_CODE",
            message: "A valid room code is required.",
          },
        });
      }

      try {
        const userId = socket.request.session?.userId;

        if (!userId) {
          return reply({
            status: "error",
            error: {
              code: "UNAUTHORIZED",
              message: "Authentication required.",
            },
          });
        }

        const result = await pool.query(
          `SELECT r.id, r.code
           FROM rooms AS r
           JOIN room_members AS rm
             ON rm.room_id = r.id
           WHERE r.code = $1
             AND rm.user_id = $2
             AND r.status = ANY($3::varchar[])
           LIMIT 1`,
          [parsed.data.code, userId, LIVE_CHAT_ROOM_STATUSES]
        );

        if (result.rowCount === 0) {
          return reply({
            status: "error",
            error: {
              code: "ROOM_ACCESS_DENIED",
              message: "Room not found or you are not a member.",
            },
          });
        }

        const room = result.rows[0];

        await socket.join(`room:${room.id}`);

        return reply({
          status: "success",
          data: {
            roomId: room.id,
            code: room.code,
          },
        });
      } catch (error) {
        console.error("Socket room join error:", error);

        return reply({
          status: "error",
          error: {
            code: "INTERNAL_ERROR",
            message: "Unable to join the room.",
          },
        });
      }
    });
  });
};
