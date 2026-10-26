// PromptView: the prompt phase.
//
// The designated prompt giver gets a form; everyone else waits. The phase,
// the 45-second deadline and who the giver is all come from the server (the
// countdown is rendered by GamePhaseView's header from `phaseEndsAt`).
//
// Submitting acknowledges with { phase, phaseEndsAt }, and the server also
// broadcasts game:phase. This view never switches phases itself: after the
// ack it asks the room to re-read the authoritative state, and that is what
// moves everyone on to drawing.

import { useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { ApiError } from '../../lib/api.js'
import Button from '../../components/ui/Button.jsx'
import TextField from '../../components/ui/TextField.jsx'
import { submitPrompt } from './gameApi.js'

const MAX_PROMPT_LENGTH = 500

// These mean our picture of the round is out of date; re-read the state.
const STALE_CODES = new Set(['PHASE_CLOSED', 'PROMPT_ALREADY_RESOLVED', 'PROMPT_GIVER_REQUIRED'])

function describeError(error) {
  if (!(error instanceof ApiError)) return 'Could not send your prompt. Please try again.'
  switch (error.code) {
    case 'PHASE_CLOSED':
      return 'The prompt window closed before your prompt arrived. The round is moving on.'
    case 'PROMPT_ALREADY_RESOLVED':
      return 'A prompt has already been recorded for this round.'
    case 'PROMPT_GIVER_REQUIRED':
      return 'Only the prompt giver can send a prompt.'
    default:
      return error.message
  }
}

function PromptForm({ roomCode, onRefreshGame }) {
  const [value, setValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [state, setState] = useState({ status: 'idle', error: '' }) // idle | sending | sent | closed | error
  const lockRef = useRef(false) // blocks a second submit before React re-renders

  const isBusy = state.status === 'sending' || state.status === 'sent' || state.status === 'closed'

  async function handleSubmit(event) {
    event.preventDefault()
    if (lockRef.current || isBusy) return

    const prompt = value.trim()
    if (!prompt) {
      setFieldError('Enter a prompt for everyone to draw.')
      return
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      setFieldError(`Keep it to ${MAX_PROMPT_LENGTH} characters or fewer.`)
      return
    }

    lockRef.current = true
    setFieldError('')
    setState({ status: 'sending', error: '' })

    try {
      await submitPrompt(roomCode, prompt)
      setState({ status: 'sent', error: '' })
      // The server's game:phase broadcast does this too; reading directly just
      // makes our own screen update without waiting for it.
      await onRefreshGame()
    } catch (error) {
      const stale = error instanceof ApiError && STALE_CODES.has(error.code)
      setState({ status: stale ? 'closed' : 'error', error: describeError(error) })
      if (stale) onRefreshGame()
    } finally {
      lockRef.current = false
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="border-2 border-ink bg-sheet p-5">
        <p className="font-display text-xl font-medium leading-snug">
          You’re the prompt giver this round.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Give everyone something to draw. You’ll draw it too.
        </p>

        <TextField
          className="mt-4"
          id="prompt"
          label="Your prompt"
          type="text"
          autoComplete="off"
          autoFocus
          maxLength={MAX_PROMPT_LENGTH}
          value={value}
          disabled={isBusy}
          onChange={(event) => {
            setValue(event.target.value)
            if (fieldError) setFieldError('')
          }}
          hint={`Up to ${MAX_PROMPT_LENGTH} characters.`}
          error={fieldError}
        />
      </div>

      {(state.status === 'error' || state.status === 'closed') && (
        <p
          role="alert"
          className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
        >
          {state.error}
        </p>
      )}

      <div role="status">
        {state.status === 'sent' && (
          <p className="text-sm font-semibold text-ink-soft">
            Prompt sent. Starting the drawing round…
          </p>
        )}
      </div>

      <Button type="submit" disabled={isBusy} aria-busy={state.status === 'sending'}>
        <Send className="size-4" aria-hidden="true" />
        {state.status === 'sending' ? 'Sending…' : state.status === 'sent' ? 'Prompt sent' : 'Send prompt'}
      </Button>
    </form>
  )
}

function WaitingForPrompt({ name }) {
  return (
    <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-5 py-4">
      <p className="font-display text-xl font-medium leading-snug">
        Waiting for {name ?? 'the prompt giver'} to write the prompt.
      </p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-soft">
        <p>Everyone draws every round, including the prompt giver.</p>
        <p>
          If no prompt arrives before the timer ends, the round goes ahead without one, and the
          server will let everyone know.
        </p>
      </div>
    </div>
  )
}

export default function PromptView({
  roomCode,
  isPromptGiver,
  promptGiverName,
  onRefreshGame,
}) {
  if (!isPromptGiver) return <WaitingForPrompt name={promptGiverName} />
  return <PromptForm roomCode={roomCode} onRefreshGame={onRefreshGame} />
}