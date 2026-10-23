// ChatPanel: persistent realtime chat sidebar / bottom-sheet.
//
// Renders the message list and the compose field.
// Designed to be used inside RoomLayout on the right column.
//
// Props:
//   code          – room code (string)
//   socketStatus  – 'connecting' | 'joined' | 'error' | 'revoked'
//   currentUser   – { username } from AuthContext
//   isOpen        – whether the panel is visible (mobile toggle)
//   onClose       – called when the close button is pressed (mobile)

import { useEffect, useRef, useState } from 'react'
import { useChat } from './useChat.js'
import { MessageSquare, Send, X } from 'lucide-react'

// Format a UTC ISO timestamp to a compact local time string.
function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function ChatMessage({ message, isOwn }) {
  return (
    <div className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className="flex items-baseline gap-2">
        {!isOwn && (
          <span className="text-xs font-semibold text-ink">{message.username}</span>
        )}
        <span className="text-xs text-ink-faint">{formatTime(message.createdAt)}</span>
        {isOwn && (
          <span className="text-xs font-semibold text-ink">You</span>
        )}
      </div>
      <div
        className={`max-w-[80%] break-words rounded-control border-2 px-3 py-2 text-sm ${
          isOwn
            ? 'border-ink bg-ink text-paper'
            : 'border-ink/30 bg-sheet text-ink'
        }`}
      >
        {/* Rendered as text — never injected as HTML */}
        {message.content}
      </div>
    </div>
  )
}

function HistoryStatus({ status, error }) {
  if (status === 'loading') {
    return (
      <p className="py-4 text-center text-xs text-ink-faint" role="status">
        Loading messages…
      </p>
    )
  }
  if (status === 'error') {
    return (
      <p className="py-4 text-center text-xs font-semibold text-vermilion-deep" role="alert">
        {error}
      </p>
    )
  }
  return null
}

export default function ChatPanel({ code, socketStatus, currentUser, isOpen, onClose }) {
  const {
    messages,
    historyStatus,
    historyError,
    sendMessage,
    isSending,
    sendError,
    clearSendError,
    MAX_MESSAGE_LENGTH,
  } = useChat({ code, socketStatus })

  const [draft, setDraft] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to the bottom when new messages arrive.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const trimmed = draft.trim()
    if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH || isSending) return
    sendMessage(trimmed)
    setDraft('')
    clearSendError()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isRevoked = socketStatus === 'revoked'
  const isConnecting = socketStatus === 'connecting' || socketStatus === 'error'

  return (
    <aside
      aria-label="Room chat"
      className={`flex flex-col border-2 border-ink bg-sheet ${
        // Mobile: absolute overlay from the bottom, toggled by isOpen
        // Desktop: always visible as a flex column
        isOpen ? 'flex' : 'hidden lg:flex'
      } fixed inset-0 z-30 lg:static lg:z-auto lg:inset-auto`}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-ink-soft" aria-hidden="true" />
          <span className="text-sm font-semibold">Chat</span>
          {isConnecting && (
            <span className="text-xs text-ink-faint">(reconnecting…)</span>
          )}
        </div>
        {/* Close button — only shown on mobile */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-control border-2 border-ink p-1 hover:bg-ink hover:text-paper lg:hidden"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-3" role="log" aria-live="polite" aria-label="Chat messages">
        <HistoryStatus status={historyStatus} error={historyError} />

        {historyStatus === 'ready' && messages.length === 0 && (
          <p className="py-4 text-center text-xs text-ink-faint">
            No messages yet. Say hello!
          </p>
        )}

        <div className="space-y-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwn={msg.username === currentUser?.username}
            />
          ))}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Send error */}
      {sendError && (
        <p
          role="alert"
          className="mx-4 mb-1 border-2 border-l-[4px] border-ink border-l-vermilion bg-paper px-3 py-2 text-xs font-semibold"
        >
          {sendError}
        </p>
      )}

      {/* Revoked state */}
      {isRevoked ? (
        <div className="border-t-2 border-ink px-4 py-3">
          <p className="text-xs text-ink-faint">Chat is no longer available.</p>
        </div>
      ) : (
        /* Compose area */
        <div className="border-t-2 border-ink p-3">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (sendError) clearSendError()
              }}
              onKeyDown={handleKeyDown}
              placeholder={isConnecting ? 'Connecting…' : 'Message…'}
              disabled={isConnecting || isSending}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={1}
              aria-label="Chat message"
              className="flex-1 resize-none rounded-control border-2 border-ink bg-paper px-3 py-2 text-sm disabled:opacity-50"
              style={{ minHeight: '2.5rem', maxHeight: '6rem' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim() || isConnecting || isSending}
              aria-label="Send message"
              className="inline-flex items-center justify-center rounded-control border-2 border-ink px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-50"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </div>
          {draft.length > MAX_MESSAGE_LENGTH * 0.9 && (
            <p className="mt-1 text-right text-xs text-ink-faint">
              {draft.length}/{MAX_MESSAGE_LENGTH}
            </p>
          )}
        </div>
      )}
    </aside>
  )
}
