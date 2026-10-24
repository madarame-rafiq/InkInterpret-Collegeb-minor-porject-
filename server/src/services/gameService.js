import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../database/pool.js";
import { AppError } from "../utils/AppError.js";

const PROMPT_MS = 45_000;
const RESULT_MS = 12_000;
const DISCONNECT_ABORT_MS = 60_000;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_CANVAS_CHARS = 8 * 1024 * 1024;
const storageDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../storage/game-drawings"
);

const addMilliseconds = (date, milliseconds) =>
  new Date(date.getTime() + milliseconds);

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const replacement = randomInt(index + 1);
    [copy[index], copy[replacement]] = [copy[replacement], copy[index]];
  }
  return copy;
};

export const createPromptGiverOrder = (participantIds) => {
  if (!Array.isArray(participantIds) || participantIds.length < 3) {
    throw new Error("At least three participants are required to create a game roster");
  }
  if (new Set(participantIds).size !== participantIds.length) {
    throw new Error("Game participants must be unique");
  }
  return shuffle(participantIds);
};

const appError = (status, message, code) => new AppError(status, message, code);

const rollback = async (client) => {
  try { await client.query("ROLLBACK"); } catch { /* preserve original error */ }
};

const currentRound = async (client, gameId, roundNumber, lock = false) => {
  const result = await client.query(
    `SELECT * FROM game_rounds
     WHERE game_id = $1 AND round_number = $2${lock ? " FOR UPDATE" : ""}`,
    [gameId, roundNumber]
  );
  return result.rows[0] ?? null;
};

const assertRosterMember = async (client, gameId, userId) => {
  const result = await client.query(
    `SELECT 1 FROM game_participants WHERE game_id = $1 AND user_id = $2`,
    [gameId, userId]
  );
  if (!result.rowCount) throw appError(403, "You are not in this game roster", "NOT_GAME_PARTICIPANT");
};

const setPhase = async (client, game, phase, deadline, extras = {}) => {
  const result = await client.query(
    `UPDATE games
     SET current_phase = $2, phase_ends_at = $3,
         current_round_number = COALESCE($4, current_round_number),
         status = COALESCE($5, status), ended_at = COALESCE($6, ended_at),
         abort_reason = COALESCE($7, abort_reason)
     WHERE id = $1
     RETURNING *`,
    [game.id, phase, deadline, extras.roundNumber ?? null, extras.status ?? null, extras.endedAt ?? null, extras.abortReason ?? null]
  );
  return result.rows[0];
};

const votingOrResult = async (client, game, round, now) => {
  const drawings = await client.query(
    `SELECT COUNT(*)::int AS count FROM game_drawings WHERE round_id = $1`, [round.id]
  );
  if (drawings.rows[0].count < 2) {
    await client.query(
      `UPDATE game_rounds SET voting_skipped = true, voting_skip_reason = 'FEWER_THAN_TWO_DRAWINGS'
       WHERE id = $1`, [round.id]
    );
    return setPhase(client, game, "result", addMilliseconds(now, RESULT_MS));
  }
  return setPhase(client, game, "voting", addMilliseconds(now, game.voting_duration * 1000));
};

const markMissingDrawings = async (client, round) => {
  await client.query(
    `UPDATE game_round_participants SET drawing_status = 'missing'
     WHERE round_id = $1 AND drawing_status = 'pending'`, [round.id]
  );
};

const applyVotingPenalties = async (client, game, round) => {
  if (round.voting_skipped) return;
  const missing = await client.query(
    `SELECT gp.user_id
     FROM game_participants AS gp
     WHERE gp.game_id = $1
       AND NOT EXISTS (
         SELECT 1 FROM game_votes AS gv
         WHERE gv.round_id = $2 AND gv.voter_user_id = gp.user_id
       )`,
    [game.id, round.id]
  );
  for (const { user_id: userId } of missing.rows) {
    const inserted = await client.query(
      `INSERT INTO game_score_events (game_id, round_id, user_id, event_type, points)
       VALUES ($1, $2, $3, 'non_voting_penalty', -3)
       ON CONFLICT (round_id, user_id, event_type) DO NOTHING
       RETURNING id`,
      [game.id, round.id, userId]
    );
    if (inserted.rowCount) {
      await client.query(
        `UPDATE game_participants SET score = score - 3 WHERE game_id = $1 AND user_id = $2`,
        [game.id, userId]
      );
    }
  }
};

