import { randomInt } from "node:crypto";
import { pool } from "../database/pool.js";

const ROOM_CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_CODE_LENGTH = 6;
const MAX_CODE_ATTEMPTS = 5;

function generateRoomCode() {
  return Array.from({ length: ROOM_CODE_LENGTH }, () => {
    return ROOM_CODE_CHARACTERS[
      randomInt(ROOM_CODE_CHARACTERS.length)
    ];
  }).join("");
}

export async function createRoom({
  hostUserId,
  maxPlayers,
  drawingDuration,
  votingDuration,
  inputMode,
}) {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const roomResult = await client.query(
        `INSERT INTO rooms (
          code,
          host_user_id,
          max_players,
          drawing_duration,
          voting_duration,
          input_mode
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          code,
          host_user_id,
          max_players,
          drawing_duration,
          voting_duration,
          input_mode,
          status,
          created_at`,
        [
          generateRoomCode(),
          hostUserId,
          maxPlayers,
          drawingDuration,
          votingDuration,
          inputMode,
        ],
      );

      const room = roomResult.rows[0];

      await client.query(
        `INSERT INTO room_members (room_id, user_id, role)
         VALUES ($1, $2, 'host')`,
        [room.id, hostUserId],
      );

      await client.query("COMMIT");

      return room;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original error.
      }

      if (
        error.code === "23505" &&
        error.constraint === "rooms_code_key" &&
        attempt < MAX_CODE_ATTEMPTS - 1
      ) {
        continue;
      }

      throw error;
    } finally {
      client.release();
    }
  }

  throw new Error("Unable to generate a unique room code");
}