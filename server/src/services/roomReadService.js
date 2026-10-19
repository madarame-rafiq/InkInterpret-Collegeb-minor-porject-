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



export async function listRoomMembers({ userId, code }) {
  const accessResult = await pool.query(
    `SELECT r.id
     FROM rooms AS r
     JOIN room_members AS requester
       ON requester.room_id = r.id
     WHERE r.code = $1
       AND requester.user_id = $2`,
    [code, userId],
  );

  if (accessResult.rowCount === 0) {
    throw new AppError(
      404,
      "Room not found or you are not a member",
      "ROOM_NOT_FOUND",
    );
  }

  const result = await pool.query(
    `SELECT
       u.id AS user_id,
       u.username,
       rm.role,
       rm.joined_at
     FROM room_members AS rm
     JOIN users AS u ON u.id = rm.user_id
     WHERE rm.room_id = $1
     ORDER BY
       CASE WHEN rm.role = 'host' THEN 0 ELSE 1 END,
       rm.joined_at ASC,
       rm.id ASC`,
    [accessResult.rows[0].id],
  );

  return result.rows;
}