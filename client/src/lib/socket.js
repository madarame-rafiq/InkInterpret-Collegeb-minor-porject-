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

// Disconnects and destroys the singleton. Call this on sign-out so a fresh
// unauthenticated socket is not accidentally reused.
export function destroySocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
