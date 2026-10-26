// RoomPage: the top-level page for /rooms/:code.
//
//   RoomPage (keyed by code, so switching rooms resets all state)
//   └── RoomSession
//       ├── useRoomData   – room + members over HTTP, kept current by refresh()
//       ├── useRoomSocket – joins the room channel, handles access revocation
//       ├── useChat       – ONE chat state for the whole room
//       ├── useGameState  – authoritative game snapshot (HTTP + notifications)
//       └── RoomLayout    – header + main area + persistent ChatPanel
//           └── main      – lobby | game phase | loading | error

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext.js'
import { getErrorMessage } from '../../lib/api.js'
import { useRoomData } from './useRoomData.js'
import { useRoomSocket } from './useRoomSocket.js'
import { useChat } from './useChat.js'
import { useGameState } from './useGameState.js'
import { leaveRoom } from './roomApi.js'
import { startGame } from './gameApi.js'
import RoomLayout from './RoomLayout.jsx'
import LobbyView from './LobbyView.jsx'
import GamePhaseView from './GamePhaseView.jsx'
import Button from '../../components/ui/Button.jsx'
import PageLoader from '../../components/ui/PageLoader.jsx'

// The lobby has no server event for membership changes, so while it is on
// screen the member list is refreshed at a modest interval (and on focus).
const LOBBY_REFRESH_MS = 8000

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

