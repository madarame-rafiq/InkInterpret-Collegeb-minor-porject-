import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import CopyCodeButton from './CopyCodeButton.jsx'
import {
  DEFAULT_SETTINGS,
  DRAWING_OPTIONS,
  INPUT_MODES,
  PLAYER_OPTIONS,
  VOTING_OPTIONS,
  formatSeconds,
  validateRoomSettings,
} from './roomRules.js'

function SelectField({ id, label, value, options, formatOption, error, onChange }) {
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 block w-full rounded-control border-2 bg-paper px-3 py-3 text-base ${
          error ? 'border-vermilion-deep' : 'border-ink'
        }`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-2 text-sm font-semibold text-vermilion-deep">
          {error}
        </p>
      )}
    </div>
  )
}

export default function CreateRoomForm({ onCreate, state, onClearFeedback }) {
  const [values, setValues] = useState(DEFAULT_SETTINGS)
  const [errors, setErrors] = useState({})
  const isSubmitting = state.status === 'submitting'

  function handleChange(event) {
    const { name, value } = event.target
    // Selects deliver strings; the API needs numbers.
    setValues((current) => ({
      ...current,
      [name]: name === 'inputMode' ? value : Number(value),
    }))
    setErrors({})
    if (state.status !== 'idle') onClearFeedback()
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const found = validateRoomSettings(values)
    setErrors(found)

    const firstInvalid = Object.keys(found).find((name) => found[name])
    if (firstInvalid) {
      const field = form.elements.namedItem(firstInvalid)
      if (field && typeof field.focus === 'function') field.focus()
      return
    }

    onCreate({
      maxPlayers: values.maxPlayers,
      drawingDuration: values.drawingDuration,
      votingDuration: values.votingDuration,
      inputMode: values.inputMode,
    })
  }

  return (
    <section
      id="create-room"
      aria-labelledby="create-heading"
      className="border-2 border-ink bg-sheet p-5 sm:p-6"
    >
      <h2 id="create-heading" className="font-display text-2xl font-medium tracking-tight">
        Create a room
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        You’ll be the host. Pick the rules, then share the code it gives you.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {state.status === 'error' && (
          <p
            role="alert"
            className="border-2 border-l-[6px] border-ink border-l-vermilion bg-paper px-4 py-3 text-sm font-semibold"
          >
            {state.error}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
          <SelectField
            id="maxPlayers"
            label="Maximum players"
            value={values.maxPlayers}
            options={PLAYER_OPTIONS}
            formatOption={(n) => `${n} players`}
            error={errors.maxPlayers}
            onChange={handleChange}
          />
          <SelectField
            id="drawingDuration"
            label="Drawing time"
            value={values.drawingDuration}
            options={DRAWING_OPTIONS}
            formatOption={formatSeconds}
            error={errors.drawingDuration}
            onChange={handleChange}
          />
          <SelectField
            id="votingDuration"
            label="Voting time"
            value={values.votingDuration}
            options={VOTING_OPTIONS}
            formatOption={formatSeconds}
            error={errors.votingDuration}
            onChange={handleChange}
          />
        </div>

        <fieldset
          aria-describedby={errors.inputMode ? 'inputMode-error' : undefined}
          className="min-w-0"
        >
          <legend className="text-sm font-semibold">How players draw</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {INPUT_MODES.map((mode) => (
              <label
                key={mode.value}
                className="flex cursor-pointer gap-3 border-2 border-ink/40 bg-paper p-3 has-checked:border-ink has-checked:bg-paper-deep"
              >
                <input
                  type="radio"
                  name="inputMode"
                  value={mode.value}
                  checked={values.inputMode === mode.value}
                  onChange={handleChange}
                  className="mt-1 size-4 shrink-0 accent-ink"
                />
                <span>
                  <span className="block font-semibold">{mode.label}</span>
                  <span className="block text-sm text-ink-soft">{mode.description}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.inputMode && (
            <p id="inputMode-error" className="mt-2 text-sm font-semibold text-vermilion-deep">
              {errors.inputMode}
            </p>
          )}
        </fieldset>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Creating room…' : 'Create room'}
        </Button>

        {/* Always rendered so the success message is announced when it appears */}
        <div role="status">
          {state.status === 'success' && state.room && (
            <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-paper px-4 py-3">
              <p className="text-sm font-semibold">Room created. Its code is:</p>
              <p className="mt-2 font-display text-3xl font-medium tracking-[0.14em]">
                {state.room.code}
              </p>
              <div className="mt-3">
                <CopyCodeButton code={state.room.code} />
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                Share this code so others can join. You’re the host.
              </p>
            </div>
          )}
        </div>
      </form>
    </section>
  )
}