// One place that knows how to talk to the backend. Feature code gets either
// the parsed JSON body or a thrown ApiError. It never touches fetch directly.

export class ApiError extends Error {
  constructor({ status, code, message }) {
    super(message)
    this.name = 'ApiError'
    this.status = status // HTTP status, or 0 if the server was unreachable
    this.code = code // backend error code (e.g. USERNAME_TAKEN) or null
  }
}

function fallbackMessage(status) {
  if (status >= 500) return 'The server ran into a problem. Please try again in a moment.'
  if (status === 401) return 'You need to be signed in to do that.'
  return `The request failed (HTTP ${status}).`
}

// Reads the body as text first so an empty or non-JSON response
// (e.g. an HTML error page from the proxy) can never crash the app.
async function parseBody(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

// The contract gives an error code and a human-readable message but not where
// they sit in the JSON, so this accepts the two common layouts:
//   { error: { code, message } }   or   { code, message }
function readError(payload, status) {
  const nested = payload && typeof payload.error === 'object' ? payload.error : null
  const code = nested?.code ?? payload?.code ?? null
  const rawMessage =
    nested?.message ??
    (typeof payload?.error === 'string' ? payload.error : null) ??
    payload?.message

  return {
    code: typeof code === 'string' ? code : null,
    message:
      typeof rawMessage === 'string' && rawMessage ? rawMessage : fallbackMessage(status),
  }
}

export async function apiFetch(path, { method = 'GET', body, signal } = {}) {
  const headers = { Accept: 'application/json' }
  const init = {
    method,
    headers,
    signal,
    credentials: 'include', // send and accept the HTTP-only session cookie
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(path, init)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'Could not reach the server. Check your connection and try again.',
    })
  }

  const payload = await parseBody(response)

  if (!response.ok) {
    const { code, message } = readError(payload, response.status)
    throw new ApiError({ status: response.status, code, message })
  }

  return payload
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error instanceof ApiError ? error.message : fallback
}