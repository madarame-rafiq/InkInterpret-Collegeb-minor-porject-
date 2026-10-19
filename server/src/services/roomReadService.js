import { pool } from "../database/pool.js";
import { AppError } from "../utils/AppError.js";

export async function listUserRooms(userId) {
  const result = await pool.query(
    `SELECT
       r.id,
       r.code,
       r.host_user_id,
       r.max_players,
       r.drawing_duration,
       r.voting_duration,
       r.input_mode,
       r.status,
       rm.role,
       rm.joined_at,
       COUNT(all_members.id)::int AS member_count
     FROM room_members AS rm
     JOIN rooms AS r ON r.id = rm.room_id
     LEFT JOIN room_members AS all_members
       ON all_members.room_id = r.id
     WHERE rm.user_id = $1
     GROUP BY r.id, rm.role, rm.joined_at
     ORDER BY rm.joined_at DESC`,
    [userId],
  );

  return result.rows;
}

export async function getRoomForMember({ userId, code }) {
  const result = await pool.query(
    `SELECT
       r.id,
       r.code,
       r.host_user_id,
       r.max_players,
       r.drawing_duration,
       r.voting_duration,
       r.input_mode,
       r.status,
       rm.role,
       rm.joined_at,
       (
         SELECT COUNT(*)::int
         FROM room_members AS members
         WHERE members.room_id = r.id
       ) AS member_count
     FROM rooms AS r
     JOIN room_members AS rm
       ON rm.room_id = r.id AND rm.user_id = $1
     WHERE r.code = $2`,
    [userId, code],
  );

  if (result.rowCount === 0) {
    throw new AppError(
      404,
      "Room not found",
      "ROOM_NOT_FOUND",
    );
  }

  return result.rows[0];
}