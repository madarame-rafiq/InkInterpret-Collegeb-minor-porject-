// A labelled input with an optional hint and error, wired for screen readers:
// the label is tied by htmlFor/id, and hint + error are tied by aria-describedby.
export default function TextField({
  id,
  label,
  hint,
  error,
  className = '',
  inputClassName = '',
  ...inputProps
}) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        className={`mt-2 block w-full rounded-control border-2 bg-sheet px-3 py-3 text-base ${
          error ? 'border-vermilion-deep' : 'border-ink'
        } ${inputClassName}`}
        {...inputProps}
      />
      {hint && (
        <p id={hintId} className="mt-2 text-sm text-ink-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm font-semibold text-vermilion-deep">
          {error}
        </p>
      )}
    </div>
  )
}