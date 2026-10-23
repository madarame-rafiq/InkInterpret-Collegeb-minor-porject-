import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import RoomCard from './RoomCard.jsx'

// Rooms in these statuses have an active lobby/game page.
const LIVE_STATUSES = ['waiting', 'in_progress']

function RoomListSkeleton() {
  return (
    <div role="status">
      <p className="text-sm font-semibold text-ink-soft">Loading your rooms…</p>
      <div aria-hidden="true" className="mt-4 space-y-4">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="h-28 border-2 border-dashed border-ink/30 bg-sheet/60 motion-safe:animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}

function LoadError({ message, stale, onRetry }) {
  return (
    <div
      role="alert"
      className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-4"
    >
      <p className="font-semibold">Your rooms couldn’t be loaded.</p>
      <p className="mt-1 text-sm text-ink-soft">{message}</p>
      {stale && (
        <p className="mt-1 text-sm text-ink-soft">
          The list below is the last one we loaded and may be out of date.
        </p>
      )}
      <Button size="sm" variant="secondary" className="mt-3" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col gap-5 border-2 border-dashed border-ink/40 p-6 sm:flex-row sm:items-center">
      <svg
        viewBox="0 0 120 90"
        aria-hidden="true"
        focusable="false"
        className="h-20 w-auto shrink-0"
        fill="none"
      >
        <rect
          x="10"
          y="10"
          width="100"
          height="70"
          strokeWidth="2"
          strokeDasharray="5 5"
          className="stroke-ink/40"
        />
        <circle cx="60" cy="45" r="7" className="fill-vermilion" />
      </svg>
      <div>
        <h3 className="font-display text-xl font-medium">No rooms yet.</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          A room is where a round happens.{' '}
          <a href="#create-room" className="rounded-control font-semibold text-ink underline underline-offset-4">
            Create one
          </a>{' '}
          and share its code, or{' '}
          <a href="#join-room" className="rounded-control font-semibold text-ink underline underline-offset-4">
            enter a code
          </a>{' '}
          from a friend to join theirs.
        </p>
      </div>
    </div>
  )
}

// rooms: null until the first successful load, then an array (possibly stale).
// status: 'loading' | 'ready' | 'error'
export default function RoomList({ rooms, status, error, onRetry }) {
  if (rooms === null) {
    if (status === 'error') return <LoadError message={error} onRetry={onRetry} />
    return <RoomListSkeleton />
  }

  return (
    <div className="space-y-4">
      {status === 'error' && (
        <LoadError message={error} stale={rooms.length > 0} onRetry={onRetry} />
      )}

      {status === 'loading' && (
        <p role="status" className="text-sm font-semibold text-ink-soft">
          Refreshing…
        </p>
      )}

      {rooms.length === 0 && status === 'ready' && <EmptyState />}

      {rooms.length > 0 && (
        <ul className="space-y-4">
          {rooms.map((room) => (
            <li key={room.id}>
              {LIVE_STATUSES.includes(room.status) ? (
                <Link
                  to={`/rooms/${room.code}`}
                  className="block rounded-control"
                  aria-label={`Open room ${room.code}`}
                >
                  <RoomCard room={room} />
                </Link>
              ) : (
                <RoomCard room={room} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}