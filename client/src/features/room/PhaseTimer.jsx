// PhaseTimer: a display-only countdown to the server's `phaseEndsAt`.
//
// It never advances anything. When it reaches zero the phase simply stays on
// screen until the server announces the next one. The local clock may drift
// from the server's, so this is a guide, and the server still decides.

import { useSecondsRemaining } from './useCountdown.js'

function formatRemaining(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export default function PhaseTimer({ endsAt, label }) {
  const remaining = useSecondsRemaining(endsAt)
  if (remaining === null) return null // missing or malformed deadline

  const isExpired = remaining === 0
  const isUrgent = !isExpired && remaining <= 10

  return (
    <div className="text-right">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </p>
      {isExpired ? (
        <p className="mt-1 text-sm font-semibold text-ink-soft motion-safe:animate-pulse">
          Waiting for the server…
        </p>
      ) : (
        <p
          role="timer"
          aria-live="off"
          className={`mt-1 font-display text-4xl font-medium tabular-nums leading-none ${
            isUrgent ? 'text-vermilion-deep' : 'text-ink'
          }`}
        >
          {formatRemaining(remaining)}
        </p>
      )}
    </div>
  )
}