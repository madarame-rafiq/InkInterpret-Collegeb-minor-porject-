import { z } from "zod";
import { getGameState, markUserConnected, startGame, submitCanvasDrawing, submitPhotoDrawing, submitPrompt, submitVote } from "../../services/gameService.js";

const code = z.string().trim().toUpperCase().regex(/^[A-Z0-9]{6,8}$/);
const schemas = {
  start: z.object({ code }),
  prompt: z.object({ code, prompt: z.string().trim().min(1).max(500) }),
  canvas: z.object({ code, canvasData: z.string().min(1).max(8 * 1024 * 1024) }),
  photo: z.object({ code, dataUrl: z.string().min(1).max(12 * 1024 * 1024) }),
  vote: z.object({ code, drawingId: z.string().uuid() }),
  state: z.object({ code }),
};

const error = (code, message) => ({ status: "error", error: { code, message } });
const ok = (data = {}) => ({ status: "success", data });

const respond = (handler, schema) => async (socket, payload, acknowledge) => {
  const reply = typeof acknowledge === "function" ? acknowledge : () => {};
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return reply(error("VALIDATION_ERROR", "Invalid game command payload."));
  try { return reply(ok(await handler(socket, parsed.data))); }
  catch (cause) { return reply(error(cause.code ?? "INTERNAL_ERROR", cause.isOperational ? cause.message : "Unable to process game command.")); }
};

export const registerGameHandlers = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.request.session.userId;
    const requireChannel = (roomCode, state) => {
      // State hides the room UUID; the membership/roster checks in services are
      // authoritative. This guard retains the existing socket-room contract.
      if (!socket.rooms.has(socket.id)) throw new Error(`Socket unavailable for ${roomCode}`);
      return state;
    };
    socket.on("game:start", respond(async (_socket, data) => {
      const game = await startGame({ roomCode: data.code, userId });
      const sockets = await io.fetchSockets();
      await Promise.all([...new Set(sockets.map((candidate) => candidate.request.session?.userId).filter(Boolean))].map(markUserConnected));
      io.to(`room:${game.room_id}`).emit("game:started", { gameId: game.id, phase: game.current_phase, phaseEndsAt: game.phase_ends_at });
      return { gameId: game.id, phase: game.current_phase, phaseEndsAt: game.phase_ends_at };
    }, schemas.start));
    socket.on("game:state", respond(async (_socket, data) => requireChannel(data.code, await getGameState({ roomCode: data.code, userId })), schemas.state));
    socket.on("game:prompt:submit", respond(async (_socket, data) => {
      const game = await submitPrompt({ roomCode: data.code, userId, prompt: data.prompt });
      io.to(`room:${game.room_id}`).emit("game:phase", { phase: game.current_phase, phaseEndsAt: game.phase_ends_at });
      return { phase: game.current_phase, phaseEndsAt: game.phase_ends_at };
    }, schemas.prompt));
    socket.on("game:drawing:submit", respond(async (_socket, data) => ({ drawingId: await submitCanvasDrawing({ roomCode: data.code, userId, canvasData: data.canvasData }) }), schemas.canvas));
    socket.on("game:capture:submit", respond(async (_socket, data) => ({ drawingId: await submitPhotoDrawing({ roomCode: data.code, userId, dataUrl: data.dataUrl }) }), schemas.photo));
    socket.on("game:vote:submit", respond(async (_socket, data) => { await submitVote({ roomCode: data.code, userId, publicDrawingId: data.drawingId }); return {}; }, schemas.vote));
  });
};
