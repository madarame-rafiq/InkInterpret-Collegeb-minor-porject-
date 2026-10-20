import { ApiError, getErrorMessage } from '../../lib/api.js'

// ---- Options and defaults (mirror the backend's create-room rules) ----------

const range = (start, end, step = 1) =>
  Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step)

export const DEFAULT_SETTINGS = {
  maxPlayers: 6,
  drawingDuration: 60,
  votingDuration: 30,
  inputMode: 'canvas',
}

export const PLAYER_OPTIONS = range(3, 10)
export const DRAWING_OPTIONS = range(30, 180, 15) // backend requires steps of 15
export const VOTING_OPTIONS = range(15, 90, 15) // backend allows any 15-90; steps of 15 keep the list short

export const INPUT_MODES = [
  { value: 'canvas', label: 'Canvas', description: 'Draw digitally in the browser.' },
  { value: 'photo', label: 'Photo', description: 'Draw on paper, then capture a photo.' },
]

// ---- Labels ----------------------------------------------------------------

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

export function formatSeconds(seconds) {
  return `${seconds} seconds`
}

export function formatInputMode(mode) {
  return INPUT_MODES.find((item) => item.value === mode)?.label ?? capitalize(String(mode))
}

// Only "waiting" is documented, so unknown statuses are shown as returned
// rather than being relabelled as something the data doesn't say.
export function formatStatus(status) {
  if (status === 'waiting') return 'Waiting'
  return capitalize(String(status).replace(/_/g, ' '))
}

export function formatRole(role) {
  if (role === 'host') return 'Host'
  if (role === 'player') return 'Player'
  return capitalize(String(role))
}

// ---- Validation (the server stays authoritative) ---------------------------

// Returns { field: message } with '' for valid fields.
export function validateRoomSettings(values) {
  const { maxPlayers, drawingDuration, votingDuration, inputMode } = values
  return {
    maxPlayers:
      Number.isInteger(maxPlayers) && maxPlayers >= 3 && maxPlayers <= 10
        ? ''
        : 'Choose 3–10 players.',
    drawingDuration:
      Number.isInteger(drawingDuration) &&
      drawingDuration >= 30 &&
      drawingDuration <= 180 &&
      drawingDuration % 15 === 0
        ? ''
        : 'Choose 30–180 seconds in steps of 15.',
    votingDuration:
      Number.isInteger(votingDuration) && votingDuration >= 15 && votingDuration <= 90
        ? ''
        : 'Choose 15–90 seconds.',
    inputMode: INPUT_MODES.some((mode) => mode.value === inputMode)
      ? ''
      : 'Choose canvas or photo.',
  }
}

// Room codes are uppercase letters and digits. Applied as the person types.
export function normalizeRoomCode(raw) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
}

export function validateRoomCode(raw) {
  const code = raw.trim().toUpperCase()
  if (!code) return 'Enter a room code.'
  if (!/^[A-Z0-9]+$/.test(code)) return 'Room codes use letters and numbers only.'
  if (code.length < 6 || code.length > 8) return 'Room codes are 6–8 characters.'
  return ''
}

// ---- Error wording ---------------------------------------------------------

// Shared wording for failures. An expired session is reported honestly;
// this never touches the session or cookie itself.
export function describeError(error, fallback) {
  if (error instanceof ApiError && error.status === 401) {
    return 'Your session has expired. Log in again to continue.'
  }
  return getErrorMessage(error, fallback)
}

const JOIN_MESSAGES = {
  ROOM_NOT_FOUND: 'No room matches that code. Check it and try again.',
  ROOM_NOT_JOINABLE: 'That room is no longer accepting players.',
  ALREADY_IN_ROOM: 'You’re already in that room.',
  ROOM_FULL: 'That room is full.',
}

export function joinErrorMessage(error) {
  if (error instanceof ApiError && JOIN_MESSAGES[error.code]) {
    return JOIN_MESSAGES[error.code]
  }
  return describeError(error, 'Could not join the room. Please try again.')
}