// A boxed message for the main area while the game state is loading or failed.
function MainNotice({ title, message, onRetry }) {
  return (
    <div
      role={onRetry ? 'alert' : 'status'}
      className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-5 py-4"
    >
      <p
        className={`font-display text-xl font-medium ${onRetry ? '' : 'motion-safe:animate-pulse'}`}
      >
        {title}
      </p>
      {message && <p className="mt-2 text-sm text-ink-soft">{message}</p>}
      {onRetry && (
        <Button size="sm" variant="secondary" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

function RoomSession({ code }) {
  const roomCode = code.toUpperCase()
  const navigate = useNavigate()
  const { user } = useAuth()

  // ── Data and realtime ────────────────────────────────────────────────────
  const { room, members, status, error, refresh: refreshRoom, retry } = useRoomData(roomCode)

  const [revokedPayload, setRevokedPayload] = useState(null)
  const handleAccessRevoked = useCallback((payload) => {
    setRevokedPayload(payload)
  }, [])

  const { socketStatus, socketError } = useRoomSocket({
    code: roomCode,
    onAccessRevoked: handleAccessRevoked,
  })

  // One chat state for the entire room, whatever is in the main area.
  const chat = useChat({ code: roomCode, socketStatus })

  const {
    game,
    status: gameStatus,
    error: gameError,
    notice,
    abortReason,
    sync: syncGame,
    retry: retryGame,
  } = useGameState({ code: roomCode, socketStatus })

  // ── What to show in the main area ────────────────────────────────────────
  // A finished or aborted game stays "latest" on the server, so the player
  // chooses to leave its summary. That choice is local UI state only.
  const [dismissedGameId, setDismissedGameId] = useState(null)
  const gameIsOver = Boolean(game) && game.status !== 'active'
  const showLobby = !game || (gameIsOver && game.id === dismissedGameId)

  // ── Keeping room data current ────────────────────────────────────────────
  // Rejoined the channel (initial join or reconnect): re-read members.
  useEffect(() => {
    if (socketStatus === 'joined') {
      refreshRoom()
    }
  }, [socketStatus, refreshRoom])

  // Returning to the tab: re-read both members and the game.
  useEffect(() => {
    function onReturn() {
      if (document.visibilityState === 'visible') {
        refreshRoom()
        syncGame()
      }
    }
    document.addEventListener('visibilitychange', onReturn)
    window.addEventListener('focus', onReturn)
    return () => {
      document.removeEventListener('visibilitychange', onReturn)
      window.removeEventListener('focus', onReturn)
    }
  }, [refreshRoom, syncGame])

  // The room's own status changes when a game starts or ends; re-read it then.
  const gameKey = game ? `${game.id}:${game.status}` : 'none'
  const previousGameKeyRef = useRef(gameKey)
  useEffect(() => {
    if (previousGameKeyRef.current !== gameKey) {
      previousGameKeyRef.current = gameKey
      refreshRoom()
    }
  }, [gameKey, refreshRoom])

  // Lobby only: a modest interval, skipped while the tab is hidden.
  const lobbyIsVisible = status === 'ready' && gameStatus === 'ready' && showLobby
  useEffect(() => {
    if (!lobbyIsVisible) return undefined
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refreshRoom()
    }, LOBBY_REFRESH_MS)
    return () => clearInterval(id)
  }, [lobbyIsVisible, refreshRoom])

  // ── Start game (host) ────────────────────────────────────────────────────
  const [startState, setStartState] = useState({ status: 'idle', error: '' })
  const startingRef = useRef(false)

  const handleStart = useCallback(async () => {
    if (startingRef.current) return
    startingRef.current = true
    setStartState({ status: 'starting', error: '' })

    try {
      await startGame(roomCode)
      // Nothing is assumed about the new game. Read the authoritative state;
      // the game:started notification triggers the same read for everyone.
      await syncGame()
      setStartState({ status: 'idle', error: '' })
    } catch (err) {
      setStartState({
        status: 'error',
        error: getErrorMessage(err, 'Could not start the game. Please try again.'),
      })
      // The refusal may mean our view is stale (e.g. host changed).
      refreshRoom()
    } finally {
      startingRef.current = false
    }
  }, [roomCode, syncGame, refreshRoom])

  // ── Leave ────────────────────────────────────────────────────────────────
  const leaveTimerRef = useRef(null)
  useEffect(() => () => clearTimeout(leaveTimerRef.current), [])

  const handleLeave = useCallback(async () => {
    await leaveRoom(roomCode)
    // The backend emits room:access_revoked to our socket, which sets
    // revokedPayload. As a fallback, show the left-room screen if it hasn't
    // arrived within a short window.
    clearTimeout(leaveTimerRef.current)
    leaveTimerRef.current = setTimeout(() => {
      setRevokedPayload((prev) => prev ?? { code: 'ROOM_LEFT', message: 'You have left this room.' })
    }, 2000)
  }, [roomCode])

  // ── Render guards ────────────────────────────────────────────────────────
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

  // ── Main area, chosen from server state ──────────────────────────────────
  let content = null
  if (gameStatus === 'loading') {
    // Don't flash the lobby before we know whether a game is running.
    content = <MainNotice title="Checking for a game…" />
  } else if (gameStatus === 'error' && !game) {
    // A failed read is not "no game". Say so and offer a retry.
    content = (
      <MainNotice
        title="Couldn’t load the game state."
        message={gameError}
        onRetry={retryGame}
      />
    )
  } else if (showLobby) {
    content =
      room && members ? (
        <LobbyView
          room={room}
          members={members}
          currentUser={user}
          onLeave={handleLeave}
          onStart={handleStart}
          startState={startState}
        />
      ) : null
  } else {
    content = (
      <GamePhaseView
        game={game}
        notice={notice}
        abortReason={abortReason}
        inputMode={room?.input_mode}
        roomCode={roomCode}
        syncError={gameStatus === 'error' ? gameError : ''}
        onRetrySync={retryGame}
        onRefreshGame={syncGame}
        onReturnToLobby={() => setDismissedGameId(game.id)}
      />
    )
  }

  // The canvas wants more room than the text-based phases.
    // The canvas and the artwork galleries want more room than the text phases.
  const roundMode = game?.inputMode ?? room?.input_mode
  const wideMain =
    !showLobby &&
    Boolean(game) &&
    ((game.phase === 'drawing' && roundMode !== 'photo') ||
      ['voting', 'result', 'finished'].includes(game.phase))

  return (
    <RoomLayout
      code={roomCode}
      socketStatus={socketStatus}
      socketError={socketError}
      chat={chat}
      currentUser={user}
      wide={wideMain}
    >
      {content}
    </RoomLayout>
  )
}

export default function RoomPage() {
  const { code } = useParams()
  // Keyed by code: switching rooms discards every hook's state and chat history.
  return <RoomSession key={code?.toUpperCase()} code={code ?? ''} />
}