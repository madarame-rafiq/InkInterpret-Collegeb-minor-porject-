// useGameState: the authoritative game snapshot for a room.
//
// Source of truth: GET /api/rooms/:code/game (via fetchGameState).
//
// Socket events are NOTIFICATIONS only. The audit found their payloads are
// inconsistent (game:phase is sometimes {phase, phaseEndsAt}, sometimes a full
// snapshot; game:prompt:missed is emitted twice with different shapes; and
// `isYou` in broadcast snapshots is computed for the wrong user). So no
// snapshot is ever built from an event: each one triggers a refetch.
//
// Returns:
//   game         – latest snapshot, or null (no game, or not loaded yet)
//   status       – 'loading' | 'ready' | 'error'
//                  ('ready' + game === null means the server said "no game")
//   error        – message when status === 'error'
//   notice       – { round, message } from game:prompt:missed, or null
//   abortReason  – reason from game:aborted, or null
//   sync         – quiet refetch; resolves when it has settled
//   retry        – refetch with a visible loading state

import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../../lib/api.js'
import { getSocket } from '../../lib/socket.js'
import { fetchGameState } from './gameApi.js'

// Events whose payloads are ignored; they only mean "re-read the state".
const REFRESH_EVENTS = ['game:started', 'game:phase', 'game:results', 'game:finished']

const PHASE_ORDER = ['prompt', 'drawing', 'capture', 'voting', 'result']

// A monotonic "how far along is this game" number, used to refuse a snapshot
// that would move the same game backwards (e.g. two requests answered out of
// order by the server).
function progress(game) {
  if (game.status !== 'active') return Number.MAX_SAFE_INTEGER
  const round = game.round?.number ?? 0
  return round * 10 + Math.max(PHASE_ORDER.indexOf(game.phase), 0)
}

function isOlder(next, current) {
  return Boolean(current) && next.id === current.id && progress(next) < progress(current)
}

export function useGameState({ code, socketStatus }) {
  const [game, setGame] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)
  const [abortReason, setAbortReason] = useState(null)

  const gameRef = useRef(null) // last committed snapshot, for the ordering guard
  const latestRequestRef = useRef(0) // only the most recently issued request may commit
  const controllerRef = useRef(null)

  const sync = useCallback(
    async ({ silent = true } = {}) => {
      if (!code) return

      // A new request supersedes any in-flight one. Rapid events collapse into
      // a single result, and a slow, outdated response can never win.
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      const requestId = latestRequestRef.current + 1
      latestRequestRef.current = requestId

      if (!silent) {
        setStatus('loading')
        setError('')
      }

      try {
        const next = await fetchGameState(code, controller.signal)
        if (requestId !== latestRequestRef.current) return

        if (next && isOlder(next, gameRef.current)) {
          // Same game, but this snapshot is behind what we already show.
          setStatus('ready')
          setError('')
          return
        }

        gameRef.current = next
        setGame(next)
        setStatus('ready')
        setError('')
      } catch (err) {
        if (err.name === 'AbortError' || requestId !== latestRequestRef.current) return
        // Keep the last snapshot (if any); the caller decides how to show this.
        setError(getErrorMessage(err, 'Could not load the game state.'))
        setStatus('error')
      }
    },
    [code],
  )

  // Initial snapshot (also covers a page refresh in the middle of a game).
  useEffect(() => {
    sync()
    return () => controllerRef.current?.abort()
  }, [sync])

  // (Re)joined the room channel: initially, and after every reconnect. Events
  // sent while we were disconnected are gone, so re-read the truth.
  useEffect(() => {
    if (socketStatus === 'joined') {
      sync()
    }
  }, [socketStatus, sync])

  // Server notifications. Handlers are removed individually, so listeners owned
  // by other hooks (chat, room access) are never touched.
  useEffect(() => {
    if (!code) return undefined

    const socket = getSocket()

    const onRefresh = () => {
      sync()
    }

    const onPromptMissed = (payload) => {
      // The first emission carries { round, message }; the second is a full
      // snapshot with no message. Only the former is kept as a notice.
      if (typeof payload?.message === 'string') {
        setNotice({ round: payload.round, message: payload.message })
      }
      sync()
    }

    const onAborted = (payload) => {
      setAbortReason(typeof payload?.reason === 'string' ? payload.reason : null)
      sync()
    }

    REFRESH_EVENTS.forEach((event) => socket.on(event, onRefresh))
    socket.on('game:prompt:missed', onPromptMissed)
    socket.on('game:aborted', onAborted)

    return () => {
      REFRESH_EVENTS.forEach((event) => socket.off(event, onRefresh))
      socket.off('game:prompt:missed', onPromptMissed)
      socket.off('game:aborted', onAborted)
    }
  }, [code, sync])

  const retry = useCallback(() => sync({ silent: false }), [sync])

  return { game, status, error, notice, abortReason, sync, retry }
}