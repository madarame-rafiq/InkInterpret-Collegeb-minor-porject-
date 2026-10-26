import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Check, ImagePlus, Send } from 'lucide-react'
import { ApiError } from '../../lib/api.js'
import Button from '../../components/ui/Button.jsx'
import { useSecondsRemaining } from './useCountdown.js'
import { submitCapture } from './gameApi.js'
import { ACCEPT_ATTRIBUTE, prepareImage } from './photoPrep.js'
import { readSubmission, writeSubmission } from './drawingMarkers.js'

// Same safety margin as the canvas: one automatic send just before the
// deadline, but only when a photo has been chosen and previewed.
const AUTO_SUBMIT_SECONDS = 4

function describeError(error) {
  if (!(error instanceof ApiError)) return 'Could not send your photo. Please try again.'
  switch (error.code) {
    case 'PHASE_CLOSED':
      return 'Time ran out before your photo could be accepted.'
    case 'WRONG_INPUT_MODE':
      return 'This room draws on the canvas, so there is nothing to capture.'
    case 'INVALID_IMAGE':
      return 'The server couldn’t accept that image. Choose a different photo.'
    case 'IMAGE_TOO_LARGE':
      return 'That photo is too large. Choose a different one.'
    case 'ACK_TIMEOUT':
      // A timeout isn't a rejection: the photo may have arrived.
      return 'The server didn’t answer in time. Your photo may still have arrived; press Try again to check.'
    default:
      return error.message
  }
}

const tips = [
  'Use good, even light and keep the whole page in frame.',
  'Dark pen on white paper reads best.',
  'Hold the camera steady and straight above the page.',
]

