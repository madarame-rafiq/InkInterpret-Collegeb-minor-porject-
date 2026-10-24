// RoomLayout: the persistent room shell.
//
//   ┌──────────────────────────────────────────┐
//   │ header: logo · room code · connection    │
//   ├────────────────────────────┬─────────────┤
//   │ main (changes by phase)    │ chat        │
//   └────────────────────────────┴─────────────┘
//
// The shell is fixed to the viewport height so the chat list scrolls
// internally. On small screens the chat is a full-screen overlay opened from
// the header; it's the same single ChatPanel instance on every breakpoint.

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import Logo from '../../components/brand/Logo.jsx'
import CopyCodeButton from '../dashboard/CopyCodeButton.jsx'
import ChatPanel from './ChatPanel.jsx'

export default function RoomLayout({
  code,
  socketStatus,
  socketError,
  chat,
  currentUser,
  children,
}) {
  const [chatOpen, setChatOpen] = useState(false)
  const isLive = socketStatus === 'joined'

  return (
    <div className="flex h-dvh flex-col">
      <header className="shrink-0 border-b-2 border-ink">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-6 w-px bg-ink/20 sm:block" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-medium tracking-[0.1em]">{code}</span>
              <CopyCodeButton code={code} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Reflects the real socket state. */}
            <p
              role="status"
              className="hidden items-center gap-2 text-xs font-semibold text-ink-soft sm:inline-flex"
            >
              <span
                aria-hidden="true"
                className={`size-2 border border-ink ${
                  isLive ? 'bg-vermilion' : 'bg-transparent motion-safe:animate-pulse'
                }`}
              />
              {isLive ? 'Live' : 'Connecting…'}
            </p>

            <button
              type="button"
              onClick={() => setChatOpen(true)}
              aria-label="Open chat"
              aria-expanded={chatOpen}
              className="inline-flex items-center gap-2 rounded-control border-2 border-ink px-3 py-1.5 text-sm font-semibold hover:bg-ink hover:text-paper lg:hidden"
            >
              <MessageSquare className="size-4" aria-hidden="true" />
              Chat
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:py-10">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>

        {/* `contents` on small screens: the wrapper adds no box, so the chat's
            own fixed overlay positioning applies. */}
        <div className="contents lg:flex lg:min-h-0 lg:w-80 lg:shrink-0 lg:flex-col lg:border-l-2 lg:border-ink xl:w-96">
          <ChatPanel
            chat={chat}
            socketStatus={socketStatus}
            currentUser={currentUser}
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
          />
        </div>
      </div>

      {socketStatus === 'error' && (
        <div
          role="status"
          className="shrink-0 border-t-2 border-ink bg-paper px-5 py-2 text-center text-xs font-semibold text-ink-soft"
        >
          {socketError || 'Realtime connection lost. Trying to reconnect…'}
        </div>
      )}
    </div>
  )
}