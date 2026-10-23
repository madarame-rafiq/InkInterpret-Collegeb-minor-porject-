
import { pool } from "../database/pool.js";

const MAX_MESSAGE_LENGTH = 1000;
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

// These are the room states in which the live room channel and persistent
// chat are available. Keep room-channel admission and chat authorization on
// this same policy.
export const LIVE_CHAT_ROOM_STATUSES = Object.freeze([
  "waiting",
  "in_progress",
]);

export const getLiveRoomMembership = async ({ roomCode, userId }) => {
  const result = await pool.query(
    `SELECT r.id
     FROM rooms AS r
     JOIN room_members AS rm ON rm.room_id = r.id
     WHERE r.code = $1
       AND rm.user_id = $2
       AND r.status = ANY($3::varchar[])
     LIMIT 1`,
    [roomCode, userId, LIVE_CHAT_ROOM_STATUSES]
  );

  return result.rowCount > 0 ? { roomId: result.rows[0].id } : null;
};

export const createChatMessage = async ({
  roomCode,
  userId,
  content,
}) => {
  const message = content?.trim();

  if (
    typeof message !== "string" ||
    message.length === 0 ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return { error: "INVALID_MESSAGE" };
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // This is the same lock used by leaveRoom. It establishes a single order
    // between a send and a leave: a message is either committed before leave,
    // or the later send sees that membership has gone and is rejected.
    const access = await client.query(
      `SELECT r.id
       FROM rooms AS r
       JOIN room_members AS rm ON rm.room_id = r.id
       WHERE r.code = $1
         AND rm.user_id = $2
         AND r.status = ANY($3::varchar[])
       FOR UPDATE OF r`,
      [roomCode, userId, LIVE_CHAT_ROOM_STATUSES]
    );

    if (access.rowCount === 0) {
      await client.query("ROLLBACK");
      return { error: "ROOM_ACCESS_DENIED" };
    }

    const result = await client.query(
      `WITH inserted AS (
         INSERT INTO chat_messages (room_id, user_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, room_id, user_id, content, created_at
       )
       SELECT
         i.id,
         i.room_id AS "roomId",
         i.user_id AS "userId",
         u.username,
         i.content,
         i.created_at AS "createdAt"
       FROM inserted AS i
       JOIN users AS u ON u.id = i.user_id`,
      [access.rows[0].id, userId, message]
    );

    await client.query("COMMIT");
    return { message: result.rows[0] };
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
};

export const getChatHistory = async ({
  roomCode,
  userId,
  limit = DEFAULT_PAGE_SIZE,
  before = null,
}) => {
  const pageSize = Math.min(
    Math.max(Number.parseInt(limit, 10) || DEFAULT_PAGE_SIZE, 1),
    MAX_PAGE_SIZE
  );

  // History is authorized from the current database membership, rather than
  // from a client-controlled room code or Socket.IO channel alone.
  const access = await getLiveRoomMembership({ roomCode, userId });

  if (!access) {
    return { error: "ROOM_ACCESS_DENIED" };
  }

  const roomId = access.roomId;

  let cursorCondition = "";
  const values = [roomId, pageSize + 1];

  if (before) {
    if (
      typeof before.createdAt !== "string" ||
      typeof before.id !== "string" ||
      !Number.isFinite(Date.parse(before.createdAt)) ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        before.id
      )
    ) {
      return { error: "INVALID_CURSOR" };
    }

    cursorCondition = `
      AND (cm.created_at, cm.id) < ($3::timestamptz, $4::uuid)
    `;

    values.push(before.createdAt, before.id);
  }

  const result = await pool.query(
    `SELECT
       cm.id,
       cm.user_id AS "userId",
       u.username,
       cm.content,
       cm.created_at AS "createdAt"
     FROM chat_messages AS cm
     JOIN users AS u ON u.id = cm.user_id
     WHERE cm.room_id = $1
       ${cursorCondition}
     ORDER BY cm.created_at DESC, cm.id DESC
     LIMIT $2`,
    values
  );

  const hasMore = result.rows.length > pageSize;
  const rows = result.rows.slice(0, pageSize);

  // Return messages oldest-to-newest for straightforward rendering.
  rows.reverse();

  return {
    messages: rows,
    hasMore,
    nextCursor:
      hasMore && rows.length > 0
        ? {
            createdAt: rows[0].createdAt.toISOString(),
            id: rows[0].id,
          }
        : null,
  };
};
