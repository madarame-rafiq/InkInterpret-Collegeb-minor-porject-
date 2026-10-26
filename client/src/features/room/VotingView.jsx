import { useCallback, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { ApiError } from '../../lib/api.js'
import Button from '../../components/ui/Button.jsx'
import DrawingImage from './DrawingImage.jsx'
import { submitVote } from './gameApi.js'
import { readSubmission, readVote, writeSubmission, writeVote } from './drawingMarkers.js'

function describeError(error) {
  if (!(error instanceof ApiError)) return 'Could not send your vote. Please try again.'
  switch (error.code) {
    case 'PHASE_CLOSED':
      return 'Voting closed before your vote arrived.'
    case 'INVALID_DRAWING':
      return 'That drawing is no longer a voting option.'
    case 'ACK_TIMEOUT':
      return 'The server didn’t answer in time. Your vote may still have arrived; press Try again to check.'
    default:
      return error.message
  }
}

export default function VotingView({ roomCode, game, onRefreshGame }) {
  const { id: gameId, round, drawings } = game

  // Which entry is mine, if known. It's only used to avoid offering it as a
  // vote option; the server rejects self-votes regardless.
  const [ownId, setOwnId] = useState(() => readSubmission(gameId, round.number).drawingId)
  const [selected, setSelected] = useState(null)
  const [vote, setVote] = useState(() => {
    const prior = readVote(gameId, round.number)
    // idle | sending | voted | closed | error
    return { status: prior.voted ? 'voted' : 'idle', votedFor: prior.drawingId, error: '' }
  })
  const lockRef = useRef(false)

  const hasVoted = vote.status === 'voted'
  const isLocked = vote.status === 'sending' || hasVoted || vote.status === 'closed'

  const handleVote = useCallback(async () => {
    if (lockRef.current || isLocked) return
    if (!selected) {
      setVote({ status: 'error', votedFor: null, error: 'Pick a drawing first.' })
      return
    }

    lockRef.current = true
    setVote({ status: 'sending', votedFor: null, error: '' })

    try {
      await submitVote(roomCode, selected)
      // Only the server's acknowledgement counts as "voted".
      writeVote(gameId, round.number, selected)
      setVote({ status: 'voted', votedFor: selected, error: '' })
    } catch (error) {
      if (error instanceof ApiError && error.code === 'VOTE_ALREADY_SUBMITTED') {
        writeVote(gameId, round.number, null)
        setVote({ status: 'voted', votedFor: null, error: '' })
      } else if (error instanceof ApiError && error.code === 'SELF_VOTE') {
        // The server just told us which entry is mine.
        writeSubmission(gameId, round.number, selected)
        setOwnId(selected)
        setSelected(null)
        setVote({ status: 'error', votedFor: null, error: 'That one is your own drawing. Pick another.' })
      } else if (error instanceof ApiError && error.code === 'PHASE_CLOSED') {
        setVote({ status: 'closed', votedFor: null, error: describeError(error) })
        onRefreshGame()
      } else {
        if (error instanceof ApiError && error.code === 'INVALID_DRAWING') onRefreshGame()
        setVote({ status: 'error', votedFor: null, error: describeError(error) })
      }
    } finally {
      lockRef.current = false
    }
  }, [gameId, isLocked, onRefreshGame, round.number, roomCode, selected])

  // ── No entries ──
  if (drawings.length === 0) {
    return (
      <div className="border-2 border-dashed border-ink/40 px-5 py-6 text-center" role="status">
        <p className="font-display text-xl font-medium">No drawings to show.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Nothing was submitted in time, or the list hasn’t loaded yet.
        </p>
        <Button size="sm" variant="secondary" className="mt-4" onClick={onRefreshGame}>
          Refresh
        </Button>
      </div>
    )
  }

  const isSending = vote.status === 'sending'
  const showError = vote.status === 'error' || vote.status === 'closed'

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-display text-xl font-medium leading-snug">
          {hasVoted ? 'Your vote is in.' : 'Pick the drawing you like best.'}
        </p>
        <p className="text-sm leading-relaxed text-ink-soft">
          {hasVoted
            ? 'Waiting for everyone else. The artists are revealed in the results.'
            : 'Artists stay hidden until the results. You can’t vote for your own drawing, and a vote can’t be changed. Not voting before the timer ends costs 3 points.'}
        </p>
      </div>

      <fieldset disabled={isLocked && !hasVoted} className="min-w-0">
        <legend className="sr-only">Drawings to vote on</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {drawings.map((entry, index) => {
            const isOwn = entry.publicId === ownId
            const isChoice = hasVoted ? entry.publicId === vote.votedFor : false
            const disabled = isOwn || isLocked
            return (
              <label
                key={entry.publicId}
                className={`block ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <input
                  type="radio"
                  name="drawing-vote"
                  value={entry.publicId}
                  checked={selected === entry.publicId}
                  disabled={disabled}
                  onChange={() => {
                    setSelected(entry.publicId)
                    if (vote.status === 'error') setVote({ status: 'idle', votedFor: null, error: '' })
                  }}
                  className="peer sr-only"
                />
                <div
                  className={`border-2 bg-sheet transition-[transform,box-shadow] duration-150 peer-checked:-translate-x-px peer-checked:-translate-y-px peer-checked:border-ink peer-checked:shadow-stamp peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
                    isChoice ? 'border-ink shadow-stamp' : 'border-ink/40'
                  } ${hasVoted && !isChoice ? 'opacity-60' : ''}`}
                >
                  <DrawingImage entry={entry} alt={`Drawing ${index + 1}`} />
                  <div className="flex items-center justify-between gap-2 border-t-2 border-ink/20 px-3 py-2 text-sm">
                    <span className="font-semibold">Drawing {index + 1}</span>
                    {isOwn && (
                      <span className="border-2 border-ink px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.1em]">
                        Yours
                      </span>
                    )}
                    {isChoice && (
                      <span className="inline-flex items-center gap-1 border-2 border-ink bg-vermilion px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.1em]">
                        <Check className="size-3" aria-hidden="true" />
                        Your vote
                      </span>
                    )}
                  </div>
                </div>
              </label>
            )
          })}
        </div>
      </fieldset>

      {showError && (
        <p
          role="alert"
          className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
        >
          {vote.error}
        </p>
      )}

      {!hasVoted && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button
            onClick={handleVote}
            disabled={isLocked || !selected}
            aria-busy={isSending}
          >
            {isSending ? 'Sending vote…' : vote.status === 'error' && selected ? 'Try again' : 'Cast vote'}
          </Button>
          <p role="status" className="text-sm text-ink-soft">
            {isSending ? 'Sending your vote…' : selected ? 'Ready to vote.' : 'Select a drawing first.'}
          </p>
        </div>
      )}
    </div>
  )
}