const transitionLockedGame = async (client, game, now) => {
  const round = await currentRound(client, game.id, game.current_round_number, true);
  if (!round) throw new Error(`Game ${game.id} has no current round`);

  if (game.current_phase === "prompt") {
    if (round.prompt_status === "pending") {
      await client.query(
        `UPDATE game_rounds SET prompt_status = 'missed' WHERE id = $1`, [round.id]
      );
    }
    return { game: await setPhase(client, game, "drawing", addMilliseconds(now, game.drawing_duration * 1000)), event: "game:prompt:missed", round };
  }
  if (game.current_phase === "drawing") {
    if (game.input_mode === "canvas") await markMissingDrawings(client, round);
    if (game.input_mode === "photo") {
      return { game: await setPhase(client, game, "capture", addMilliseconds(now, game.capture_duration * 1000)), event: "game:phase", round };
    }
    return { game: await votingOrResult(client, game, round, now), event: "game:phase", round };
  }
  if (game.current_phase === "capture") {
    await markMissingDrawings(client, round);
    return { game: await votingOrResult(client, game, round, now), event: "game:phase", round };
  }
  if (game.current_phase === "voting") {
    await applyVotingPenalties(client, game, round);
    await client.query(`UPDATE game_rounds SET result_processed = true WHERE id = $1`, [round.id]);
    return { game: await setPhase(client, game, "result", addMilliseconds(now, RESULT_MS)), event: "game:results", round };
  }
  if (game.current_phase === "result") {
    const total = await client.query(`SELECT COUNT(*)::int AS count FROM game_rounds WHERE game_id = $1`, [game.id]);
    if (game.current_round_number >= total.rows[0].count) {
      const ended = await setPhase(client, game, "finished", now, { status: "finished", endedAt: now });
      await client.query(`UPDATE rooms SET status = 'waiting', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [game.room_id]);
      return { game: ended, event: "game:finished", round };
    }
    const nextNumber = game.current_round_number + 1;
    const nextRound = await currentRound(client, game.id, nextNumber, true);
    const nextDeadline = addMilliseconds(now, PROMPT_MS);
    await client.query(`UPDATE game_rounds SET prompt_deadline = $2 WHERE id = $1`, [nextRound.id, nextDeadline]);
    return { game: await setPhase(client, game, "prompt", nextDeadline, { roundNumber: nextNumber }), event: "game:phase", round: { ...nextRound, prompt_deadline: nextDeadline } };
  }
  return { game, event: null, round };
};

export const startGame = async ({ roomCode, userId }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const roomResult = await client.query(
      `SELECT * FROM rooms WHERE code = $1 FOR UPDATE`, [roomCode]
    );
    const room = roomResult.rows[0];
    if (!room) throw appError(404, "Room not found", "ROOM_NOT_FOUND");
    if (room.host_user_id !== userId) throw appError(403, "Only the room host can start the game", "HOST_REQUIRED");
    if (room.status !== "waiting") throw appError(409, "Room is not ready to start", "ROOM_NOT_STARTABLE");
    const members = await client.query(
      `SELECT rm.user_id FROM room_members rm WHERE rm.room_id = $1 ORDER BY rm.joined_at, rm.id`, [room.id]
    );
    if (members.rowCount < 3) throw appError(409, "At least three players are required", "NOT_ENOUGH_PLAYERS");
    const order = createPromptGiverOrder(members.rows.map((row) => row.user_id));
    const now = new Date();
    const promptDeadline = addMilliseconds(now, PROMPT_MS);
    const created = await client.query(
      `INSERT INTO games (room_id, input_mode, drawing_duration, voting_duration, current_round_number, current_phase, phase_ends_at)
       VALUES ($1, $2, $3, $4, 1, 'prompt', $5) RETURNING *`,
      [room.id, room.input_mode, room.drawing_duration, room.voting_duration, promptDeadline]
    );
    const game = created.rows[0];
    for (let index = 0; index < order.length; index += 1) {
      await client.query(
        `INSERT INTO game_participants (game_id, user_id, roster_position, disconnected_at)
         VALUES ($1, $2, $3, $4)`, [game.id, order[index], index + 1, now]
      );
      const roundResult = await client.query(
        `INSERT INTO game_rounds (game_id, round_number, prompt_giver_user_id, prompt_deadline)
         VALUES ($1, $2, $3, $4) RETURNING id`, [game.id, index + 1, order[index], promptDeadline]
      );
      const roundId = roundResult.rows[0].id;
      for (const participantId of order) {
        await client.query(`INSERT INTO game_round_participants (round_id, user_id) VALUES ($1, $2)`, [roundId, participantId]);
      }
    }
    await client.query(`UPDATE rooms SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [room.id]);
    await client.query("COMMIT");
    return game;
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

export const submitPrompt = async ({ roomCode, userId, prompt }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const game = await lockedActiveGame(client, roomCode);
    const now = new Date();
    if (game.current_phase !== "prompt" || new Date(game.phase_ends_at) <= now) throw appError(409, "The prompt phase is closed", "PHASE_CLOSED");
    const round = await currentRound(client, game.id, game.current_round_number, true);
    if (round.prompt_giver_user_id !== userId) throw appError(403, "Only the designated prompt giver may submit", "PROMPT_GIVER_REQUIRED");
    if (round.prompt_status !== "pending") throw appError(409, "A prompt was already resolved", "PROMPT_ALREADY_RESOLVED");
    await client.query(`UPDATE game_rounds SET prompt_text = $2, prompt_author_user_id = $3, prompt_status = 'submitted' WHERE id = $1`, [round.id, prompt, userId]);
    const updated = await setPhase(client, game, "drawing", addMilliseconds(now, game.drawing_duration * 1000));
    await client.query("COMMIT");
    return updated;
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

const lockedActiveGame = async (client, roomCode) => {
  const result = await client.query(
    `SELECT g.* FROM games g JOIN rooms r ON r.id = g.room_id
     WHERE r.code = $1 AND g.status = 'active' FOR UPDATE OF g`, [roomCode]
  );
  if (!result.rowCount) throw appError(404, "No active game exists for this room", "GAME_NOT_FOUND");
  return result.rows[0];
};

const assertSubmissionPhase = async (client, game, userId, phase) => {
  await assertRosterMember(client, game.id, userId);
  if (game.current_phase !== phase || new Date(game.phase_ends_at) <= new Date()) {
    throw appError(409, "This submission phase is closed", "PHASE_CLOSED");
  }
  return currentRound(client, game.id, game.current_round_number, true);
};

export const submitCanvasDrawing = async ({ roomCode, userId, canvasData }) => {
  if (typeof canvasData !== "string" || !canvasData.trim() || canvasData.length > MAX_CANVAS_CHARS) throw appError(400, "Invalid canvas data", "INVALID_DRAWING");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const game = await lockedActiveGame(client, roomCode);
    if (game.input_mode !== "canvas") throw appError(409, "This room requires photo capture", "WRONG_INPUT_MODE");
    const round = await assertSubmissionPhase(client, game, userId, "drawing");
    const result = await client.query(
      `INSERT INTO game_drawings (round_id, artist_user_id, submission_type, canvas_data)
       VALUES ($1, $2, 'canvas', $3) ON CONFLICT (round_id, artist_user_id) DO NOTHING RETURNING public_id`,
      [round.id, userId, canvasData]
    );
    if (!result.rowCount) throw appError(409, "You already submitted a drawing", "DRAWING_ALREADY_SUBMITTED");
    await client.query(`UPDATE game_round_participants SET drawing_status = 'submitted' WHERE round_id = $1 AND user_id = $2`, [round.id, userId]);
    await client.query("COMMIT"); return result.rows[0].public_id;
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

const decodeImage = (dataUrl) => {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl ?? "");
  if (!match) throw appError(400, "Only PNG, JPEG, or WebP images are accepted", "INVALID_IMAGE");
  const data = Buffer.from(match[2], "base64");
  if (!data.length || data.length > MAX_IMAGE_BYTES) throw appError(400, "Image must be at most 8 MB", "IMAGE_TOO_LARGE");
  return { mimeType: match[1], data };
};

export const submitPhotoDrawing = async ({ roomCode, userId, dataUrl }) => {
  const { mimeType, data } = decodeImage(dataUrl);
  const client = await pool.connect();
  let filePath;
  try {
    await client.query("BEGIN");
    const game = await lockedActiveGame(client, roomCode);
    if (game.input_mode !== "photo") throw appError(409, "This room requires canvas drawings", "WRONG_INPUT_MODE");
    const round = await assertSubmissionPhase(client, game, userId, "capture");
    const existing = await client.query(`SELECT 1 FROM game_drawings WHERE round_id = $1 AND artist_user_id = $2`, [round.id, userId]);
    if (existing.rowCount) throw appError(409, "You already submitted a drawing", "DRAWING_ALREADY_SUBMITTED");
    const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
    const storageKey = `${randomUUID()}.${extension}`;
    await mkdir(storageDirectory, { recursive: true });
    filePath = resolve(storageDirectory, storageKey);
    await writeFile(filePath, data, { flag: "wx" });
    const result = await client.query(
      `INSERT INTO game_drawings (round_id, artist_user_id, submission_type, storage_key, mime_type, byte_size)
       VALUES ($1, $2, 'photo', $3, $4, $5) RETURNING public_id`,
      [round.id, userId, storageKey, mimeType, data.length]
    );
    await client.query(`UPDATE game_round_participants SET drawing_status = 'submitted' WHERE round_id = $1 AND user_id = $2`, [round.id, userId]);
    await client.query("COMMIT"); return result.rows[0].public_id;
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

export const submitVote = async ({ roomCode, userId, publicDrawingId }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const game = await lockedActiveGame(client, roomCode);
    const round = await assertSubmissionPhase(client, game, userId, "voting");
    const drawing = await client.query(`SELECT id, artist_user_id FROM game_drawings WHERE round_id = $1 AND public_id = $2`, [round.id, publicDrawingId]);
    if (!drawing.rowCount) throw appError(400, "That drawing is not a voting option", "INVALID_DRAWING");
    if (drawing.rows[0].artist_user_id === userId) throw appError(400, "You cannot vote for your own drawing", "SELF_VOTE");
    const vote = await client.query(
      `INSERT INTO game_votes (round_id, voter_user_id, drawing_id) VALUES ($1, $2, $3)
       ON CONFLICT (round_id, voter_user_id) DO NOTHING RETURNING id`, [round.id, userId, drawing.rows[0].id]
    );
    if (!vote.rowCount) throw appError(409, "You already voted this round", "VOTE_ALREADY_SUBMITTED");
    await client.query(`UPDATE game_round_participants SET voted_at = CURRENT_TIMESTAMP WHERE round_id = $1 AND user_id = $2`, [round.id, userId]);
    await client.query("COMMIT");
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

export const getGameState = async ({ roomCode, userId }) => {
  const gameResult = await pool.query(
    `SELECT g.* FROM games g JOIN rooms r ON r.id = g.room_id
     JOIN room_members rm ON rm.room_id = r.id AND rm.user_id = $2
     JOIN game_participants gp ON gp.game_id = g.id AND gp.user_id = $2
     WHERE r.code = $1 ORDER BY g.started_at DESC LIMIT 1`, [roomCode, userId]
  );
  if (!gameResult.rowCount) throw appError(404, "Game not found", "GAME_NOT_FOUND");
  const game = gameResult.rows[0];
  const round = await currentRound(pool, game.id, game.current_round_number);
  const participants = await pool.query(
    `SELECT gp.roster_position AS "position", gp.score, gp.user_id = $2 AS "isYou", u.username
     FROM game_participants gp JOIN users u ON u.id = gp.user_id WHERE gp.game_id = $1 ORDER BY gp.roster_position`, [game.id, userId]
  );
  const drawings = await pool.query(
    `SELECT gd.public_id AS "publicId", gd.submission_type AS "type"
       ${game.current_phase === "result" || game.status !== "active" ? ", u.username AS artist, COUNT(gv.id)::int AS votes" : ""}
     FROM game_drawings gd
     JOIN game_rounds gr ON gr.id = gd.round_id
     ${game.current_phase === "result" || game.status !== "active" ? "JOIN users u ON u.id = gd.artist_user_id LEFT JOIN game_votes gv ON gv.drawing_id = gd.id" : ""}
     WHERE gd.round_id = $1
     ${game.current_phase === "result" || game.status !== "active" ? "GROUP BY gd.id, u.username" : ""}
     ORDER BY gd.public_id`, [round.id]
  );
  return {
    id: game.id, status: game.status, phase: game.current_phase, phaseEndsAt: game.phase_ends_at,
    round: { number: round.round_number, promptStatus: round.prompt_status, prompt: round.prompt_text, votingSkipped: round.voting_skipped, votingSkipReason: round.voting_skip_reason },
    participants: participants.rows, drawings: drawings.rows.map((drawing) => ({ ...drawing, assetUrl: `/api/rooms/${roomCode}/game/drawings/${drawing.publicId}` })),
  };
};

export const getDrawingAsset = async ({ roomCode, userId, publicId }) => {
  const result = await pool.query(
    `SELECT gd.submission_type, gd.canvas_data, gd.storage_key, gd.mime_type
     FROM game_drawings gd
     JOIN game_rounds gr ON gr.id = gd.round_id
     JOIN games g ON g.id = gr.game_id
     JOIN rooms r ON r.id = g.room_id
     JOIN room_members rm ON rm.room_id = r.id AND rm.user_id = $2
     JOIN game_participants gp ON gp.game_id = g.id AND gp.user_id = $2
     WHERE r.code = $1 AND gd.public_id = $3
     ORDER BY g.started_at DESC LIMIT 1`,
    [roomCode, userId, publicId]
  );
  if (!result.rowCount) throw appError(404, "Drawing not found", "DRAWING_NOT_FOUND");
  const drawing = result.rows[0];
  if (drawing.submission_type === "canvas") return { mimeType: "application/json", body: JSON.stringify({ canvasData: drawing.canvas_data }) };
  if (!drawing.storage_key || resolve(storageDirectory, drawing.storage_key) !== resolve(storageDirectory, drawing.storage_key.split("/").pop())) {
    throw appError(404, "Drawing file not found", "DRAWING_NOT_FOUND");
  }
  try { return { mimeType: drawing.mime_type, body: await readFile(resolve(storageDirectory, drawing.storage_key)) }; }
  catch { throw appError(404, "Drawing file not found", "DRAWING_NOT_FOUND"); }
};

export const processDueGames = async () => {
  const due = await pool.query(`SELECT id FROM games WHERE status = 'active' AND phase_ends_at <= CURRENT_TIMESTAMP ORDER BY phase_ends_at LIMIT 25`);
  const transitions = [];
  for (const { id } of due.rows) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const locked = await client.query(`SELECT * FROM games WHERE id = $1 FOR UPDATE`, [id]);
      const game = locked.rows[0];
      if (game?.status === "active" && new Date(game.phase_ends_at) <= new Date()) transitions.push(await transitionLockedGame(client, game, new Date()));
      await client.query("COMMIT");
    } catch (error) { await rollback(client); console.error("Game deadline transition failed", error); } finally { client.release(); }
  }
  return transitions;
};

export const markUserConnected = async (userId) => pool.query(
  `UPDATE game_participants gp SET connected_at = CURRENT_TIMESTAMP, disconnected_at = NULL
   FROM games g WHERE g.id = gp.game_id AND g.status = 'active' AND gp.user_id = $1`, [userId]
);

export const markUserDisconnected = async (userId) => pool.query(
  `UPDATE game_participants gp SET disconnected_at = CURRENT_TIMESTAMP
   FROM games g WHERE g.id = gp.game_id AND g.status = 'active' AND gp.user_id = $1`, [userId]
);

export const markAllActiveParticipantsDisconnected = async () => pool.query(
  `UPDATE game_participants gp SET disconnected_at = CURRENT_TIMESTAMP
   FROM games g WHERE g.id = gp.game_id AND g.status = 'active'`
);

export const getRoomIdForGame = async (gameId) => {
  const result = await pool.query(`SELECT room_id FROM games WHERE id = $1`, [gameId]);
  return result.rows[0]?.room_id;
};

export const processConnectivity = async () => {
  const client = await pool.connect();
  const aborted = [];
  try {
    await client.query("BEGIN");
    const games = await client.query(`SELECT * FROM games WHERE status = 'active' FOR UPDATE`);
    const now = new Date();
    for (const game of games.rows) {
      const connected = await client.query(`SELECT COUNT(*)::int AS count FROM game_participants WHERE game_id = $1 AND disconnected_at IS NULL`, [game.id]);
      if (connected.rows[0].count >= 2) {
        if (game.insufficient_connected_since) await client.query(`UPDATE games SET insufficient_connected_since = NULL WHERE id = $1`, [game.id]);
      } else if (!game.insufficient_connected_since) {
        await client.query(`UPDATE games SET insufficient_connected_since = $2 WHERE id = $1`, [game.id, now]);
      } else if (now - new Date(game.insufficient_connected_since) >= DISCONNECT_ABORT_MS) {
        await setPhase(client, game, "aborted", now, { status: "aborted", endedAt: now, abortReason: "INSUFFICIENT_CONNECTED_PLAYERS" });
        await client.query(`UPDATE rooms SET status = 'waiting', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [game.room_id]);
        aborted.push(game);
      }
    }
    await client.query("COMMIT");
  } catch (error) { await rollback(client); console.error("Game connectivity sweep failed", error); } finally { client.release(); }
  return aborted;
};
