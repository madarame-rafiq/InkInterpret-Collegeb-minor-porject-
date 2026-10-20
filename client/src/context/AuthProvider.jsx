import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'
import { ApiError, getErrorMessage } from '../lib/api.js'
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from '../features/auth/authApi.js'

// The server session (cookie) is the source of truth for "who is logged in".
// This provider only mirrors the result so components can render from it.
//
// Three outcomes of the initial session check:
//   user set                      -> signed in
//   user null, no sessionError    -> signed out (the server said 401)
//   user null, sessionError set   -> unknown: the check itself failed
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // true until a session check settles
  const [sessionError, setSessionError] = useState(null)

  // Asks the server who the session belongs to. A 401 is a normal "logged out"
  // answer, not an error. Anything else (network down, 500) is re-thrown.
  const refreshUser = useCallback(async (signal) => {
    try {
      const currentUser = await fetchCurrentUser(signal)
      setUser(currentUser)
      return currentUser
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null)
        return null
      }
      throw error
    }
  }, [])

  // Runs one session check and records the outcome. Failures other than 401
  // become sessionError; they are never silently treated as "logged out".
  const checkSession = useCallback(
    async (signal) => {
      try {
        await refreshUser(signal)
        setSessionError(null)
      } catch (error) {
        if (error.name === 'AbortError') return
        setSessionError(getErrorMessage(error, 'Could not check your session.'))
      } finally {
        if (!signal?.aborted) setIsLoading(false)
      }
    },
    [refreshUser],
  )

  // Session restoration on first load. The AbortController also makes this
  // safe under React StrictMode, which runs effects twice in development:
  // the first request is cancelled and only the second one settles the state.
  useEffect(() => {
    const controller = new AbortController()
    checkSession(controller.signal)
    return () => controller.abort()
  }, [checkSession])

  // Lets the person re-run the check after a failure (e.g. backend was down).
  const retrySession = useCallback(() => {
    setSessionError(null)
    setIsLoading(true)
    return checkSession()
  }, [checkSession])

  const login = useCallback(async (credentials) => {
    const loggedInUser = await loginRequest(credentials)
    setUser(loggedInUser)
    setSessionError(null)
    return loggedInUser
  }, [])

  // Only clears local state after the server confirms the session is gone.
  // If the request fails, the error propagates and the user stays "signed in".
  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, sessionError, retrySession, login, logout, refreshUser }),
    [user, isLoading, sessionError, retrySession, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}