import { ApiError, apiFetch } from '../../lib/api.js'

// Success responses are { status, data: { user } }. If that shape is ever
// missing, fail loudly here instead of crashing a component later.
function readUser(payload) {
  const user = payload?.data?.user
  if (!user) {
    throw new ApiError({
      status: 200,
      code: 'UNEXPECTED_RESPONSE',
      message: 'The server sent a response the app could not understand.',
    })
  }
  return user
}

export async function fetchCurrentUser(signal) {
  return readUser(await apiFetch('/api/auth/me', { signal }))
}

export async function register({ username, password }) {
  return readUser(
    await apiFetch('/api/auth/register', { method: 'POST', body: { username, password } }),
  )
}

export async function login({ username, password }) {
  return readUser(
    await apiFetch('/api/auth/login', { method: 'POST', body: { username, password } }),
  )
}

export async function logout() {
  await apiFetch('/api/auth/logout', { method: 'POST' })
}