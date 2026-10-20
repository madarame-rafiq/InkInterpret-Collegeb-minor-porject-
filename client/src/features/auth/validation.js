// Mirrors the backend rules so people get instant feedback.
// The server stays authoritative; these are a convenience, not security.

const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/

// Each validator returns an error message, or '' when the value is fine.

export function validateUsername(rawValue) {
  const value = rawValue.trim() // the backend trims usernames too
  if (!value) return 'Enter a username.'
  if (value.length < 3 || value.length > 30) return 'Use 3–30 characters.'
  if (!USERNAME_PATTERN.test(value)) return 'Use only letters, numbers and underscores.'
  return ''
}

// Passwords are never trimmed or altered.
export function validateNewPassword(value) {
  if (!value) return 'Enter a password.'
  if (value.length < 8) return 'Use at least 8 characters.'
  if (value.length > 72) return 'Use 72 characters or fewer.'
  return ''
}

// Frontend-only: this field is never sent to the backend.
export function validatePasswordConfirmation(password, confirmation) {
  if (!confirmation) return 'Re-enter your password.'
  if (password !== confirmation) return 'The passwords don’t match.'
  return ''
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean)
}