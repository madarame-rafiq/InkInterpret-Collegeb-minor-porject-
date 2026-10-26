// Shared display-only countdown. It never advances game state; it only reports
// how many whole seconds remain until the server's deadline.

import { useSyncExternalStore } from 'react'

// Whole seconds of the local clock. React compares snapshots by value, so
// subscribers re-render only when the second actually changes.
const getNowSeconds = () => Math.floor(Date.now() / 1000)

function subscribe(onTick) {
  const id = setInterval(onTick, 250)
  return () => clearInterval(id)
}

// Whole seconds until `endsAt` (never negative), or null when the deadline is
// missing or malformed.
export function useSecondsRemaining(endsAt) {
  const nowSeconds = useSyncExternalStore(subscribe, getNowSeconds)
  const endsMs = Date.parse(endsAt)
  if (!Number.isFinite(endsMs)) return null
  return Math.max(0, Math.ceil(endsMs / 1000) - nowSeconds)
}