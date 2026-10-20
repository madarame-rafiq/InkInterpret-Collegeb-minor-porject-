import { ApiError, apiFetch } from '../../lib/api.js'

function unexpectedResponse() {
  return new ApiError({
    status: 200,
    code: 'UNEXPECTED_RESPONSE',
    message: 'The server sent a response the app could not understand.',
  })
}

// GET /api/rooms -> data.rooms (snake_case, includes role and member_count)
export async function listRooms(signal) {
  const payload = await apiFetch('/api/rooms', { signal })
  const rooms = payload?.data?.rooms
  if (!Array.isArray(rooms)) throw unexpectedResponse()
  return rooms
}

// POST /api/rooms -> data.room (the inserted row: no role, no member_count)
export async function createRoom(settings) {
  const payload = await apiFetch('/api/rooms', { method: 'POST', body: settings })
  const room = payload?.data?.room
  if (!room) throw unexpectedResponse()
  return room
}

// POST /api/rooms/join -> data.room (camelCase: hostUserId, maxPlayers)
export async function joinRoom(code) {
  const payload = await apiFetch('/api/rooms/join', { method: 'POST', body: { code } })
  const room = payload?.data?.room
  if (!room) throw unexpectedResponse()
  return room
}