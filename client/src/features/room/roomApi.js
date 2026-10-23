import { ApiError, apiFetch } from '../../lib/api.js'

function unexpectedResponse() {
  return new ApiError({
    status: 200,
    code: 'UNEXPECTED_RESPONSE',
    message: 'The server sent a response the app could not understand.',
  })
}

// GET /api/rooms/:code  (caller must be a member)
// Returns the room object (snake_case fields from DB + role).
export async function getRoom(code, signal) {
  const payload = await apiFetch(`/api/rooms/${encodeURIComponent(code)}`, { signal })
  const room = payload?.data?.room
  if (!room) throw unexpectedResponse()
  return room
}

// GET /api/rooms/:code/members  (caller must be a member)
// Returns array of { user_id, username, role, joined_at }.
export async function getRoomMembers(code, signal) {
  const payload = await apiFetch(`/api/rooms/${encodeURIComponent(code)}/members`, { signal })
  const members = payload?.data?.members
  if (!Array.isArray(members)) throw unexpectedResponse()
  return members
}

// DELETE /api/rooms/:code/members/me
// Returns { deleted, code, roomId }.
export async function leaveRoom(code) {
  const payload = await apiFetch(`/api/rooms/${encodeURIComponent(code)}/members/me`, {
    method: 'DELETE',
  })
  const data = payload?.data
  if (!data) throw unexpectedResponse()
  return data
}
