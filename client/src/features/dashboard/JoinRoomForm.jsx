import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import TextField from '../../components/ui/TextField.jsx'
import { normalizeRoomCode, validateRoomCode } from './roomRules.js'

export default function JoinRoomForm({ onJoin, state, onClearFeedback }) {
  const [code, setCode] = useState('')
  const [touched, setTouched] = useState(false)
  const isSubmitting = state.status === 'submitting'
  const canSubmit = code.length >= 6

  // Inline feedback appears after the field is left, and only for a non-empty code.
  const clientError = touched && code ? validateRoomCode(code) : ''

  function handleChange(event) {
    setCode(normalizeRoomCode(event.target.value))
    if (state.status !== 'idle') onClearFeedback()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    if (validateRoomCode(code)) {
      setTouched(true)
      return
    }

    const joined = await onJoin(code)
    if (joined) {
      setCode('')
      setTouched(false)
    }
  }

  return (
    <section
      id="join-room"
      aria-labelledby="join-heading"
      className="border-t-2 border-ink pt-6"
    >
      <h2 id="join-heading" className="font-display text-2xl font-medium tracking-tight">
        Join with a code
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Got a code from a host? Enter it to take a seat.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {state.status === 'error' && (
          <p
            role="alert"
            className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
          >
            {state.error}
          </p>
        )}

        <TextField
          id="roomCode"
          label="Room code"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={8}
          required
          value={code}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          hint="6–8 letters or numbers."
          error={clientError}
          inputClassName="font-semibold uppercase tracking-[0.18em]"
        />

        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={!canSubmit || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Joining…' : 'Join room'}
        </Button>

        <div role="status">
          {state.status === 'success' && state.room && (
            <p className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm">
              <span className="font-semibold">You joined room </span>
              <span className="font-display text-lg font-medium tracking-[0.14em]">
                {state.room.code}
              </span>
              <span className="font-semibold">.</span>
              <span className="mt-1 block text-ink-soft">It will show up in your rooms.</span>
            </p>
          )}
        </div>
      </form>
    </section>
  )
}