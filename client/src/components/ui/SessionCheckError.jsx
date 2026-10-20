import { Link } from 'react-router-dom'
import Button from './Button.jsx'

// Shown by the route guards when the session check itself failed (not a 401).
export default function SessionCheckError({ message, onRetry }) {
  return (
    <div className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
          Connection problem
        </p>
        <h1 className="mt-3 text-balance font-display text-3xl font-medium leading-tight tracking-tight">
          We couldn’t check your session.
        </h1>
        <p
          role="alert"
          className="mt-6 border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
        >
          {message}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          You haven’t been signed out. We just can’t reach the server right now.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button onClick={onRetry}>Try again</Button>
          <Link
            to="/"
            className="rounded-control text-sm font-semibold underline underline-offset-4"
          >
            Back to the welcome page
          </Link>
        </div>
      </div>
    </div>
  )
}