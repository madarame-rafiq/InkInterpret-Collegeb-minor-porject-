import { getDrawingAsset, getGameState, markUserConnected, startGame } from "../services/gameService.js";

const normalizedCode = (value) => value?.trim().toUpperCase();

export const startGameController = async (req, res, next) => {
  try {
    const game = await startGame({ roomCode: normalizedCode(req.params.code), userId: req.session.userId });
    const io = req.app.get("io");
    const sockets = await io.fetchSockets();
    await Promise.all([...new Set(sockets.map((socket) => socket.request.session?.userId).filter(Boolean))].map(markUserConnected));
    io.to(`room:${game.room_id}`).emit("game:started", { gameId: game.id, phase: game.current_phase, phaseEndsAt: game.phase_ends_at });
    res.status(201).json({ status: "success", data: { game } });
  } catch (error) { next(error); }
};

export const getGameStateController = async (req, res, next) => {
  try {
    const game = await getGameState({ roomCode: normalizedCode(req.params.code), userId: req.session.userId });
    res.status(200).json({ status: "success", data: { game } });
  } catch (error) { next(error); }
};

export const getDrawingController = async (req, res, next) => {
  try {
    const drawing = await getDrawingAsset({ roomCode: normalizedCode(req.params.code), userId: req.session.userId, publicId: req.params.publicId });
    // Drawings can contain user-created material; do not let shared caches
    // retain an authenticated response after the game has moved on.
    res.set("Cache-Control", "private, no-store").type(drawing.mimeType).send(drawing.body);
  } catch (error) { next(error); }
};
