import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'
import PageLoader from '../components/ui/PageLoader.jsx'
import SessionCheckError from '../components/ui/SessionCheckError.jsx'

// The mirror image of ProtectedRoute, for /login and /register.
// Signed-in users are sent onward, which is also how a successful login
// navigates: login() sets the user, this guard re-renders and redirects.
export default function GuestRoute() {
  const { user, isLoading, sessionError, retrySession } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader label="Checking your session…" />

  if (sessionError) {
    return <SessionCheckError message={sessionError} onRetry={retrySession} />
  }

  if (user) {
    const from = location.state?.from
    const destination = from
      ? `${from.pathname}${from.search}${from.hash}`
      : '/dashboard'
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}