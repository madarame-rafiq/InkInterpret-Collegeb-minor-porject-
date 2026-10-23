// useRoomSocket: manages the socket connection lifecycle for a room.
//
// Responsibilities:
//   1. Joins the socket room channel via "room:join" after the socket connects.
//   2. Handles "room:access_revoked" by calling onAccessRevoked with the payload.
//   3. Tracks socket connection state.
//   4. Cleans up listeners correctly on unmount or room code change.
//
// The socket singleton is reused — this hook never creates a new connection.

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSocket } from '../../lib/socket.js'

// socketStatus: 'connecting' | 'joined' | 'error' | 'revoked'
export function useRoomSocket({ code, onAccessRevoked }) {
  const [socketStatus, setSocketStatus] = useState('connecting')
  const [socketError, setSocketError] = useState('')
  // Track whether we've already joined this channel so reconnects re-join.
  const hasJoinedRef = useRef(false)
  const codeRef = useRef(code)

  useEffect(() => {
    codeRef.current = code
  }, [code])

  const joinChannel = useCallback((socket) => {
    const currentCode = codeRef.current
    if (!currentCode) return

    socket.emit('room:join', { code: currentCode }, (response) => {
      if (response?.status === 'success') {
        hasJoinedRef.current = true
        setSocketStatus('joined')
        setSocketError('')
      } else {
        const msg = response?.error?.message ?? 'Could not join the room channel.'
        setSocketStatus('error')
        setSocketError(msg)
      }
    })
  }, [])

  useEffect(() => {
    if (!code) return

    const socket = getSocket()
    hasJoinedRef.current = false
    setSocketStatus('connecting')
    setSocketError('')

    // If already connected, join immediately; otherwise wait for connect.
    const handleConnect = () => {
      hasJoinedRef.current = false
      joinChannel(socket)
    }

    const handleRevoked = (payload) => {
      setSocketStatus('revoked')
      if (typeof onAccessRevoked === 'function') {
        onAccessRevoked(payload)
      }
    }

    const handleConnectError = () => {
      setSocketStatus('error')
      setSocketError('Connection lost. Trying to reconnect…')
    }

    const handleDisconnect = () => {
      // Don't immediately error — socket.io will try to reconnect.
      setSocketStatus('connecting')
    }

    socket.on('connect', handleConnect)
    socket.on('room:access_revoked', handleRevoked)
    socket.on('connect_error', handleConnectError)
    socket.on('disconnect', handleDisconnect)

    // If the socket is already connected, join now without waiting for 'connect'.
    if (socket.connected) {
      joinChannel(socket)
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('room:access_revoked', handleRevoked)
      socket.off('connect_error', handleConnectError)
      socket.off('disconnect', handleDisconnect)
    }
  }, [code, joinChannel, onAccessRevoked])

  return { socketStatus, socketError }
}
