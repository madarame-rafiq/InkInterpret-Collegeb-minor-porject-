import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Send } from 'lucide-react'
import { ApiError } from '../../lib/api.js'
import Button from '../../components/ui/Button.jsx'
import DrawingBoard from './DrawingBoard.jsx'
import { useDrawingBoard } from './useDrawingBoard.js'
import { useSecondsRemaining } from './useCountdown.js'
import { submitCanvasDrawing } from './gameApi.js'
import { readSubmission, writeSubmission } from './drawingMarkers.js'

// Send automatically this close to the deadline, so a drawing isn't lost if the
// player runs out the clock. The server still rejects anything past its own
// deadline, so this is a safety margin, not a rule.
const AUTO_SUBMIT_SECONDS = 4

function describeError(error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'PHASE_CLOSED':
        return 'Time ran out before your drawing could be accepted.'
      case 'WRONG_INPUT_MODE':
        return 'This room uses photo capture, not the canvas.'
      case 'ACK_TIMEOUT':
        return 'The server didn’t answer in time. Your drawing may still have arrived; press Try again to check.'
      default:
        return error.message
    }
  }
  return error?.message ?? 'Could not send your drawing. Please try again.'
}

export default function DrawingView({ roomCode, game, onRefreshGame }) {
  const { id: gameId, round, phaseEndsAt } = game

  const [submit, setSubmit] = useState(() => ({
    // idle | sending | submitted | closed | error
    status: readSubmission(gameId, round.number).submitted ? 'submitted' : 'idle',
    error: '',
    preview: null,
  }))
  const lockRef = useRef(false)
  const autoAttemptedRef = useRef(false)
  const submitRef = useRef(null)

  const isLocked = submit.status === 'sending' || submit.status === 'submitted' || submit.status === 'closed'
  const board = useDrawingBoard({ disabled: isLocked })
  const remaining = useSecondsRemaining(phaseEndsAt)

  const handleSubmit = useCallback(
    async ({ auto = false } = {}) => {
      if (lockRef.current || submit.status === 'submitted' || submit.status === 'closed') return

      if (!board.hasInk) {
        if (!auto) {
          setSubmit({ status: 'error', error: 'Draw something before you submit.', preview: null })
        }
        return
      }

      lockRef.current = true
      setSubmit({ status: 'sending', error: '', preview: null })

      try {
        const canvasData = board.exportDataUrl()
        const { drawingId } = await submitCanvasDrawing(roomCode, canvasData)
        writeSubmission(gameId, round.number, drawingId)
        setSubmit({ status: 'submitted', error: '', preview: canvasData })
      } catch (error) {
        if (error instanceof ApiError && error.code === 'DRAWING_ALREADY_SUBMITTED') {
          // An earlier send got through (e.g. its acknowledgement was lost).
          writeSubmission(gameId, round.number, null)
          setSubmit({ status: 'submitted', error: '', preview: null })
        } else if (error instanceof ApiError && error.code === 'PHASE_CLOSED') {
          setSubmit({ status: 'closed', error: describeError(error), preview: null })
          onRefreshGame()
        } else {
          // Anything else: keep the canvas exactly as it is and let them retry.
          setSubmit({ status: 'error', error: describeError(error), preview: null })
        }
      } finally {
        lockRef.current = false
      }
    },
    [board, gameId, onRefreshGame, round.number, roomCode, submit.status],
  )

  // Always call the latest submit handler from the timer effect below.
  useEffect(() => {
    submitRef.current = handleSubmit
  })

  // Safety net near the deadline: one automatic attempt, only if there's a drawing.
  useEffect(() => {
    if (
      remaining === null ||
      remaining === 0 ||
      remaining > AUTO_SUBMIT_SECONDS ||
      submit.status !== 'idle' ||
      !board.hasInk ||
      autoAttemptedRef.current
    ) {
      return undefined
    }
    autoAttemptedRef.current = true
    const id = setTimeout(() => submitRef.current?.({ auto: true }), 0)
    return () => clearTimeout(id)
  }, [remaining, submit.status, board.hasInk])

  // ── Already submitted: waiting state ──
  if (submit.status === 'submitted') {
    return (
      <div role="status" className="space-y-4">
        <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-5 py-4">
          <p className="flex items-center gap-2 font-display text-xl font-medium leading-snug">
            <Check className="size-5" aria-hidden="true" />
            Your drawing is in.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Waiting for the other players. The round moves on when the server’s timer ends.
          </p>
        </div>
        {submit.preview && (
          <img
            src={submit.preview}
            alt="Your submitted drawing"
            className="mx-auto block h-auto w-full max-w-sm border-2 border-ink"
          />
        )}
      </div>
    )
  }

  const isSending = submit.status === 'sending'
  const showError = submit.status === 'error' || submit.status === 'closed'

  return (
    <div className="space-y-3">
      <DrawingBoard board={board} disabled={isLocked} />

      {showError && (
        <p
          role="alert"
          className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
        >
          {submit.error}
          {submit.status === 'error' && ' Your drawing is still here.'}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button
          onClick={() => handleSubmit()}
          disabled={isLocked || !board.hasInk}
          aria-busy={isSending}
        >
          <Send className="size-4" aria-hidden="true" />
          {isSending ? 'Sending…' : submit.status === 'error' ? 'Try again' : 'Submit drawing'}
        </Button>

        <p role="status" className="text-sm text-ink-soft">
          {isSending
            ? 'Sending your drawing…'
            : !board.hasInk
              ? 'Draw something, then submit it.'
              : 'If time is nearly up, your drawing is sent for you.'}
        </p>
      </div>
    </div>
  )
}