import { pool } from "../database/pool.js";
import { AppError } from "../utils/AppError.js";

export async function leaveRoom({ userId, code }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const roomResult = await client.query(
      `SELECT id, host_user_id, status
       FROM rooms
       WHERE code = $1
       FOR UPDATE`,
      [code],
    );

    const room = roomResult.rows[0];

    if (!room) {
      throw new AppError(404, "Room not found", "ROOM_NOT_FOUND");
    }

    if (room.status !== "waiting") {
      throw new AppError(
        409,
        "You cannot leave a room after the game has started",
        "ROOM_IN_PROGRESS",
      );
    }

    const membershipResult = await client.query(
      `SELECT id, role
       FROM room_members
       WHERE room_id = $1 AND user_id = $2`,
      [room.id, userId],
    );

    if (membershipResult.rowCount === 0) {
      throw new AppError(
        404,
        "You are not a member of this room",
        "NOT_ROOM_MEMBER",
      );
    }

    const wasHost = room.host_user_id === userId;

    await client.query(
      `DELETE FROM room_members
       WHERE room_id = $1 AND user_id = $2`,
      [room.id, userId],
    );

    const remainingResult = await client.query(
      `SELECT user_id
       FROM room_members
       WHERE room_id = $1
       ORDER BY joined_at ASC, id ASC
       LIMIT 1`,
      [room.id],
    );

    if (remainingResult.rowCount === 0) {
      await client.query("DELETE FROM rooms WHERE id = $1", [room.id]);
      await client.query("COMMIT");

      return { deleted: true, code, roomId: room.id };
    }

    if (wasHost) {
      const nextHostId = remainingResult.rows[0].user_id;

      await client.query(
        `UPDATE room_members
         SET role = CASE
           WHEN user_id = $2 THEN 'host'
           ELSE 'player'
         END
         WHERE room_id = $1`,
        [room.id, nextHostId],
      );

      await client.query(
        `UPDATE rooms
         SET host_user_id = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [room.id, nextHostId],
      );
    }

    await client.query("COMMIT");

    return { deleted: false, code, roomId: room.id };
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original error.
    }

    throw error;
  } finally {
    client.release();
  }
}
