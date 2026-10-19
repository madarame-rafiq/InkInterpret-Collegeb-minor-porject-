import { pool } from "../database/pool.js";
import { AppError } from "../utils/AppError.js";

export async function joinRoom({ userId, code }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Serialize joins to this room so capacity cannot be exceeded.
    const roomResult = await client.query(
      `SELECT id, code, host_user_id, max_players, status
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
        "This room is no longer accepting players",
        "ROOM_NOT_JOINABLE",
      );
    }

    const existingMember = await client.query(
      `SELECT id, role
       FROM room_members
       WHERE room_id = $1 AND user_id = $2`,
      [room.id, userId],
    );

    if (existingMember.rowCount > 0) {
      throw new AppError(
        409,
        "You are already a member of this room",
        "ALREADY_IN_ROOM",
      );
    }

    const countResult = await client.query(
      `SELECT COUNT(*)::int AS member_count
       FROM room_members
       WHERE room_id = $1`,
      [room.id],
    );

    if (countResult.rows[0].member_count >= room.max_players) {
      throw new AppError(409, "Room is full", "ROOM_FULL");
    }

    await client.query(
      `INSERT INTO room_members (room_id, user_id, role)
       VALUES ($1, $2, 'player')`,
      [room.id, userId],
    );

    await client.query("COMMIT");

    return {
      id: room.id,
      code: room.code,
      hostUserId: room.host_user_id,
      maxPlayers: room.max_players,
      status: room.status,
    };
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