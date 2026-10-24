// Singleton Socket.IO client. A single connection is shared across the entire
// app — creating one per component mount would multiply connections against
// the same session.
//
// The socket connects lazily on the first getSocket() call. Subsequent calls
// return the same instance without reconnecting.
//
// The backend Socket.IO server reads the session cookie for authentication, so
// we send credentials and point at the same origin the Vite proxy forwards to.

import { io } from 'socket.io-client'

let socket = null

// Returns the shared socket, creating it on the first call.
export function getSocket() {
  if (!socket) {
    socket = io('http://localhost:5001', {
      withCredentials: true,  // send the HTTP-only session cookie
      autoConnect: true,
    })
  }
  return socket
}

// Disconnects and destroys the singleton. Called on login and logout so the
// next connection is made under the current session, never a previous user's.
export function destroySocket() {
  if (socket) {
    // This instance is being discarded, so every listener on it belongs to a
    // lifecycle that is ending. Removing them stops stale callbacks from
    // firing after the disconnect below.
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}