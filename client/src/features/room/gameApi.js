import { ApiError, apiFetch } from '../../lib/api.js'

function unexpectedResponse() {
  return new ApiError({
    status: 200,
    code: 'UNEXPECTED_RESPONSE',
    message: 'The server sent a response the app could not understand.',
  })
}

// GET /api/rooms/:code/game  ->  data.game
//
// Resolves to the authoritative game snapshot, or to null when the server
// reports GAME_NOT_FOUND (no game for this room, or you're not on its roster).
// Every other failure (401, 5xx, network) is thrown. It must never be
// mistaken for "no game".
export async function fetchGameState(code, signal) {
  try {
    const payload = await apiFetch(`/api/rooms/${encodeURIComponent(code)}/game`, { signal })
    const game = payload?.data?.game
    if (!game || typeof game.phase !== 'string' || typeof game.status !== 'string') {
      throw unexpectedResponse()
    }
    return game
  } catch (error) {
    if (error instanceof ApiError && error.status === 404 && error.code === 'GAME_NOT_FOUND') {
      return null
    }
    throw error
  }
}

// POST /api/rooms/:code/game/start  (host only; 201 on success)
//
// The response body is a raw database row and is deliberately ignored. The
// caller reconciles by re-reading the authoritative snapshot.
export async function startGame(code) {
  await apiFetch(`/api/rooms/${encodeURIComponent(code)}/game/start`, { method: 'POST' })
}