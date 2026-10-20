import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext.js'
import { getErrorMessage } from '../../lib/api.js'
import Logo from '../../components/brand/Logo.jsx'
import Button from '../../components/ui/Button.jsx'

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(date)
}

// Placeholder for Milestone 2: proves the session works and offers sign-out.
// The real dashboard (rooms, create, join) is Milestone 3.
export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState('')

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)
    setError('')
    try {
      await logout()
      navigate('/', { replace: true })
    } catch (err) {
      setError(`You are still signed in. ${getErrorMessage(err, 'Signing out failed.')}`)
      setIsSigningOut(false)
    }
  }

  const createdOn = formatDate(user.created_at)

  return (
    <div className="min-h-dvh overflow-x-clip">
      <header className="border-b border-ink/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Logo />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            aria-busy={isSigningOut}
          >
            {isSigningOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
          Dashboard
        </p>
        <h1 className="mt-3 text-balance font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Hello, {user.username}.
        </h1>

        {error && (
          <p
            role="alert"
            className="mt-6 border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
          >
            {error}
          </p>
        )}

        <dl className="mt-8 max-w-md border-t-2 border-ink text-sm">
          <div className="flex justify-between gap-6 border-b border-ink/20 py-3">
            <dt className="text-ink-faint">Signed in as</dt>
            <dd className="font-semibold">{user.username}</dd>
          </div>
          {createdOn && (
            <div className="flex justify-between gap-6 border-b border-ink/20 py-3">
              <dt className="text-ink-faint">Account created</dt>
              <dd className="font-semibold">{createdOn}</dd>
            </div>
          )}
        </dl>

        <p className="mt-8 max-w-md leading-relaxed text-ink-soft">
          This page only confirms your session works. Your rooms, creating a room and joining
          with a code arrive in the next milestone.
        </p>
      </main>
    </div>
  )
}