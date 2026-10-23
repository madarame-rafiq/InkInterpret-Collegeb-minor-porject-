// useChat: manages persistent realtime chat for a room.
//
// Protocol (verified from server/src/socket/handlers/chatSocket.js):
//   - History:  socket.emit("chat:history", {code, limit?, before?}, ack)
//               ack → {status:"success", data:{messages, hasMore, nextCursor}}
//               ack → {status:"error", error:{code, message}}
//   - Send:     socket.emit("chat:send", {code, content}, ack)
//               ack → {status:"success", data:{message}}
//               ack → {status:"error", error:{code, message}}
//   - Receive:  socket.on("chat:message", message)
//               message shape: {id, userId, username, content, createdAt}
//
// Deduplication: messages are tracked by their `id` (UUID from PostgreSQL).
// The broadcast "chat:message" fires for ALL room members including the sender,
// so we rely solely on the broadcast and ignore the ack's message body to
// avoid inserting the same message twice.
//
// History/realtime race: we subscribe to "chat:message" BEFORE requesting
// history so we can't miss messages that arrive between the history ack and
// the listener being registered. Duplicates from the overlap are deduped by id.

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSocket } from '../../lib/socket.js'

const MAX_MESSAGE_LENGTH = 1000

export function useChat({ code, socketStatus }) {
  const [messages, setMessages] = useState([])
  const [historyStatus, setHistoryStatus] = useState('idle') // 'idle'|'loading'|'ready'|'error'
  const [historyError, setHistoryError] = useState('')
  const [sendError, setSendError] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Track seen IDs to deduplicate incoming messages.
  const seenIdsRef = useRef(new Set())

  // Add a message only if its id hasn't been seen yet.
  const addMessage = useCallback((msg) => {
    if (!msg?.id) return
    if (seenIdsRef.current.has(msg.id)) return
    seenIdsRef.current.add(msg.id)
    setMessages((prev) => [...prev, msg])
  }, [])

  // Load initial history. Called once the socket has joined the room channel.
  const loadHistory = useCallback(() => {
    if (!code) return
    const socket = getSocket()

    setHistoryStatus('loading')
    setHistoryError('')

    socket.emit('chat:history', { code, limit: 50 }, (response) => {
      if (response?.status === 'success') {
        const incoming = response.data?.messages ?? []
        // Bulk-add, deduplicated.
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id))
          const fresh = incoming.filter((m) => !existingIds.has(m.id))
          // Mark all incoming as seen.
          incoming.forEach((m) => seenIdsRef.current.add(m.id))
          // History arrives oldest-to-newest from the server, prepend before any
          // realtime messages that may have arrived during the load.
          return [...fresh, ...prev.filter((m) => !existingIds.has(m.id) || prev.includes(m))]
        })
        setHistoryStatus('ready')
      } else {
        const msg = response?.error?.message ?? 'Could not load chat history.'
        setHistoryError(msg)
        setHistoryStatus('error')
      }
    })
  }, [code])

  // Subscribe to realtime broadcasts and load history when the socket is ready.
  useEffect(() => {
    if (socketStatus !== 'joined' || !code) return

    const socket = getSocket()

    const handleMessage = (msg) => {
      addMessage(msg)
    }

    // Register the realtime listener BEFORE requesting history so we don't
    // miss messages that arrive between the history response and listener setup.
    socket.on('chat:message', handleMessage)

    loadHistory()

    return () => {
      socket.off('chat:message', handleMessage)
    }
  }, [socketStatus, code, addMessage, loadHistory])

  // Reset messages when the room code changes (navigating to a different room).
  useEffect(() => {
    setMessages([])
    seenIdsRef.current = new Set()
    setHistoryStatus('idle')
    setHistoryError('')
    setSendError('')
  }, [code])

  const sendMessage = useCallback(
    (content) => {
      const trimmed = content?.trim() ?? ''
      if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) return
      if (!code) return

      const socket = getSocket()

      setIsSending(true)
      setSendError('')

      socket.emit('chat:send', { code, content: trimmed }, (response) => {
        setIsSending(false)
        if (response?.status !== 'success') {
          const msg = response?.error?.message ?? 'Could not send message.'
          setSendError(msg)
        }
        // The broadcast "chat:message" delivers the persisted message to everyone
        // including the sender, so we do NOT add it here from the ack.
      })
    },
    [code],
  )

  const clearSendError = useCallback(() => setSendError(''), [])

  return {
    messages,
    historyStatus,
    historyError,
    sendMessage,
    isSending,
    sendError,
    clearSendError,
    MAX_MESSAGE_LENGTH,
  }
}
