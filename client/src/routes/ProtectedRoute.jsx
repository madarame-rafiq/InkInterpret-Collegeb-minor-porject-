import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'
import PageLoader from '../components/ui/PageLoader.jsx'
import SessionCheckError from '../components/ui/SessionCheckError.jsx'

// Layout route: wraps child routes and only renders them for signed-in users.
export default function ProtectedRoute() {
  const { user, isLoading, sessionError, retrySession } = useAuth()
  const location = useLocation()

  // Never flash protected content (or a wrong redirect) before /me answers.
  if (isLoading) return <PageLoader label="Checking your session…" />

  // The check failed, so we don't know whether they're signed in.
  // Don't send them to /login; offer a retry instead.
  if (sessionError) {
    return <SessionCheckError message={sessionError} onRetry={retrySession} />
  }

  if (!user) {
    // Remember where they were headed so login can send them back.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}