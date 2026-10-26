import { ApiError, apiFetch } from '../../lib/api.js'
import { getSocket } from '../../lib/socket.js'

const ACK_TIMEOUT_MS = 15_000

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

// ── Socket commands ─────────────────────────────────────────────────────────
// The server acknowledges every command as { status: 'success', data } or
// { status: 'error', error: { code, message } }. Both are mapped onto the
// same ApiError the HTTP helper throws, so callers handle one error type.
// A timeout is its own code (ACK_TIMEOUT): it is NOT proof the server
// rejected the command, and callers word it that way.

function emitWithAck(event, payload) {
  return new Promise((resolve, reject) => {
    const socket = getSocket()

    // Socket.IO would buffer an emit made while disconnected and send it on
    // reconnect, after we've already told the person it failed. Don't emit.
    if (!socket.connected) {
      reject(
        new ApiError({
          status: 0,
          code: 'SOCKET_DISCONNECTED',
          message: 'You’re disconnected right now. Wait for the connection to return, then try again.',
        }),
      )
      return
    }

    socket.timeout(ACK_TIMEOUT_MS).emit(event, payload, (timeoutError, response) => {
      if (timeoutError) {
        reject(
          new ApiError({
            status: 0,
            code: 'ACK_TIMEOUT',
            message: 'The server didn’t respond in time. Check your connection and try again.',
          }),
        )
        return
      }

      if (response?.status === 'success') {
        resolve(response.data ?? {})
        return
      }

      reject(
        new ApiError({
          status: 0,
          code: response?.error?.code ?? null,
          message: response?.error?.message ?? 'The server rejected the request.',
        }),
      )
    })
  })
}

// game:prompt:submit { code, prompt }  ->  { phase, phaseEndsAt }
export function submitPrompt(code, prompt) {
  return emitWithAck('game:prompt:submit', { code, prompt })
}

// game:drawing:submit { code, canvasData }  ->  { drawingId }
export function submitCanvasDrawing(code, canvasData) {
  return emitWithAck('game:drawing:submit', { code, canvasData })
}

// game:capture:submit { code, dataUrl }  ->  { drawingId }   (photo rooms, capture phase)
export function submitCapture(code, dataUrl) {
  return emitWithAck('game:capture:submit', { code, dataUrl })
}

// game:vote:submit { code, drawingId }  ->  {}   (drawingId is the entry's publicId)
export function submitVote(code, drawingId) {
  return emitWithAck('game:vote:submit', { code, drawingId })
}