export default function CaptureView({ roomCode, game, onRefreshGame }) {
  const { id: gameId, round, phaseEndsAt } = game

  // empty | preparing | ready — what the player has picked
  const [selection, setSelection] = useState({ status: 'empty', dataUrl: null, error: '' })
  // idle | sending | submitted | closed | error — what the server has said
  const [submit, setSubmit] = useState(() => ({
    status: readSubmission(gameId, round.number).submitted ? 'submitted' : 'idle',
    error: '',
  }))

  const libraryInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const preparationRef = useRef(0) // newest preparation wins; late results are ignored
  const lockRef = useRef(false)
  const autoAttemptedRef = useRef(false)
  const submitRef = useRef(null)

  const remaining = useSecondsRemaining(phaseEndsAt)
  const isLocked = submit.status === 'sending' || submit.status === 'submitted' || submit.status === 'closed'
  const isPreparing = selection.status === 'preparing'

  // Anything still being prepared when we leave must not touch state.
  useEffect(
    () => () => {
      preparationRef.current += 1
    },
    [],
  )

  async function handleFile(event) {
    const file = event.target.files?.[0]
    event.target.value = '' // lets the same file be picked again
    if (!file || isLocked) return

    const ticket = preparationRef.current + 1
    preparationRef.current = ticket
    setSelection((current) => ({ status: 'preparing', dataUrl: current.dataUrl, error: '' }))
    setSubmit((current) => (current.status === 'error' ? { status: 'idle', error: '' } : current))

    try {
      const { dataUrl } = await prepareImage(file)
      if (preparationRef.current !== ticket) return
      setSelection({ status: 'ready', dataUrl, error: '' })
    } catch (error) {
      if (preparationRef.current !== ticket) return
      // A bad pick never throws away a good earlier one.
      setSelection((current) => ({
        status: current.dataUrl ? 'ready' : 'empty',
        dataUrl: current.dataUrl,
        error: error.message,
      }))
    }
  }

  const handleSubmit = useCallback(async () => {
    if (lockRef.current || isLocked || isPreparing) return

    if (selection.status !== 'ready' || !selection.dataUrl) {
      setSubmit({ status: 'error', error: 'Choose or take a photo first.' })
      return
    }

    lockRef.current = true
    setSubmit({ status: 'sending', error: '' })

    try {
      const { drawingId } = await submitCapture(roomCode, selection.dataUrl)
      writeSubmission(gameId, round.number, drawingId)
      // Only now, after the server's acknowledgement, do we say it arrived.
      setSubmit({ status: 'submitted', error: '' })
    } catch (error) {
      if (error instanceof ApiError && error.code === 'DRAWING_ALREADY_SUBMITTED') {
        // An earlier send got through (e.g. its acknowledgement was lost).
        writeSubmission(gameId, round.number, null)
        setSubmit({ status: 'submitted', error: '' })
      } else if (error instanceof ApiError && error.code === 'PHASE_CLOSED') {
        setSubmit({ status: 'closed', error: describeError(error) })
        onRefreshGame()
      } else {
        setSubmit({ status: 'error', error: describeError(error) })
      }
    } finally {
      lockRef.current = false
    }
  }, [gameId, isLocked, isPreparing, onRefreshGame, round.number, roomCode, selection])

  useEffect(() => {
    submitRef.current = handleSubmit
  })

  // One automatic attempt just before the deadline, only with a chosen photo.
  useEffect(() => {
    if (
      remaining === null ||
      remaining === 0 ||
      remaining > AUTO_SUBMIT_SECONDS ||
      submit.status !== 'idle' ||
      selection.status !== 'ready' ||
      autoAttemptedRef.current
    ) {
      return undefined
    }
    autoAttemptedRef.current = true
    const id = setTimeout(() => submitRef.current?.(), 0)
    return () => clearTimeout(id)
  }, [remaining, submit.status, selection.status])

  // ── Accepted: waiting for everyone else ──
  if (submit.status === 'submitted') {
    return (
      <div role="status" className="space-y-4">
        <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-5 py-4">
          <p className="flex items-center gap-2 font-display text-xl font-medium leading-snug">
            <Check className="size-5" aria-hidden="true" />
            Your photo is in.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Waiting for the other players. The round moves on when the server’s timer ends.
          </p>
        </div>
        {selection.dataUrl && (
          <img
            src={selection.dataUrl}
            alt="Your submitted drawing"
            className="mx-auto block max-h-80 w-auto max-w-full border-2 border-ink"
          />
        )}
      </div>
    )
  }

  const isSending = submit.status === 'sending'
  const hasPhoto = Boolean(selection.dataUrl)
  const showSubmitError = submit.status === 'error' || submit.status === 'closed'

  return (
    <div className="space-y-4">
      {/* Hidden inputs, opened by the real buttons below */}
      <input
        ref={libraryInputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        onChange={handleFile}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        capture="environment"
        onChange={handleFile}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="grid gap-5 md:grid-cols-5">
        {/* Preview */}
        <div className="md:col-span-3">
          <div
            className={`relative aspect-[4/3] w-full overflow-hidden border-2 border-ink bg-sheet ${
              hasPhoto ? '' : 'border-dashed'
            }`}
          >
            {hasPhoto ? (
              <img
                src={selection.dataUrl}
                alt="Preview of the photo you will submit"
                className={`size-full object-contain ${isPreparing ? 'opacity-40' : ''}`}
              />
            ) : (
              <div className="grid size-full place-items-center p-6 text-center">
                <div>
                  <ImagePlus className="mx-auto size-8 text-ink-faint" aria-hidden="true" />
                  <p className="mt-3 font-display text-lg font-medium">No photo yet</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Your drawing will appear here before you send it.
                  </p>
                </div>
              </div>
            )}
            {isPreparing && (
              <p
                role="status"
                className="absolute inset-x-0 bottom-0 bg-ink px-3 py-2 text-center text-sm font-semibold text-paper"
              >
                Preparing your photo…
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 md:col-span-2">
          <div>
            <h2 className="font-display text-xl font-medium leading-snug">
              Photograph your drawing
            </h2>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-ink-soft">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span aria-hidden="true" className="text-vermilion-deep">
                    –
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* The camera shortcut only means something on touch devices */}
            <Button
              variant="secondary"
              size="sm"
              className="hidden pointer-coarse:inline-flex"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isLocked || isPreparing}
            >
              <Camera className="size-4" aria-hidden="true" />
              {hasPhoto ? 'Retake' : 'Take photo'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => libraryInputRef.current?.click()}
              disabled={isLocked || isPreparing}
            >
              <ImagePlus className="size-4" aria-hidden="true" />
              {hasPhoto ? 'Choose a different photo' : 'Choose photo'}
            </Button>
          </div>

          {selection.error && (
            <p
              role="alert"
              className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-3 py-2 text-sm font-semibold"
            >
              {selection.error}
            </p>
          )}

          {showSubmitError && (
            <p
              role="alert"
              className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-3 py-2 text-sm font-semibold"
            >
              {submit.error}
              {submit.status === 'error' && hasPhoto && ' Your photo is still selected.'}
            </p>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLocked || isPreparing || !hasPhoto}
            aria-busy={isSending}
          >
            <Send className="size-4" aria-hidden="true" />
            {isSending ? 'Sending…' : submit.status === 'error' ? 'Try again' : 'Submit photo'}
          </Button>

          <p role="status" className="text-sm text-ink-soft">
            {isSending
              ? 'Sending your photo…'
              : !hasPhoto
                ? 'Choose a photo to send.'
                : 'If time is nearly up, this photo is sent for you.'}
          </p>
        </div>
      </div>
    </div>
  )
}