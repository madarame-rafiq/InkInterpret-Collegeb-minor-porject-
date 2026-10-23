// RoomPage: the top-level page for /rooms/:code.
//
// Architecture:
//   RoomPage
//   ├── useRoomData          – HTTP fetch of room + members
//   ├── useRoomSocket        – socket join + access_revoked handler
//   ├── RoomLayout (shell)   – header, two-column grid, persistent ChatPanel
//   │   ├── main content area → phase-specific view (LobbyView now)
//   │   └── ChatPanel
//   └── handles loading / error / not-found / access-revoked states

import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext.js'
import { useRoomData } from './useRoomData.js'
import { useRoomSocket } from './useRoomSocket.js'
import { leaveRoom } from './roomApi.js'
import LobbyView from './LobbyView.jsx'
import ChatPanel from './ChatPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Logo from '../../components/brand/Logo.jsx'
import CopyCodeButton from '../dashboard/CopyCodeButton.jsx'
import PageLoader from '../../components/ui/PageLoader.jsx'
import { MessageSquare } from 'lucide-react'

// ── Access-revoked overlay ────────────────────────────────────────────────────
function AccessRevokedBanner({ payload, onBackToDashboard }) {
  const isDeleted = payload?.code === 'ROOM_DELETED'
  return (
    <div className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
          {isDeleted ? 'Room deleted' : 'You have left'}
        </p>
        <h1 className="mt-3 text-balance font-display text-3xl font-medium leading-tight tracking-tight">
          {payload?.message ?? (isDeleted ? 'This room no longer exists.' : 'You have left this room.')}
        </h1>
        <div className="mt-8">
          <Button onClick={onBackToDashboard}>Back to dashboard</Button>
        </div>
      </div>
    </div>
  )
}

// ── Room error / not-found states ─────────────────────────────────────────────
function RoomError({ status, error, onRetry }) {
  const navigate = useNavigate()

  if (status === 'not_found') {
    return (
      <div className="grid min-h-dvh place-items-center px-5 py-10">
        <div className="w-full max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
            Not found
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight">
            Room not found or you're not a member.
          </h1>
          <p className="mt-4 text-sm text-ink-soft">
            The room code may be invalid, or you may not have joined this room.
          </p>
          <div className="mt-8">
            <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'forbidden') {
    return (
      <div className="grid min-h-dvh place-items-center px-5 py-10">
        <div className="w-full max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
            Session expired
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight">
            Your session has expired.
          </h1>
          <p className="mt-4 text-sm text-ink-soft">Please log in again.</p>
          <div className="mt-8">
            <Button onClick={() => navigate('/login')}>Log in</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
          Error
        </p>
        <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight">
          Could not load the room.
        </h1>
        <p
          role="alert"
          className="mt-4 border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
        >
          {error}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onRetry}>Try again</Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main RoomPage ──────────────────────────────────────────────────────────────
export default function RoomPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // HTTP data
  const { room, members, status, error, refresh, retry } = useRoomData(code)

  // Access revocation state
  const [revokedPayload, setRevokedPayload] = useState(null)

  const handleAccessRevoked = useCallback((payload) => {
    setRevokedPayload(payload)
  }, [])

  // Socket lifecycle
  const { socketStatus, socketError } = useRoomSocket({
    code: code?.toUpperCase(),
    onAccessRevoked: handleAccessRevoked,
  })

  // Mobile chat panel toggle
  const [chatOpen, setChatOpen] = useState(false)

  // ── Leave ────────────────────────────────────────────────────────────────
  const handleLeave = useCallback(async () => {
    await leaveRoom(code)
    // The backend will emit room:access_revoked to our socket, which sets
    // revokedPayload. As a fallback, navigate to dashboard if it hasn't fired
    // within a short window.
    setTimeout(() => {
      setRevokedPayload((prev) => prev ?? { code: 'ROOM_LEFT', message: 'You have left this room.' })
    }, 2000)
  }, [code])

  // ── Render guards ─────────────────────────────────────────────────────────
  if (revokedPayload) {
    return (
      <AccessRevokedBanner
        payload={revokedPayload}
        onBackToDashboard={() => navigate('/dashboard')}
      />
    )
  }

  if (status === 'loading') {
    return <PageLoader label="Loading room…" />
  }

  if (status === 'not_found' || status === 'forbidden' || status === 'error') {
    return <RoomError status={status} error={error} onRetry={retry} />
  }

  // ── Full room layout ──────────────────────────────────────────────────────
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Room header */}
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-6 w-px bg-ink/20 sm:block" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-medium tracking-[0.1em]">
                {code?.toUpperCase()}
              </span>
              <CopyCodeButton code={code?.toUpperCase() ?? ''} />
            </div>
          </div>

          {/* Mobile: open chat button */}
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            aria-label="Open chat"
            className="inline-flex items-center gap-2 rounded-control border-2 border-ink px-3 py-1.5 text-sm font-semibold hover:bg-ink hover:text-paper lg:hidden"
          >
            <MessageSquare className="size-4" aria-hidden="true" />
            Chat
          </button>
        </div>
      </header>

      {/* Two-column layout: main content + persistent chat */}
      <div className="relative flex flex-1">
        {/* Main content area — lobby, drawing, or voting will slot in here */}
        <main className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:py-10">
          <div className="mx-auto max-w-2xl">
            {room && members && (
              <LobbyView
                room={room}
                members={members}
                currentUser={user}
                onLeave={handleLeave}
              />
            )}
          </div>
        </main>

        {/* Persistent chat panel — right column on desktop, overlay on mobile */}
        <div className="hidden lg:flex lg:w-80 lg:shrink-0 lg:flex-col lg:border-l-2 lg:border-ink">
          <ChatPanel
            code={code?.toUpperCase()}
            socketStatus={socketStatus}
            currentUser={user}
            isOpen={true}
            onClose={() => {}}
          />
        </div>

        {/* Mobile chat overlay */}
        {chatOpen && (
          <ChatPanel
            code={code?.toUpperCase()}
            socketStatus={socketStatus}
            currentUser={user}
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
          />
        )}
      </div>

      {/* Socket connection warning (non-blocking) */}
      {socketStatus === 'error' && (
        <div
          role="status"
          className="border-t-2 border-ink bg-paper px-5 py-2 text-center text-xs font-semibold text-ink-soft"
        >
          {socketError || 'Realtime connection lost. Trying to reconnect…'}
        </div>
      )}
    </div>
  )
}
