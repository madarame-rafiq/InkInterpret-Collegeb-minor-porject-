import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, getErrorMessage } from '../../lib/api.js'
import Button from '../../components/ui/Button.jsx'
import TextField from '../../components/ui/TextField.jsx'
import AuthLayout from './AuthLayout.jsx'
import { register } from './authApi.js'
import {
  hasErrors,
  validateNewPassword,
  validatePasswordConfirmation,
  validateUsername,
} from './validation.js'

const initialValues = { username: '', password: '', confirmPassword: '' }

function validate(values) {
  return {
    username: validateUsername(values.username),
    password: validateNewPassword(values.password),
    confirmPassword: validatePasswordConfirmation(values.password, values.confirmPassword),
  }
}

export default function RegisterPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [hasAttempted, setHasAttempted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdUsername, setCreatedUsername] = useState(null)
  const submittingRef = useRef(false)
  const headingRef = useRef(null)

  // When the success state replaces the form, move focus to its heading so
  // keyboard and screen-reader users land on the new content.
  useEffect(() => {
    if (createdUsername) headingRef.current?.focus()
  }, [createdUsername])

  function handleChange(event) {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    setServerError('')
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
      // confirmPassword is intentionally not sent; it exists only in the browser.
      const user = await register({
        username: values.username.trim(),
        password: values.password,
      })
      setCreatedUsername(user.username)
      setValues(initialValues) // don't keep the password in state any longer than needed
      setErrors({})
    } catch (error) {
      if (error instanceof ApiError && error.code === 'USERNAME_TAKEN') {
        setErrors((current) => ({ ...current, username: error.message }))
        form.elements.username?.focus()
      } else {
        setServerError(getErrorMessage(error))
      }
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  if (createdUsername) {
    return (
      <AuthLayout
        eyebrow="Account created"
        title="Your account is ready."
        intro={`Welcome, ${createdUsername}. You’re not signed in yet.`}
        headingRef={headingRef}
      >
        <p className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm">
          Next step: log in with the username and password you just chose.
        </p>
        <Button to="/login" className="mt-6 w-full">
          Continue to log in
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Start with a name."
      intro="Choose a username and password. You’ll log in on the next screen."
      headingRef={headingRef}
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
          hint="3–30 characters: letters, numbers and underscores."
          error={errors.username}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          value={values.password}
          onChange={handleChange}
          hint="8–72 characters."
          error={errors.password}
        />

        <TextField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-8 border-t border-ink/20 pt-6 text-sm text-ink-soft">
        Already have an account?{' '}
        <Link
          to="/login"
          className="rounded-control font-semibold text-ink underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}