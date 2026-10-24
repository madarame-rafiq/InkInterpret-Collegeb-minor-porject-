import { getGameState, markAllActiveParticipantsDisconnected, processConnectivity, processDueGames } from "./gameService.js";

const SWEEP_MS = 1_000;

export const createGameTimer = (io) => {
  let running = false;
  const initialized = markAllActiveParticipantsDisconnected().catch((error) => {
    console.error("Unable to initialize game connection recovery", error);
  });
  const sweep = async () => {
    if (running) return;
    running = true;
    try {
      await initialized;
      const transitions = await processDueGames();
      for (const transition of transitions) {
        const state = await getGameStateForBroadcast(transition.game);
        const channel = `room:${transition.game.room_id}`;
        if (transition.event === "game:prompt:missed") {
          io.to(channel).emit("game:prompt:missed", {
            round: transition.round.round_number,
            message: `${state.round.promptGiver} didn't submit a prompt. Draw something that impresses the others!`,
          });
        }
        io.to(channel).emit(transition.event ?? "game:phase", state);
      }
      const aborted = await processConnectivity();
      for (const game of aborted) io.to(`room:${game.room_id}`).emit("game:aborted", { reason: "INSUFFICIENT_CONNECTED_PLAYERS" });
    } finally { running = false; }
  };
  const interval = setInterval(sweep, SWEEP_MS);
  interval.unref();
  sweep();
  return { stop: () => clearInterval(interval), sweep };
};

const getGameStateForBroadcast = async (game) => {
  // The broadcast payload is deliberately roster-neutral during voting. A
  // temporary participant lookup only supplies the state serializer's access
  // check and is not included in the payload.
  const { pool } = await import("../database/pool.js");
  const participant = await pool.query(
    `SELECT gp.user_id, r.code FROM game_participants gp JOIN games g ON g.id = gp.game_id JOIN rooms r ON r.id = g.room_id
     WHERE gp.game_id = $1 ORDER BY gp.roster_position LIMIT 1`, [game.id]
  );
  const state = await getGameState({ roomCode: participant.rows[0].code, userId: participant.rows[0].user_id });
  const round = await pool.query(
    `SELECT u.username FROM game_rounds gr JOIN users u ON u.id = gr.prompt_giver_user_id
     WHERE gr.game_id = $1 AND gr.round_number = $2`, [game.id, game.current_round_number]
  );
  return { ...state, round: { ...state.round, promptGiver: round.rows[0]?.username } };
};
