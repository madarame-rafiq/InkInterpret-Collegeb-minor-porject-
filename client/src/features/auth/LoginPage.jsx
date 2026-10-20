import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/authContext.js'
import { ApiError, getErrorMessage } from '../../lib/api.js'
import Button from '../../components/ui/Button.jsx'
import TextField from '../../components/ui/TextField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { hasErrors } from './validation.js'

const initialValues = { username: '', password: '' }

// Login only checks that fields aren't empty. The username and password
// rules belong to registration; here the server decides if they match.
function validate(values) {
  return {
    username: values.username.trim() ? '' : 'Enter your username.',
    password: values.password ? '' : 'Enter your password.',
  }
}

export default function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [hasAttempted, setHasAttempted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false) // blocks a second submit before React re-renders

  const wasRedirected = Boolean(location.state?.from)

  function handleChange(event) {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    setServerError('')
    // After the first failed attempt, errors update live as the person types.
    if (hasAttempted) setErrors(validate(next))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submittingRef.current) return

    const form = event.currentTarget
    const found = validate(values)
    setHasAttempted(true)
    setErrors(found)

    if (hasErrors(found)) {
      const firstInvalid = Object.keys(found).find((name) => found[name])
      form.elements[firstInvalid]?.focus()
      return
    }

    submittingRef.current = true
    setIsSubmitting(true)
    setServerError('')

    try {
      // On success the user is stored in context; GuestRoute then redirects
      // to the page they originally wanted, or /dashboard.
      await login({ username: values.username.trim(), password: values.password })
    } catch (error) {
      if (error instanceof ApiError && error.code === 'INVALID_CREDENTIALS') {
        setServerError('That username and password don’t match an account.')
        setValues((current) => ({ ...current, password: '' }))
        form.elements.password?.focus()
      } else {
        setServerError(getErrorMessage(error))
      }
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Log in"
      title="Welcome back."
      intro={
        wasRedirected
          ? 'You need to be signed in to view that page. Log in and we’ll take you there.'
          : 'Log in with your username and password.'
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {serverError && (
          <p
            role="alert"
            className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
          >
            {serverError}
          </p>
        )}

        <TextField
          id="username"
          label="Username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          value={values.username}
          onChange={handleChange}
          error={errors.username}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-8 border-t border-ink/20 pt-6 text-sm text-ink-soft">
        New to InkInterpret?{' '}
        <Link
          to="/register"
          className="rounded-control font-semibold text-ink underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}