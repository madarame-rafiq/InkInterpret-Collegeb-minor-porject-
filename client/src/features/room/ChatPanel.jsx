// ChatPanel: persistent realtime chat, rendered once by RoomLayout.
//
// Chat state comes from the room page (useChat is called there, once), so
// there is a single message list and a single set of socket subscriptions no
// matter how the panel is shown (desktop column or mobile overlay) and no
// matter which game phase is on screen.
//
// Props:
//   chat          – the object returned by useChat()
//   socketStatus  – 'connecting' | 'joined' | 'error' | 'revoked'
//   currentUser   – { username } from AuthContext
//   isOpen        – mobile overlay visibility (desktop is always visible)
//   onClose       – close the mobile overlay

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, MessageSquare, Send, X } from 'lucide-react'

// Within this many pixels of the bottom counts as "reading the latest".
const BOTTOM_THRESHOLD_PX = 48

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
        {!isOwn && <span className="text-xs font-semibold text-ink">{message.username}</span>}
        <span className="text-xs text-ink-faint">{formatTime(message.createdAt)}</span>
        {isOwn && <span className="text-xs font-semibold text-ink">You</span>}
      </div>
      <div
        className={`max-w-[80%] break-words rounded-control border-2 px-3 py-2 text-sm ${
          isOwn ? 'border-ink bg-ink text-paper' : 'border-ink/30 bg-sheet text-ink'
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

export default function ChatPanel({ chat, socketStatus, currentUser, isOpen, onClose }) {
  const {
    messages,
    historyStatus,
    historyError,
    sendMessage,
    isSending,
    sendError,
    clearSendError,
    MAX_MESSAGE_LENGTH,
  } = chat

  const [draft, setDraft] = useState('')
  const [isAtBottom, setIsAtBottom] = useState(true)
  const listRef = useRef(null)
  // Whether new messages should pull the view down. True while the reader is
  // at the bottom; false once they scroll up to read older messages.
  const stickToBottomRef = useRef(true)

  function handleScroll() {
    const el = listRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD_PX
    stickToBottomRef.current = atBottom
    setIsAtBottom(atBottom)
  }

  // New messages, finished history load, or the overlay opening: follow the
  // conversation only if the reader hasn't scrolled away from it.
  useEffect(() => {
    const el = listRef.current
    if (el && stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, historyStatus, isOpen])

  function jumpToLatest() {
    const el = listRef.current
    stickToBottomRef.current = true
    setIsAtBottom(true)
    if (el) el.scrollTop = el.scrollHeight
  }

  function handleSend() {
    const trimmed = draft.trim()
    if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH || isSending) return
    // Your own message should always bring you to the bottom.
    stickToBottomRef.current = true
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
      className={`fixed inset-0 z-30 flex-col border-2 border-ink bg-sheet lg:static lg:inset-auto lg:z-auto lg:min-h-0 lg:flex-1 lg:border-0 ${
        isOpen ? 'flex' : 'hidden lg:flex'
      }`}
    >
      {/* Panel header */}
      <div className="flex shrink-0 items-center justify-between border-b-2 border-ink px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-ink-soft" aria-hidden="true" />
          <span className="text-sm font-semibold">Chat</span>
          {isConnecting && <span className="text-xs text-ink-faint">(reconnecting…)</span>}
        </div>
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
      <div className="relative min-h-0 flex-1">
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-4 py-3"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          <HistoryStatus status={historyStatus} error={historyError} />

          {historyStatus === 'ready' && messages.length === 0 && (
            <p className="py-4 text-center text-xs text-ink-faint">No messages yet. Say hello!</p>
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
        </div>

        {!isAtBottom && messages.length > 0 && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="absolute bottom-3 right-4 inline-flex items-center gap-1.5 rounded-control border-2 border-ink bg-paper px-3 py-1.5 text-xs font-semibold shadow-stamp hover:bg-ink hover:text-paper"
          >
            <ArrowDown className="size-3.5" aria-hidden="true" />
            Jump to latest
          </button>
        )}
      </div>

      {/* Send error */}
      {sendError && (
        <p
          role="alert"
          className="mx-4 mb-1 shrink-0 border-2 border-l-[4px] border-ink border-l-vermilion bg-paper px-3 py-2 text-xs font-semibold"
        >
          {sendError}
        </p>
      )}

      {/* Revoked state / compose area */}
      {isRevoked ? (
        <div className="shrink-0 border-t-2 border-ink px-4 py-3">
          <p className="text-xs text-ink-faint">Chat is no longer available.</p>
        </div>
      ) : (
        <div className="shrink-0 border-t-2 border-ink p-3">
          <div className="flex gap-2">
            <textarea
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