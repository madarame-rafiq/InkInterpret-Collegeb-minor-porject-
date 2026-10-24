# InkInterpret — Claude Project Context

Purpose: Build the frontend for the existing InkInterpret multiplayer drawing game.
This bundle is generated from the local repository. Treat the included source code
and GAME_API.md as the primary evidence of the current implementation.

SECURITY: Environment files, dependencies, build output, and Git internals are excluded.
Do not assume files absent from this bundle do not exist; use the included file inventory.


## Git status
 M server/package.json
 M server/src/index.js
 M server/src/routes/roomRoutes.js
 M server/src/socket/handlers/connection.js
 M server/src/socket/index.js
?? claude-context.md
?? server/GAME_API.md
?? server/migrations/1792670000000_add-games.js
?? server/migrations/1792670000001_add-game-round-participant-status.js
?? server/src/controllers/gameController.js
?? server/src/services/gameService.js
?? server/src/services/gameTimerService.js
?? server/src/socket/handlers/gameSocket.js
?? server/test/

## Recent commits
6c8cd6c real time chat
098f55f fix(server): register error handler after routes
7f49de5 feat(cleint) dashboard page with create and join room
bb59c26 feat(client): authentication and session restoration
62a18fe made home frontend withb claude

## Source file inventory
client/src/App.jsx
client/src/assets/hero.png
client/src/assets/react.svg
client/src/assets/vite.svg
client/src/components/brand/Logo.jsx
client/src/components/layout/navLinks.js
client/src/components/layout/SiteFooter.jsx
client/src/components/layout/SiteHeader.jsx
client/src/components/ui/Button.jsx
client/src/components/ui/PageLoader.jsx
client/src/components/ui/SessionCheckError.jsx
client/src/components/ui/TextField.jsx
client/src/context/authContext.js
client/src/context/AuthProvider.jsx
client/src/features/auth/authApi.js
client/src/features/auth/AuthLayout.jsx
client/src/features/auth/LoginPage.jsx
client/src/features/auth/RegisterPage.jsx
client/src/features/auth/validation.js
client/src/features/dashboard/CopyCodeButton.jsx
client/src/features/dashboard/CreateRoomForm.jsx
client/src/features/dashboard/DashboardBackdrop.jsx
client/src/features/dashboard/DashboardBackground.jsx
client/src/features/dashboard/DashboardIllustration.jsx
client/src/features/dashboard/DashboardPage.jsx
client/src/features/dashboard/JoinRoomForm.jsx
client/src/features/dashboard/RoomCard.jsx
client/src/features/dashboard/RoomList.jsx
client/src/features/dashboard/roomRules.js
client/src/features/dashboard/roomsApi.js
client/src/features/room/ChatPanel.jsx
client/src/features/room/LobbyView.jsx
client/src/features/room/roomApi.js
client/src/features/room/RoomPage.jsx
client/src/features/room/useChat.js
client/src/features/room/useRoomData.js
client/src/features/room/useRoomSocket.js
client/src/features/welcome/BuildStatus.jsx
client/src/features/welcome/GameplayPreview.jsx
client/src/features/welcome/Hero.jsx
client/src/features/welcome/HowItWorks.jsx
client/src/features/welcome/WelcomePage.jsx
client/src/index.css
client/src/lib/api.js
client/src/lib/socket.js
client/src/main.jsx
client/src/routes/GuestRoute.jsx
client/src/routes/ProtectedRoute.jsx
server/migrations/1792146803004_init-user.js
server/migrations/1792313717984_init-sessions.js
server/migrations/1792316730967_init-rooms.js
server/migrations/1792317377319_init-room-members.js
server/migrations/1792591161392_add-chat-messages.js
server/migrations/1792670000000_add-games.js
server/migrations/1792670000001_add-game-round-participant-status.js
server/src/config/session.js
server/src/controllers/authController.js
server/src/controllers/gameController.js
server/src/controllers/joinRoomController.js
server/src/controllers/leaveRoomController.js
server/src/controllers/roomController.js
server/src/controllers/roomReadController.js
server/src/database/check.js
server/src/database/pool.js
server/src/database/queries/users.js
server/src/index.js
server/src/middlewares/authRequire.js
server/src/middlewares/errorHandler.js
server/src/routes/authRoutes.js
server/src/routes/roomRoutes.js
server/src/services/authService.js
server/src/services/chatService.js
server/src/services/gameService.js
server/src/services/gameTimerService.js
server/src/services/joinRoomService.js
server/src/services/leaveRoomService.js
server/src/services/roomReadService.js
server/src/services/roomService.js
server/src/socket/handlers/chatSocket.js
server/src/socket/handlers/connection.js
server/src/socket/handlers/gameSocket.js
server/src/socket/handlers/roomSocket.js
server/src/socket/index.js
server/src/utils/AppError.js
server/src/validators/authSchema.js
server/src/validators/joinRoomSchema.js
server/src/validators/roomSchemas.js

## Project configuration and documentation


--- BEGIN FILE: README.md ---
~~~
#College minor project
~~~
--- END FILE: README.md ---


--- BEGIN FILE: client/package.json ---
~~~
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "0.577.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.4"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "eslint": "^10.10.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.6",
    "globals": "^17.12.0",
    "socket.io-client": "^4.8.4",
    "vite": "^8.3.0"
  }
}

~~~
--- END FILE: client/package.json ---


--- BEGIN FILE: client/vite.config.js ---
~~~
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
~~~
--- END FILE: client/vite.config.js ---


--- BEGIN FILE: client/index.html ---
~~~
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f4eee2" />
    <meta
      name="description"
      content="InkInterpret is a multiplayer drawing game. Everyone gets the same prompt, draws their own interpretation, and the room votes."
    />
    <title>InkInterpret — same prompt, wildly different drawings</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Instrument+Sans:wght@400..700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
~~~
--- END FILE: client/index.html ---


--- BEGIN FILE: server/package.json ---
~~~
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "migrate": "node-pg-migrate",
    "migrate:down": "node-pg-migrate down",
    "test": "node --test"
  },
  "keywords": [],
  "type": "module",
  "dependencies": {
    "bcrypt": "^6.0.0",
    "connect-pg-simple": "^10.0.0",
    "dotenv": "^18.0.8",
    "express": "^5.3.0",
    "express-session": "^1.19.0",
    "pg": "^8.23.1",
    "socket.io": "^4.8.4",
    "zod": "^4.6.7"
  },
  "devDependencies": {
    "node-pg-migrate": "^9.0.0",
    "nodemon": "^3.1.14",
    "socket.io-client": "^4.8.4"
  }
}

~~~
--- END FILE: server/package.json ---


--- BEGIN FILE: server/GAME_API.md ---
~~~
# Game backend contract

All routes and socket commands use the existing authenticated session. Socket
commands require the user to be a current room member and game-roster member.

## HTTP

- `POST /api/rooms/:code/game/start` — host starts a waiting room game.
- `GET /api/rooms/:code/game` — returns persisted authoritative state for a roster member.
- `GET /api/rooms/:code/game/drawings/:publicId` — returns a roster member's canvas payload or photo. `publicId` is a neutral, round-specific UUID.

## Socket commands

Each command accepts an acknowledgement shaped as `{ status: 'success', data }`
or `{ status: 'error', error: { code, message } }`.

- `game:start` `{ code }`
- `game:state` `{ code }`
- `game:prompt:submit` `{ code, prompt }`
- `game:drawing:submit` `{ code, canvasData }`
- `game:capture:submit` `{ code, dataUrl }` — PNG, JPEG, or WebP data URL, maximum 8 MB.
- `game:vote:submit` `{ code, drawingId }`

## Server events

- `game:started`, `game:phase`, `game:results`, `game:finished`
- `game:prompt:missed` with the explicit missing-prompt message
- `game:aborted` with a terminal abort reason

During voting, state and events include only neutral `publicId` drawing IDs;
artist identity and vote totals are returned only in result/terminal state.

~~~
--- END FILE: server/GAME_API.md ---


# Frontend source files


--- BEGIN FILE: client/src/App.jsx ---
~~~
import { Navigate, Route, Routes } from 'react-router-dom'
import WelcomePage from './features/welcome/WelcomePage.jsx'
import LoginPage from './features/auth/LoginPage.jsx'
import RegisterPage from './features/auth/RegisterPage.jsx'
import DashboardPage from './features/dashboard/DashboardPage.jsx'
import RoomPage from './features/room/RoomPage.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import GuestRoute from './routes/GuestRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />

      {/* Only for signed-out visitors */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Only for signed-in users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/rooms/:code" element={<RoomPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
~~~
--- END FILE: client/src/App.jsx ---


--- BEGIN FILE: client/src/components/brand/Logo.jsx ---
~~~
import { Link } from 'react-router-dom'

// The mark is a lowercase "i": a brush-stroke stem, a vermilion ink drop for
// the dot, and a loose underline. It reads as "ink" and as "interpret".
export function BrandMark({ className = 'size-9' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="fill-current"
        d="M16.6 17.2c-.5 4.6-.3 9.1-.9 14.3 1.5.5 3.6.5 5.3-.1-.6-5-.4-9.7.1-14.2-1.5-.6-3.2-.6-4.5 0Z"
      />
      <path
        className="fill-vermilion"
        d="M19 5.2c2.6-.2 4.6 1.8 4.4 4.4-.2 2.4-2.2 4-4.5 3.9-2.5-.1-4.3-2-4.2-4.3.1-2.2 1.8-3.8 4.3-4Z"
      />
      <path
        className="stroke-current"
        d="M8 35.5c6-1.4 17-1.6 24.5-.2"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Wordmark({ className = '' }) {
  return (
    <span
      className={`font-display text-xl leading-none tracking-tight ${className}`}
    >
      <span className="font-semibold">Ink</span>
      <span className="italic">Interpret</span>
    </span>
  )
}

// href -> in-page anchor (the welcome page's own "#top")
// otherwise -> router link to the welcome page
export default function Logo({ href }) {
  const className = 'inline-flex items-center gap-2 rounded-control'
  const content = (
    <>
      <BrandMark />
      <Wordmark />
    </>
  )

  if (href) {
    return (
      <a href={href} aria-label="InkInterpret, back to top" className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link to="/" aria-label="InkInterpret, home" className={className}>
      {content}
    </Link>
  )
}
~~~
--- END FILE: client/src/components/brand/Logo.jsx ---


--- BEGIN FILE: client/src/components/layout/navLinks.js ---
~~~
// Shared by the header and the footer so the two never drift apart.
export const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Build status', href: '#build-status' },
]
~~~
--- END FILE: client/src/components/layout/navLinks.js ---


--- BEGIN FILE: client/src/components/layout/SiteFooter.jsx ---
~~~
import Logo from '../brand/Logo.jsx'
import { NAV_LINKS } from './navLinks.js'

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/15">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo href="#top" />
          <p className="mt-3 max-w-sm text-sm text-ink-soft">
            A multiplayer drawing and interpretation game. A college minor
            project, currently in development.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-control underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#top"
                className="rounded-control underline-offset-4 hover:underline"
              >
                Back to top
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
~~~
--- END FILE: client/src/components/layout/SiteFooter.jsx ---


--- BEGIN FILE: client/src/components/layout/SiteHeader.jsx ---
~~~
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import Button from '../ui/Button.jsx'
import { useAuth } from '../../context/authContext.js'
import { NAV_LINKS } from './navLinks.js'

export default function SiteHeader() {
  const { user, isLoading } = useAuth()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  // Escape closes the mobile menu and returns focus to the toggle button.
  useEffect(() => {
    if (!open) return
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Logo href="#top" />

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-control text-sm font-semibold text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              {link.label}
            </a>
          ))}

          {/* While the first /me check is pending, the account actions take up
              their space but are invisible, so nothing flashes or shifts. */}
          <div
            className={`flex items-center gap-8 ${isLoading ? 'invisible' : ''}`}
          >
            {user ? (
              <Button to="/dashboard" size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-control text-sm font-semibold underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
                <Button to="/register" size="sm">
                  Get started
                </Button>
              </>
            )}
          </div>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-control border-2 border-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-ink/15 md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-ink/10">
              <a
                href={link.href}
                onClick={close}
                className="block py-3 font-display text-xl"
              >
                {link.label}
              </a>
            </li>
          ))}

          {/* Account items appear only once the session check has settled. */}
          {!isLoading &&
            (user ? (
              <li className="py-4">
                <Button to="/dashboard" onClick={close} className="w-full">
                  Dashboard
                </Button>
              </li>
            ) : (
              <>
                <li className="border-b border-ink/10">
                  <Link
                    to="/login"
                    onClick={close}
                    className="block py-3 font-display text-xl"
                  >
                    Log in
                  </Link>
                </li>
                <li className="py-4">
                  <Button to="/register" onClick={close} className="w-full">
                    Get started
                  </Button>
                </li>
              </>
            ))}
        </ul>
      </nav>
    </header>
  )
}
~~~
--- END FILE: client/src/components/layout/SiteHeader.jsx ---


--- BEGIN FILE: client/src/components/ui/Button.jsx ---
~~~
import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-control border-2 border-ink font-semibold ' +
  'transition-[transform,box-shadow,background-color,color] duration-150 ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants = {
  // Stamp-style: vermilion fill, ink text (4.7:1 contrast), hard offset shadow
  primary:
    'bg-vermilion text-ink shadow-stamp ' +
    'hover:-translate-x-px hover:-translate-y-px hover:shadow-stamp-lift ' +
    'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
  // Outline: fills with ink on hover
  secondary: 'bg-transparent text-ink hover:bg-ink hover:text-paper',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-base',
}

// to   -> router <Link> (internal pages)
// href -> plain <a> (in-page anchors like #how-it-works)
// neither -> <button> (pass type="submit" for forms)
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
~~~
--- END FILE: client/src/components/ui/Button.jsx ---


--- BEGIN FILE: client/src/components/ui/PageLoader.jsx ---
~~~
export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div role="status" className="grid min-h-dvh place-items-center px-5">
      <div className="text-center">
        <svg
          viewBox="0 0 120 24"
          aria-hidden="true"
          focusable="false"
          className="mx-auto h-6 w-28 text-vermilion"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path
            className="draw-in stroke-current"
            pathLength="1"
            d="M4 14 C 20 2, 34 24, 50 12 S 80 2, 96 14 S 112 18, 116 10"
          />
        </svg>
        <p className="mt-3 text-sm font-semibold text-ink-soft">{label}</p>
      </div>
    </div>
  )
}
~~~
--- END FILE: client/src/components/ui/PageLoader.jsx ---


--- BEGIN FILE: client/src/components/ui/SessionCheckError.jsx ---
~~~
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
~~~
--- END FILE: client/src/components/ui/SessionCheckError.jsx ---


--- BEGIN FILE: client/src/components/ui/TextField.jsx ---
~~~
// A labelled input with an optional hint and error, wired for screen readers:
// the label is tied by htmlFor/id, and hint + error are tied by aria-describedby.
export default function TextField({
  id,
  label,
  hint,
  error,
  className = '',
  inputClassName = '',
  ...inputProps
}) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        className={`mt-2 block w-full rounded-control border-2 bg-sheet px-3 py-3 text-base ${
          error ? 'border-vermilion-deep' : 'border-ink'
        } ${inputClassName}`}
        {...inputProps}
      />
      {hint && (
        <p id={hintId} className="mt-2 text-sm text-ink-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm font-semibold text-vermilion-deep">
          {error}
        </p>
      )}
    </div>
  )
}
~~~
--- END FILE: client/src/components/ui/TextField.jsx ---


--- BEGIN FILE: client/src/context/authContext.js ---
~~~
import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used inside <AuthProvider>.')
  }
  return value
}
~~~
--- END FILE: client/src/context/authContext.js ---


--- BEGIN FILE: client/src/context/AuthProvider.jsx ---
~~~
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
~~~
--- END FILE: client/src/context/AuthProvider.jsx ---


--- BEGIN FILE: client/src/features/auth/authApi.js ---
~~~
import { ApiError, apiFetch } from '../../lib/api.js'

// Success responses are { status, data: { user } }. If that shape is ever
// missing, fail loudly here instead of crashing a component later.
function readUser(payload) {
  const user = payload?.data?.user
  if (!user) {
    throw new ApiError({
      status: 200,
      code: 'UNEXPECTED_RESPONSE',
      message: 'The server sent a response the app could not understand.',
    })
  }
  return user
}

export async function fetchCurrentUser(signal) {
  return readUser(await apiFetch('/api/auth/me', { signal }))
}

export async function register({ username, password }) {
  return readUser(
    await apiFetch('/api/auth/register', { method: 'POST', body: { username, password } }),
  )
}

export async function login({ username, password }) {
  return readUser(
    await apiFetch('/api/auth/login', { method: 'POST', body: { username, password } }),
  )
}

export async function logout() {
  await apiFetch('/api/auth/logout', { method: 'POST' })
}
~~~
--- END FILE: client/src/features/auth/authApi.js ---


--- BEGIN FILE: client/src/features/auth/AuthLayout.jsx ---
~~~
import { Link } from 'react-router-dom'
import Logo from '../../components/brand/Logo.jsx'

// A blank frame with the vermilion ink drop from the logo, and one line
// being drawn: the start of a drawing, before anyone has interpreted it.
function BeginningSketch() {
  return (
    <svg
      viewBox="0 0 240 200"
      aria-hidden="true"
      focusable="false"
      className="h-auto w-full max-w-xs"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="20"
        y="16"
        width="200"
        height="168"
        strokeWidth="2"
        className="stroke-paper/40"
        transform="rotate(-2 120 100)"
      />
      <path
        className="stroke-paper/40"
        strokeWidth="2"
        d="M52 152 C 80 144, 104 160, 132 150 S 190 144, 200 152"
      />
      <path
        className="draw-in stroke-paper"
        style={{ '--d': '300ms' }}
        pathLength="1"
        strokeWidth="3"
        d="M60 122 C 80 62, 120 52, 140 92 S 170 132, 190 82"
      />
      <circle cx="120" cy="50" r="9" className="fill-vermilion" />
    </svg>
  )
}

export default function AuthLayout({ eyebrow, title, intro, headingRef, children }) {
  return (
    <div className="min-h-dvh overflow-x-clip lg:grid lg:grid-cols-12">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:border-2 focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>

      {/* On mobile this is just a dark band with the logo; on desktop it's a panel. */}
      <aside className="on-ink bg-ink text-paper lg:col-span-5">
        <div className="flex flex-col px-5 py-4 sm:px-8 lg:min-h-dvh lg:justify-between lg:px-12 lg:py-10">
          <div>
            <Logo />
          </div>

          <div className="hidden lg:block">
            <BeginningSketch />
            <p className="mt-6 max-w-xs font-display text-2xl italic leading-snug">
              Every drawing starts with a mark.
            </p>
          </div>

          <div className="hidden lg:block">
            <Link
              to="/"
              className="rounded-control text-sm font-semibold underline-offset-4 hover:underline"
            >
              Back to the welcome page
            </Link>
          </div>
        </div>
      </aside>

      <main
        id="main"
        className="flex items-center justify-center px-5 py-10 sm:px-8 lg:col-span-7 lg:px-16 lg:py-16"
      >
        <div className="w-full max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
            {eyebrow}
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-balance font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
          >
            {title}
          </h1>
          {intro && <p className="mt-3 leading-relaxed text-ink-soft">{intro}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
~~~
--- END FILE: client/src/features/auth/AuthLayout.jsx ---


--- BEGIN FILE: client/src/features/auth/LoginPage.jsx ---
~~~
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
~~~
--- END FILE: client/src/features/auth/LoginPage.jsx ---


--- BEGIN FILE: client/src/features/auth/RegisterPage.jsx ---
~~~
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
~~~
--- END FILE: client/src/features/auth/RegisterPage.jsx ---


--- BEGIN FILE: client/src/features/auth/validation.js ---
~~~
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
~~~
--- END FILE: client/src/features/auth/validation.js ---


--- BEGIN FILE: client/src/features/dashboard/CopyCodeButton.jsx ---
~~~
import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyCodeButton({ code }) {
  const [status, setStatus] = useState('idle') // 'idle' | 'copied' | 'failed'
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  async function handleCopy() {
    clearTimeout(timerRef.current)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(code)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    timerRef.current = setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy room code ${code}`}
        className="inline-flex items-center gap-2 rounded-control border-2 border-ink px-3 py-1.5 text-sm font-semibold hover:bg-ink hover:text-paper"
      >
        {status === 'copied' ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {status === 'copied' ? 'Copied' : 'Copy'}
      </button>

      {/* Persistent live region so the result is announced to screen readers */}
      <span role="status" className="text-sm font-semibold text-vermilion-deep">
        {status === 'failed' && 'Couldn’t copy. Select the code and copy it manually.'}
        {status === 'copied' && <span className="sr-only">Room code copied</span>}
      </span>
    </span>
  )
}
~~~
--- END FILE: client/src/features/dashboard/CopyCodeButton.jsx ---


--- BEGIN FILE: client/src/features/dashboard/CreateRoomForm.jsx ---
~~~
import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import CopyCodeButton from './CopyCodeButton.jsx'
import {
  DEFAULT_SETTINGS,
  DRAWING_OPTIONS,
  INPUT_MODES,
  PLAYER_OPTIONS,
  VOTING_OPTIONS,
  formatSeconds,
  validateRoomSettings,
} from './roomRules.js'

function SelectField({ id, label, value, options, formatOption, error, onChange }) {
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 block w-full rounded-control border-2 bg-paper px-3 py-3 text-base ${
          error ? 'border-vermilion-deep' : 'border-ink'
        }`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-2 text-sm font-semibold text-vermilion-deep">
          {error}
        </p>
      )}
    </div>
  )
}

export default function CreateRoomForm({ onCreate, state, onClearFeedback }) {
  const [values, setValues] = useState(DEFAULT_SETTINGS)
  const [errors, setErrors] = useState({})
  const isSubmitting = state.status === 'submitting'

  function handleChange(event) {
    const { name, value } = event.target
    // Selects deliver strings; the API needs numbers.
    setValues((current) => ({
      ...current,
      [name]: name === 'inputMode' ? value : Number(value),
    }))
    setErrors({})
    if (state.status !== 'idle') onClearFeedback()
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const found = validateRoomSettings(values)
    setErrors(found)

    const firstInvalid = Object.keys(found).find((name) => found[name])
    if (firstInvalid) {
      const field = form.elements.namedItem(firstInvalid)
      if (field && typeof field.focus === 'function') field.focus()
      return
    }

    onCreate({
      maxPlayers: values.maxPlayers,
      drawingDuration: values.drawingDuration,
      votingDuration: values.votingDuration,
      inputMode: values.inputMode,
    })
  }

  return (
    <section
      id="create-room"
      aria-labelledby="create-heading"
      className="border-2 border-ink bg-sheet p-5 sm:p-6"
    >
      <h2 id="create-heading" className="font-display text-2xl font-medium tracking-tight">
        Create a room
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        You’ll be the host. Pick the rules, then share the code it gives you.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {state.status === 'error' && (
          <p
            role="alert"
            className="border-2 border-l-[6px] border-ink border-l-vermilion bg-paper px-4 py-3 text-sm font-semibold"
          >
            {state.error}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
          <SelectField
            id="maxPlayers"
            label="Maximum players"
            value={values.maxPlayers}
            options={PLAYER_OPTIONS}
            formatOption={(n) => `${n} players`}
            error={errors.maxPlayers}
            onChange={handleChange}
          />
          <SelectField
            id="drawingDuration"
            label="Drawing time"
            value={values.drawingDuration}
            options={DRAWING_OPTIONS}
            formatOption={formatSeconds}
            error={errors.drawingDuration}
            onChange={handleChange}
          />
          <SelectField
            id="votingDuration"
            label="Voting time"
            value={values.votingDuration}
            options={VOTING_OPTIONS}
            formatOption={formatSeconds}
            error={errors.votingDuration}
            onChange={handleChange}
          />
        </div>

        <fieldset
          aria-describedby={errors.inputMode ? 'inputMode-error' : undefined}
          className="min-w-0"
        >
          <legend className="text-sm font-semibold">How players draw</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {INPUT_MODES.map((mode) => (
              <label
                key={mode.value}
                className="flex cursor-pointer gap-3 border-2 border-ink/40 bg-paper p-3 has-checked:border-ink has-checked:bg-paper-deep"
              >
                <input
                  type="radio"
                  name="inputMode"
                  value={mode.value}
                  checked={values.inputMode === mode.value}
                  onChange={handleChange}
                  className="mt-1 size-4 shrink-0 accent-ink"
                />
                <span>
                  <span className="block font-semibold">{mode.label}</span>
                  <span className="block text-sm text-ink-soft">{mode.description}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.inputMode && (
            <p id="inputMode-error" className="mt-2 text-sm font-semibold text-vermilion-deep">
              {errors.inputMode}
            </p>
          )}
        </fieldset>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Creating room…' : 'Create room'}
        </Button>

        {/* Always rendered so the success message is announced when it appears */}
        <div role="status">
          {state.status === 'success' && state.room && (
            <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-paper px-4 py-3">
              <p className="text-sm font-semibold">Room created. Its code is:</p>
              <p className="mt-2 font-display text-3xl font-medium tracking-[0.14em]">
                {state.room.code}
              </p>
              <div className="mt-3">
                <CopyCodeButton code={state.room.code} />
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                Share this code so others can join. You’re the host.
              </p>
            </div>
          )}
        </div>
      </form>
    </section>
  )
}
~~~
--- END FILE: client/src/features/dashboard/CreateRoomForm.jsx ---


--- BEGIN FILE: client/src/features/dashboard/DashboardBackdrop.jsx ---
~~~
export default function DashboardBackdrop() {
  return (
    <>
      <style>{`
        @keyframes dashboardSketchDraw {
          0%   { stroke-dashoffset: 1; opacity: 0; }
          3%   { stroke-dashoffset: 1; opacity: 1; }
          25%  { stroke-dashoffset: 0; opacity: 1; }
          65%  { stroke-dashoffset: 0; opacity: 1; }
          78%  { stroke-dashoffset: 0; opacity: 0; }
          100% { stroke-dashoffset: 1; opacity: 0; }
        }
        .dashboard-sketch path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          opacity: 0;
          animation: dashboardSketchDraw var(--cycle, 14s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        .dashboard-sketch path:nth-child(even) {
          animation-delay: calc(var(--delay, 0s) + 0.2s);
        }
        @media (prefers-reduced-motion: reduce) {
          .dashboard-sketch path {
            animation: none;
            stroke-dashoffset: 0;
            opacity: 0.35;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Sun — top-right */}
        <svg
          className="dashboard-sketch absolute right-[3%] top-[6%] h-14 w-14 text-vermilion/25 sm:h-20 sm:w-20"
          style={{ '--cycle': '13s', '--delay': '1.5s' }}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength="1" d="M68 50 A18 18 0 1 1 32 50 A18 18 0 1 1 68 50" />
          <path pathLength="1" d="M50 18 L50 8" />
          <path pathLength="1" d="M50 82 L50 92" />
          <path pathLength="1" d="M18 50 L8 50" />
          <path pathLength="1" d="M82 50 L92 50" />
          <path pathLength="1" d="M27 27 L20 20" />
          <path pathLength="1" d="M73 73 L80 80" />
          <path pathLength="1" d="M73 27 L80 20" />
          <path pathLength="1" d="M27 73 L20 80" />
        </svg>

        {/* Pencil — bottom-left */}
        <svg
          className="dashboard-sketch absolute bottom-[6%] left-[2%] hidden h-16 w-24 text-ink/25 sm:block"
          style={{ '--cycle': '15s', '--delay': '0s' }}
          viewBox="0 0 96 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength="1" d="M6 42 L 78 6 L 90 24 L 18 42 Z" />
          <path pathLength="1" d="M78 6 L 74 2 L 84 10 Z" />
          <path pathLength="1" d="M6 42 L 14 44 L 18 42" />
          <path pathLength="1" d="M20 34 L 82 16" />
        </svg>

        {/* Bird — top-left */}
        <svg
          className="dashboard-sketch absolute left-[6%] top-[10%] h-7 w-12 text-ink/25 sm:h-9 sm:w-14"
          style={{ '--cycle': '12s', '--delay': '4s' }}
          viewBox="0 0 64 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength="1" d="M4 20 Q 16 8, 28 18 Q 40 8, 52 20" />
          <path pathLength="1" d="M52 20 Q 58 16, 60 18" />
        </svg>

        {/* Sparkle — mid-right */}
        <svg
          className="dashboard-sketch absolute right-[10%] top-[48%] hidden h-8 w-8 text-vermilion/30 sm:block"
          style={{ '--cycle': '10s', '--delay': '2.5s' }}
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path pathLength="1" d="M20 6 L20 34" />
          <path pathLength="1" d="M6 20 L34 20" />
          <path pathLength="1" d="M10 10 L30 30" />
          <path pathLength="1" d="M30 10 L10 30" />
        </svg>

        {/* Flower — bottom-right */}
        <svg
          className="dashboard-sketch absolute bottom-[4%] right-[4%] hidden h-20 w-16 text-ink/20 md:block"
          style={{ '--cycle': '16s', '--delay': '5.5s' }}
          viewBox="0 0 80 110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength="1" d="M40 105 Q 42 80, 40 55" />
          <path pathLength="1" d="M40 78 Q 22 76, 18 62 Q 32 60, 40 70" />
          <path pathLength="1" d="M40 88 Q 56 86, 62 72 Q 48 70, 40 80" />
          <path pathLength="1" d="M40 55 Q 30 42, 38 32 Q 46 40, 40 55" />
          <path pathLength="1" d="M40 55 Q 50 42, 42 32 Q 34 40, 40 55" />
          <path pathLength="1" d="M40 55 Q 30 55, 26 47 Q 36 44, 40 55" />
          <path pathLength="1" d="M40 55 Q 50 55, 54 47 Q 44 44, 40 55" />
          <path pathLength="1" d="M36 48 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0" />
        </svg>
      </div>
    </>
  )
}
~~~
--- END FILE: client/src/features/dashboard/DashboardBackdrop.jsx ---


--- BEGIN FILE: client/src/features/dashboard/DashboardBackground.jsx ---
~~~
/**
 * DashboardBackground
 *
 * A full-screen, fixed, continuously-animating hand-drawn illustration that
 * lives behind the entire dashboard UI. It never participates in layout —
 * the parent positions it with  `fixed inset-0 -z-10 pointer-events-none`.
 *
 * Technique: every <path> carries pathLength="1" and a CSS custom property
 * pair (--bg-cycle, --bg-delay). The @keyframes bgSketch animates
 * stroke-dashoffset from 1 → 0 (draw in), holds, then fades out and resets —
 * creating a seamless loop. Staggered cycles (9 s – 28 s) and delays
 * (0 s – 18 s) keep the composition constantly alive without any two strokes
 * moving in lockstep.
 *
 * Opacity is deliberately very low (ink at 8-14 %, vermilion at 12-18 %) so
 * the main content remains fully readable at all times.
 *
 * Accessibility: aria-hidden="true" on the SVG. Reduced-motion media query
 * freezes every path at its fully-drawn state (no animation, full opacity).
 */
export default function DashboardBackground() {
  return (
    <>
      <style>{`
        /* ── keyframes ────────────────────────────────────────────────── */
        @keyframes bgSketch {
          0%   { stroke-dashoffset: 1; opacity: 0;                     }
          4%   { stroke-dashoffset: 1; opacity: var(--bg-op, 1);       }
          32%  { stroke-dashoffset: 0; opacity: var(--bg-op, 1);       }
          68%  { stroke-dashoffset: 0; opacity: var(--bg-op, 1);       }
          84%  { stroke-dashoffset: 0; opacity: 0;                     }
          100% { stroke-dashoffset: 1; opacity: 0;                     }
        }

        /* ── shared path class ────────────────────────────────────────── */
        .bg-sk {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          fill: none;
          animation: bgSketch var(--bg-cycle, 16s) ease-in-out infinite;
          animation-delay: var(--bg-delay, 0s);
          will-change: stroke-dashoffset, opacity;
        }

        /* ── reduced-motion: freeze at fully drawn, very faint ────────── */
        @media (prefers-reduced-motion: reduce) {
          .bg-sk {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: calc(var(--bg-op, 1) * 0.6) !important;
          }
        }
      `}</style>

      {/*
        Single SVG that covers the viewport.
        viewBox is 1440 × 900 (common desktop aspect) with overflow:visible so
        paths can bleed beyond the box on larger screens.
        preserveAspectRatio="xMidYMid slice" scales up to cover, like a CSS
        background-size:cover.
      */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
        className="h-full w-full"
        fill="none"
      >

        {/* ════════════════════════════════════════════════════════════════
            ZONE A — TOP-LEFT QUADRANT
            A giant sprawling face profile: forehead arc → brow → nose →
            lips → chin. Drawn in slow, sweeping strokes.
            ════════════════════════════════════════════════════════════════ */}

        {/* Skull / forehead dome */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'24s','--bg-delay':'0s','--bg-op':0.13}}
          d="M -40 520 C 20 380, 80 200, 220 120 C 330 55, 430 70, 480 140"
          stroke="#14110f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Brow ridge */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'18s','--bg-delay':'3s','--bg-op':0.11}}
          d="M 180 210 C 220 195, 280 190, 340 205"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Eye socket arc */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'5s','--bg-op':0.12}}
          d="M 195 240 C 230 220, 310 218, 345 238 C 310 258, 230 260, 195 240 Z"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Pupil — vermilion circle */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'11s','--bg-delay':'6.5s','--bg-op':0.16}}
          d="M 255 240 A 18 18 0 1 1 255 239.9 Z"
          stroke="#e8441e" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Iris detail cross */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'9s','--bg-delay':'7s','--bg-op':0.14}}
          d="M 255 226 V 254 M 241 240 H 269"
          stroke="#e8441e" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Nose bridge + tip */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'20s','--bg-delay':'2s','--bg-op':0.10}}
          d="M 300 250 C 295 300, 280 340, 260 365 C 245 382, 220 390, 215 375"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Nostril flare */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'7.5s','--bg-op':0.09}}
          d="M 215 375 C 200 385, 190 390, 195 400 C 200 408, 225 402, 230 390"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Upper lip */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'9s','--bg-op':0.10}}
          d="M 175 440 C 200 430, 220 424, 240 428 C 225 418, 210 416, 195 420"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Lower lip + chin */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'18s','--bg-delay':'10.5s','--bg-op':0.10}}
          d="M 175 440 C 195 458, 230 462, 260 450 C 280 440, 295 418, 310 400"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Jaw line continuing off-screen */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'22s','--bg-delay':'8s','--bg-op':0.08}}
          d="M 310 400 C 360 350, 420 320, 480 340 C 540 360, 560 420, 520 480"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Neck column */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'20s','--bg-delay':'12s','--bg-op':0.08}}
          d="M 240 470 C 245 530, 238 600, 230 680"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Ear */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'4.5s','--bg-op':0.09}}
          d="M 170 270 C 148 285, 140 320, 155 345 C 165 360, 182 355, 185 340 C 175 330, 165 310, 172 295"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE B — TOP-RIGHT QUADRANT
            Sweeping vine / tendril system that blooms from the top-right
            corner and cascades diagonally.
            ════════════════════════════════════════════════════════════════ */}

        {/* Main vine trunk */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'1s','--bg-op':0.10}}
          d="M 1480 -40 C 1400 80, 1300 180, 1180 260 C 1060 340, 920 380, 840 460 C 760 540, 750 640, 780 740"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Branch 1 */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'19s','--bg-delay':'4s','--bg-op':0.09}}
          d="M 1300 180 C 1320 140, 1360 100, 1410 80"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Branch 2 */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'17s','--bg-delay':'6s','--bg-op':0.09}}
          d="M 1180 260 C 1220 230, 1270 215, 1310 225"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Leaf cluster 1 — small oval loops */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'7s','--bg-op':0.10}}
          d="M 1300 180 C 1280 162, 1260 170, 1268 185 C 1276 200, 1300 195, 1300 180 Z"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'8s','--bg-op':0.10}}
          d="M 1290 160 C 1275 144, 1255 152, 1263 167 C 1271 182, 1292 176, 1290 160 Z"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Leaf cluster 2 */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'15s','--bg-delay':'9s','--bg-op':0.09}}
          d="M 1060 340 C 1040 318, 1018 326, 1026 342 C 1034 358, 1062 352, 1060 340 Z"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'15s','--bg-delay':'10s','--bg-op':0.09}}
          d="M 1040 322 C 1022 304, 1002 314, 1012 330 C 1022 346, 1042 340, 1040 322 Z"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Leaf cluster 3 — vermilion accent leaf */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'11s','--bg-op':0.15}}
          d="M 920 380 C 900 358, 878 368, 888 385 C 898 402, 922 394, 920 380 Z"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>

        {/* Tendril curls */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'12s','--bg-delay':'5.5s','--bg-op':0.08}}
          d="M 840 460 C 860 440, 880 430, 890 440 C 900 450, 885 465, 870 460 C 856 455, 858 445, 866 444"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'12s','--bg-delay':'6.5s','--bg-op':0.08}}
          d="M 780 740 C 800 720, 820 710, 830 720 C 840 730, 825 745, 812 742 C 800 738, 802 728, 810 727"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Secondary vine off main trunk */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'22s','--bg-delay':'13s','--bg-op':0.08}}
          d="M 840 460 C 900 490, 980 500, 1040 480 C 1100 460, 1150 420, 1200 400"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE C — BOTTOM-LEFT QUADRANT
            A massive hand reaching up from the bottom edge — fingers
            spread, drawn as outline studies.
            ════════════════════════════════════════════════════════════════ */}

        {/* Palm base */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'2s','--bg-op':0.11}}
          d="M 60 940 C 80 880, 100 820, 120 780 C 140 740, 180 720, 200 740 C 220 760, 215 810, 200 850"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Thumb */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'18s','--bg-delay':'5s','--bg-op':0.10}}
          d="M 120 780 C 90 750, 62 730, 50 700 C 40 675, 55 658, 75 665 C 95 672, 110 695, 118 720"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Index finger */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'20s','--bg-delay':'7s','--bg-op':0.10}}
          d="M 200 740 C 210 700, 215 650, 210 610 C 208 590, 195 575, 182 582 C 169 590, 167 610, 172 640"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Middle finger */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'21s','--bg-delay':'8.5s','--bg-op':0.10}}
          d="M 220 735 C 235 690, 244 634, 238 590 C 234 566, 220 552, 205 560 C 192 568, 190 590, 194 620"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Ring finger */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'19s','--bg-delay':'10s','--bg-op':0.09}}
          d="M 240 748 C 255 710, 264 664, 258 628 C 254 608, 240 597, 228 606 C 216 615, 215 638, 220 662"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Pinky */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'17s','--bg-delay':'11.5s','--bg-op':0.09}}
          d="M 258 762 C 272 732, 278 698, 272 672 C 268 655, 255 648, 244 656 C 234 664, 234 682, 238 700"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Knuckle wrinkle lines */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'13s','--bg-op':0.07}}
          d="M 186 660 C 194 656, 202 658, 206 664 M 208 702 C 216 698, 224 700, 228 706 M 228 674 C 236 670, 244 672, 248 678 M 246 714 C 254 710, 262 712, 266 718"
          stroke="#14110f" strokeWidth="1.4" strokeLinecap="round"/>

        {/* Pencil in hand (index+thumb grip) — vermilion accent */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'6s','--bg-op':0.15}}
          d="M 140 680 L 198 584"
          stroke="#e8441e" strokeWidth="2.5" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'6.4s','--bg-op':0.13}}
          d="M 196 584 L 192 576 L 200 582 Z"
          stroke="#e8441e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE D — BOTTOM-RIGHT QUADRANT
            Large scrawled abstract letterforms / calligraphic gestures that
            don't resolve into real words — just the energy of writing.
            ════════════════════════════════════════════════════════════════ */}

        {/* Giant sweeping baseline arc */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'25s','--bg-delay':'3s','--bg-op':0.09}}
          d="M 900 920 C 1000 860, 1120 820, 1240 840 C 1360 860, 1440 900, 1500 860"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Scrawl stroke 1 — big looping "O-ish" form */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'20s','--bg-delay':'5s','--bg-op':0.09}}
          d="M 950 780 C 970 740, 1010 720, 1060 730 C 1110 740, 1130 775, 1120 810 C 1110 845, 1075 860, 1038 850 C 1002 840, 980 815, 990 790"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Scrawl stroke 2 — slanted "N-ish" thrust */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'17s','--bg-delay':'8s','--bg-op':0.09}}
          d="M 1160 700 V 800 L 1220 700 V 800"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Scrawl stroke 3 — wild ascending gesture */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'15s','--bg-delay':'10s','--bg-op':0.08}}
          d="M 1280 820 C 1310 790, 1340 750, 1360 700 C 1380 650, 1370 610, 1340 600"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Vermilion underline / emphasis slash */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'12s','--bg-delay':'9s','--bg-op':0.15}}
          d="M 940 830 C 990 822, 1060 828, 1120 820"
          stroke="#e8441e" strokeWidth="3" strokeLinecap="round"/>

        {/* Ink splatter blobs — small circle sketches */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'7s','--bg-op':0.13}}
          d="M 1310 870 A 5 5 0 1 1 1310 869.9 Z"
          stroke="#e8441e" strokeWidth="2.5" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'7.8s','--bg-op':0.10}}
          d="M 1330 858 A 3 3 0 1 1 1330 857.9 Z"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'8.4s','--bg-op':0.09}}
          d="M 1348 875 A 4 4 0 1 1 1348 874.9 Z"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE E — CENTRE BAND
            Light, airy horizontal scribble-lines that feel like faint
            blue-line ruled paper behind the content. Very low opacity.
            ════════════════════════════════════════════════════════════════ */}

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'0s','--bg-op':0.055}}
          d="M 0 310 C 240 302, 480 318, 720 308 C 960 298, 1200 314, 1440 306"
          stroke="#14110f" strokeWidth="1.2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'4s','--bg-op':0.045}}
          d="M 0 370 C 260 362, 520 378, 780 368 C 1040 358, 1240 374, 1440 366"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'8s','--bg-op':0.045}}
          d="M 0 430 C 200 422, 440 438, 680 428 C 920 418, 1160 434, 1440 426"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'12s','--bg-op':0.040}}
          d="M 0 490 C 280 482, 560 498, 840 488 C 1120 478, 1320 494, 1440 486"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'16s','--bg-op':0.040}}
          d="M 0 550 C 220 542, 460 558, 700 548 C 940 538, 1200 554, 1440 546"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE F — SCATTERED GEOMETRIC / EDITORIAL MARKS
            Tiny asterisks, registration crosses, and loop glyphs that feel
            like a sketchbook margin full of thinking-marks. These use the
            fastest cycles so the page always has micro-activity.
            ════════════════════════════════════════════════════════════════ */}

        {/* Top-centre asterisk cluster */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'9s','--bg-delay':'0s','--bg-op':0.10}}
          d="M 700 60 V 90 M 685 75 H 715 M 688 63 L 712 87 M 712 63 L 688 87"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'9s','--bg-delay':'2s','--bg-op':0.08}}
          d="M 760 40 V 64 M 748 52 H 772 M 750 42 L 770 62 M 770 42 L 750 62"
          stroke="#14110f" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Mid-left cross mark */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'11s','--bg-delay':'3s','--bg-op':0.09}}
          d="M 50 450 V 490 M 30 470 H 70"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Mid-right diamond */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'5s','--bg-op':0.09}}
          d="M 1390 400 L 1410 425 L 1390 450 L 1370 425 Z"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Vermilion registration cross — upper-right */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'4s','--bg-op':0.14}}
          d="M 1380 80 V 120 M 1360 100 H 1400"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'5s','--bg-op':0.12}}
          d="M 1370 90 L 1390 110 M 1390 90 L 1370 110"
          stroke="#e8441e" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Lower-left small loop */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'12s','--bg-delay':'6s','--bg-op':0.09}}
          d="M 380 820 C 395 800, 420 798, 430 812 C 440 826, 430 845, 412 848 C 394 851, 380 838, 380 820 Z"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Centre-right small loop — vermilion */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'11s','--bg-delay':'10s','--bg-op':0.13}}
          d="M 1100 200 C 1115 182, 1140 180, 1150 194 C 1160 208, 1150 226, 1133 229 C 1116 232, 1102 220, 1100 200 Z"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE G — ABSTRACT BIRD / SWALLOW FLOCK
            Quick M-shaped wing silhouettes scattered across the upper half,
            varying in size to convey depth.
            ════════════════════════════════════════════════════════════════ */}

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'2s','--bg-op':0.10}}
          d="M 520 80 C 535 68, 554 72, 564 85 C 574 72, 593 67, 608 80"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'2.5s','--bg-op':0.08}}
          d="M 564 85 L 563 96"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'4s','--bg-op':0.09}}
          d="M 590 120 C 601 111, 614 114, 621 124 C 628 114, 641 110, 652 120"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'4.4s','--bg-op':0.07}}
          d="M 621 124 L 620 132"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'18s','--bg-delay':'6s','--bg-op':0.08}}
          d="M 660 55 C 668 47, 677 50, 682 58 C 687 50, 696 46, 704 55"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Tiny distant birds */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'8s','--bg-op':0.07}}
          d="M 820 35 Q 828 28, 836 35 Q 844 28, 852 35"
          stroke="#14110f" strokeWidth="1.4" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'9s','--bg-op':0.06}}
          d="M 870 50 Q 876 44, 882 50 Q 888 44, 894 50"
          stroke="#14110f" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE H — LARGE SPIRAL / SCRIBBLE MASS (far-right mid-zone)
            A loosening spiral that looks like a pen testing pressure,
            the classic gesture every artist makes on a fresh page.
            ════════════════════════════════════════════════════════════════ */}

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'22s','--bg-delay':'14s','--bg-op':0.08}}
          d="M 1340 540
             C 1355 530, 1370 535, 1372 550
             C 1374 565, 1362 578, 1347 578
             C 1332 578, 1320 565, 1322 550
             C 1324 535, 1337 524, 1352 526
             C 1367 528, 1380 542, 1378 557
             C 1376 572, 1362 583, 1346 580"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Extended tail of the spiral */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'22s','--bg-delay':'15.5s','--bg-op':0.07}}
          d="M 1346 580 C 1340 585, 1334 586, 1330 582 C 1320 574, 1318 560, 1326 550"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE I — LONG DIAGONAL HATCHING (centre-left shadow mass)
            Parallel angled lines, like a shading pass over a form.
            Very faint — purely textural.
            ════════════════════════════════════════════════════════════════ */}

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'0s','--bg-op':0.055}}
          d="M 350 580 L 480 700"
          stroke="#14110f" strokeWidth="1.2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'1s','--bg-op':0.050}}
          d="M 370 558 L 510 688"
          stroke="#14110f" strokeWidth="1.1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'2s','--bg-op':0.045}}
          d="M 390 540 L 540 678"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'3s','--bg-op':0.040}}
          d="M 412 524 L 568 668"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'4s','--bg-op':0.036}}
          d="M 436 510 L 598 658"
          stroke="#14110f" strokeWidth="0.9" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'5s','--bg-op':0.032}}
          d="M 462 498 L 630 650"
          stroke="#14110f" strokeWidth="0.9" strokeLinecap="round"/>

      </svg>
    </>
  )
}

~~~
--- END FILE: client/src/features/dashboard/DashboardBackground.jsx ---


--- BEGIN FILE: client/src/features/dashboard/DashboardIllustration.jsx ---
~~~
function Stroke({
  d,
  cycle = '14s',
  delay = '0s',
  accent = false,
  width = 2,
  faint = false,
  opacity,
  className = '',
}) {
  return (
    <path
      d={d}
      pathLength="1"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`dash-stroke ${accent ? 'dash-accent' : faint ? 'dash-faint' : 'dash-ink'} ${className}`}
      style={{
        '--cycle': cycle,
        '--delay': delay,
        strokeWidth: width,
        ...(opacity !== undefined ? { '--max-op': opacity } : {}),
      }}
    />
  )
}

export default function DashboardIllustration() {
  return (
    <figure
      aria-hidden="true"
      className="pointer-events-none relative mx-auto w-full max-w-[36rem] select-none lg:max-w-none"
    >
      <style>{`
        @keyframes dashboardSketchDraw {
          0% {
            stroke-dashoffset: 1;
            opacity: 0;
          }
          5% {
            stroke-dashoffset: 1;
            opacity: var(--max-op, 1);
          }
          30% {
            stroke-dashoffset: 0;
            opacity: var(--max-op, 1);
          }
          70% {
            stroke-dashoffset: 0;
            opacity: var(--max-op, 1);
          }
          85% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 1;
            opacity: 0;
          }
        }

        .dash-stroke {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: dashboardSketchDraw var(--cycle, 14s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
          will-change: stroke-dashoffset, opacity;
        }

        .dash-ink {
          stroke: rgba(20, 17, 15, 0.22);
          stroke: color-mix(in srgb, var(--color-ink, #14110f) 22%, transparent);
        }

        .dash-faint {
          stroke: rgba(20, 17, 15, 0.13);
          stroke: color-mix(in srgb, var(--color-ink, #14110f) 13%, transparent);
        }

        .dash-accent {
          stroke: rgba(232, 68, 30, 0.38);
          stroke: color-mix(in srgb, var(--color-vermilion, #e8441e) 38%, transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .dash-stroke {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: var(--max-op, 1) !important;
          }
        }
      `}</style>

      {/* SVG canvas: 760x480 golden sketchbook ratio */}
      <svg
        viewBox="0 0 760 480"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="block h-auto w-full overflow-visible"
      >
        {/* ========================================================
            LAYER 1: DESK HORIZON & SKETCHBOOK PHYSICAL FOUNDATIONS
            ======================================================== */}
        {/* Horizon / Desk edge */}
        <Stroke
          d="M 28 442 L 732 442"
          cycle="22s"
          delay="0s"
          faint
          width={1.5}
        />

        {/* Outer hardcover depth / stacked page leaves */}
        <Stroke
          d="M 124 64 L 128 428 L 370 435"
          cycle="20s"
          delay="0.6s"
          faint
          width={1.5}
        />
        <Stroke
          d="M 626 64 L 622 428 L 370 435"
          cycle="20s"
          delay="0.9s"
          faint
          width={1.5}
        />

        {/* Left page contour */}
        <Stroke
          d="M 370 52 C 290 44, 210 48, 130 58 C 128 178, 126 300, 132 424 C 210 418, 290 424, 370 432"
          cycle="18s"
          delay="1.2s"
          width={2.5}
        />

        {/* Right page contour */}
        <Stroke
          d="M 370 52 C 450 44, 530 48, 618 58 C 620 178, 622 300, 616 424 C 530 418, 450 424, 370 432"
          cycle="18s"
          delay="1.5s"
          width={2.5}
        />

        {/* Center book spine seam */}
        <Stroke d="M 370 50 V 434" cycle="19s" delay="1.8s" width={2} />

        {/* Stitching thread loops binding the spine */}
        <Stroke
          d="M 363 85 C 370 79, 377 79, 377 85 C 377 91, 363 91, 363 85"
          cycle="16s"
          delay="2.1s"
          width={2}
        />
        <Stroke
          d="M 363 140 C 370 134, 377 134, 377 140 C 377 146, 363 146, 363 140"
          cycle="16s"
          delay="2.4s"
          width={2}
        />
        <Stroke
          d="M 363 195 C 370 189, 377 189, 377 195 C 377 201, 363 201, 363 195"
          cycle="16s"
          delay="2.7s"
          width={2}
        />
        <Stroke
          d="M 363 250 C 370 244, 377 244, 377 250 C 377 256, 363 256, 363 250"
          cycle="16s"
          delay="3.0s"
          width={2}
        />
        <Stroke
          d="M 363 305 C 370 299, 377 299, 377 305 C 377 311, 363 311, 363 305"
          cycle="16s"
          delay="3.3s"
          width={2}
        />
        <Stroke
          d="M 363 360 C 370 354, 377 354, 377 360 C 377 366, 363 366, 363 360"
          cycle="16s"
          delay="3.6s"
          width={2}
        />
        <Stroke
          d="M 363 415 C 370 409, 377 409, 377 415 C 377 421, 363 421, 363 415"
          cycle="16s"
          delay="3.9s"
          width={2}
        />

        {/* Top-right dog-ear page curl */}
        <Stroke
          d="M 590 57 L 618 85"
          cycle="17s"
          delay="2.3s"
          width={1.8}
        />
        <Stroke
          d="M 590 57 L 598 80 L 618 85"
          cycle="17s"
          delay="2.6s"
          width={1.8}
        />

        {/* ========================================================
            LAYER 2: STILL-LIFE TOOLS SCATTERED ACROSS DESK
            ======================================================== */}
        {/* Desk Ruler along bottom */}
        <Stroke
          d="M 180 448 L 560 448"
          cycle="21s"
          delay="1.0s"
          width={1.5}
        />
        <Stroke
          d="M 180 462 L 560 462"
          cycle="21s"
          delay="1.4s"
          width={1.5}
        />
        <Stroke
          d="M 220 448 V 455 M 260 448 V 455 M 300 448 V 455 M 340 448 V 455 M 380 448 V 455 M 420 448 V 455 M 460 448 V 455 M 500 448 V 455 M 540 448 V 455"
          cycle="19s"
          delay="2.0s"
          width={1.4}
        />
        <Stroke
          d="M 200 448 V 452 M 240 448 V 452 M 280 448 V 452 M 320 448 V 452 M 360 448 V 452 M 400 448 V 452 M 440 448 V 452 M 480 448 V 452 M 520 448 V 452"
          cycle="19s"
          delay="2.5s"
          faint
          width={1}
        />

        {/* Antique Glass Inkwell (Bottom Left) */}
        <Stroke
          d="M 52 440 L 126 440 L 132 385 L 116 352 L 62 352 L 46 385 Z"
          cycle="17s"
          delay="1.7s"
          width={2.4}
        />
        <Stroke
          d="M 74 352 V 334 H 104 V 352"
          cycle="17s"
          delay="2.1s"
          width={2}
        />
        <Stroke
          d="M 68 334 C 68 328, 110 328, 110 334 C 110 340, 68 340, 68 334 Z"
          cycle="17s"
          delay="2.5s"
          width={2}
        />
        <Stroke
          d="M 72 352 L 66 385 L 70 440 M 106 352 L 112 385 L 108 440"
          cycle="16s"
          delay="2.9s"
          faint
          width={1.4}
        />
        <Stroke
          d="M 52 396 C 76 390, 102 402, 126 396"
          cycle="15s"
          delay="3.3s"
          width={2}
        />
        <Stroke
          d="M 72 376 H 106 V 420 H 72 Z"
          cycle="16s"
          delay="3.7s"
          width={1.5}
        />
        <Stroke
          d="M 80 388 V 404 M 86 388 V 404 L 94 388 V 404 M 98 388 V 404"
          cycle="16s"
          delay="4.1s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 32 440 L 42 414 L 48 416 L 40 442 Z"
          cycle="17s"
          delay="4.5s"
          faint
          width={1.5}
        />

        {/* Dip Pen with pointed steel nib */}
        <Stroke
          d="M 20 275 L 78 328 L 76 331 L 18 278 Z"
          cycle="16s"
          delay="2.6s"
          width={2}
        />
        <Stroke
          d="M 78 328 L 94 342 L 91 344 L 76 331 Z"
          cycle="15s"
          delay="3.1s"
          width={2}
        />
        <Stroke
          d="M 94 342 L 85 334"
          cycle="15s"
          delay="3.5s"
          accent
          width={1.6}
        />

        {/* Brass Drafting Compass / Calipers (Top Left) */}
        <Stroke
          d="M 88 62 C 88 56, 98 56, 98 62 C 98 68, 88 68, 88 62 Z M 93 56 V 46"
          cycle="18s"
          delay="2.0s"
          width={2}
        />
        <Stroke
          d="M 90 66 L 62 152"
          cycle="18s"
          delay="2.4s"
          width={2}
        />
        <Stroke
          d="M 96 66 L 128 146"
          cycle="18s"
          delay="2.8s"
          width={2}
        />
        <Stroke
          d="M 126 138 L 134 160 L 129 162 L 122 140 Z"
          cycle="17s"
          delay="3.2s"
          faint
          width={1.4}
        />
        <Stroke
          d="M 76 102 C 92 106, 110 105, 116 97"
          cycle="17s"
          delay="3.6s"
          faint
          width={1.4}
        />

        {/* 2B Drafting Pencil & Shavings (Right Margin) */}
        <Stroke
          d="M 692 88 L 732 248 L 724 250 L 684 90 Z"
          cycle="19s"
          delay="1.9s"
          width={2}
        />
        <Stroke
          d="M 688 89 L 728 249"
          cycle="19s"
          delay="2.3s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 732 248 L 724 250 L 728 268 Z"
          cycle="18s"
          delay="2.7s"
          width={2}
        />
        <Stroke
          d="M 726 260 L 730 259 L 728 268 Z"
          cycle="18s"
          delay="3.1s"
          width={2}
        />
        <Stroke
          d="M 656 292 C 638 280, 636 312, 658 320 C 674 324, 682 305, 668 296 C 656 288, 644 300, 652 310"
          cycle="15s"
          delay="3.8s"
          faint
          width={1.5}
        />
        <Stroke
          d="M 658 296 C 646 292, 644 306, 656 312"
          cycle="15s"
          delay="4.2s"
          faint
          width={1.2}
        />

        {/* ========================================================
            LAYER 3: LEFT PAGE — THE PROMPT CARD & STUDY VIGNETTES
            ======================================================== */}
        {/* Masking tape strip pinning prompt card */}
        <Stroke
          d="M 226 78 L 278 76 L 277 90 L 225 92 Z"
          cycle="16s"
          delay="2.8s"
          faint
          width={1.5}
        />
        <Stroke
          d="M 238 79 L 237 91 M 266 77 L 265 89"
          cycle="16s"
          delay="3.2s"
          faint
          width={1}
        />

        {/* Prompt Card Frame */}
        <Stroke
          d="M 162 94 L 342 84 L 348 214 L 168 224 Z"
          cycle="15s"
          delay="3.5s"
          width={2.4}
        />
        <Stroke
          d="M 170 100 L 336 90"
          cycle="15s"
          delay="3.9s"
          faint
          width={1.2}
        />

        {/* Header eyebrow & text on prompt card */}
        <Stroke
          d="M 176 114 H 236"
          cycle="15s"
          delay="4.2s"
          width={1.5}
        />
        {/* Lettering for "PROMPT • ROUND 03" */}
        <Stroke
          d="M 176 126 H 183 M 179 126 V 134 M 187 126 V 134 M 187 126 H 193 C 195 126, 195 129, 193 129 H 187 M 191 129 L 194 134 M 199 126 C 203 126, 204 130, 204 130 C 204 130, 203 134, 199 134 C 195 134, 194 130, 194 130 C 194 130, 195 126, 199 126 Z"
          cycle="15s"
          delay="4.5s"
          faint
          width={1.2}
        />

        {/* Main Prompt Title: "A QUIET STORM" */}
        <Stroke
          d="M 176 154 L 182 140 L 188 154 M 178 150 H 186 M 198 147 C 198 142, 206 142, 206 147 C 206 152, 198 152, 198 147 Z M 204 150 L 208 154 M 213 141 V 151 C 213 154, 222 154, 222 151 V 141 M 227 141 V 153 M 227 141 H 234 M 227 147 H 232 M 227 153 H 234 M 239 141 H 245 M 242 141 V 153 M 239 153 H 245 M 249 141 H 257 M 253 141 V 153 M 265 143 C 263 141, 260 142, 260 145 C 260 149, 266 147, 266 151 C 266 154, 262 154, 259 152 M 270 141 H 278 M 274 141 V 153 M 282 141 V 153 M 282 141 H 288 C 291 141, 291 147, 288 147 H 282 M 287 147 L 291 153 M 298 147 C 298 142, 306 142, 306 147 C 306 152, 298 152, 298 147 Z M 311 153 V 141 L 316 149 L 321 141 V 153"
          cycle="14s"
          delay="4.7s"
          width={1.8}
        />

        {/* Subtitle cursive script: "inside a teacup" */}
        <Stroke
          d="M 178 174 C 188 168, 200 176, 212 170 C 224 166, 236 174, 248 168 C 260 164, 272 172, 284 168 C 296 165, 308 172, 320 168"
          cycle="14s"
          delay="5.1s"
          width={1.8}
        />
        <Stroke
          d="M 176 195 L 338 185"
          cycle="15s"
          delay="5.4s"
          faint
          width={1}
        />

        {/* Vermilion Favorite Seal on Prompt Card */}
        <Stroke
          d="M 324 170 C 334 162, 342 176, 334 186 C 324 192, 316 178, 324 170 Z"
          cycle="13s"
          delay="5.6s"
          accent
          width={2.2}
        />
        <Stroke
          d="M 322 178 L 327 182 L 335 172"
          cycle="13s"
          delay="6.0s"
          accent
          width={2}
        />

        {/* Study Vignette 1: The Teacup & Storm Cloud */}
        <Stroke
          d="M 205 320 C 240 330, 275 330, 310 320"
          cycle="14s"
          delay="4.6s"
          width={2}
        />
        <Stroke
          d="M 218 286 C 222 312, 246 320, 257 320 C 268 320, 292 312, 296 286"
          cycle="14s"
          delay="5.0s"
          width={2}
        />
        <Stroke
          d="M 218 286 C 238 292, 276 292, 296 286"
          cycle="14s"
          delay="5.3s"
          width={1.8}
        />
        <Stroke
          d="M 296 290 C 310 292, 311 308, 295 311"
          cycle="14s"
          delay="5.6s"
          width={1.8}
        />
        <Stroke
          d="M 224 289 C 242 295, 272 295, 290 289"
          cycle="14s"
          delay="5.9s"
          faint
          width={1.4}
        />

        {/* Billowing storm cloud rising from tea */}
        <Stroke
          d="M 232 272 C 222 262, 226 246, 242 248 C 248 236, 268 236, 274 246 C 284 240, 296 250, 292 262 C 300 270, 294 278, 282 277 C 272 279, 242 279, 232 272 Z"
          cycle="13s"
          delay="6.3s"
          width={2.2}
        />

        {/* Vermilion Lightning Bolt */}
        <Stroke
          d="M 260 254 L 255 266 H 262 L 256 278"
          cycle="11s"
          delay="6.7s"
          accent
          width={2.2}
        />

        {/* Rain Hatching */}
        <Stroke
          d="M 238 276 L 235 287 M 248 275 L 245 289 M 268 275 L 265 289 M 278 276 L 275 287"
          cycle="12s"
          delay="7.1s"
          faint
          width={1.2}
        />

        {/* Study Vignette 2: Crescent Moon & Script Notes */}
        <Stroke
          d="M 198 375 C 214 362, 214 395, 198 382 C 204 382, 206 375, 198 375 Z"
          cycle="14s"
          delay="6.6s"
          width={1.8}
        />
        <Stroke
          d="M 222 368 V 380 M 216 374 H 228"
          cycle="12s"
          delay="7.0s"
          accent
          width={1.5}
        />
        <Stroke
          d="M 242 374 C 256 371, 270 376, 284 372 C 298 369, 308 375, 318 372 M 242 387 C 254 384, 268 389, 280 385 C 292 382, 304 387, 314 384"
          cycle="13s"
          delay="7.4s"
          faint
          width={1.2}
        />

        {/* ========================================================
            LAYER 4: RIGHT PAGE — THE MASTERPIECE (PORTRAIT & HAND)
            ======================================================== */}
        {/* Forehead to nose bridge */}
        <Stroke
          d="M 466 142 C 461 154, 458 166, 452 176"
          cycle="14s"
          delay="2.8s"
          width={2.5}
        />
        {/* Nose tip & philtrum */}
        <Stroke
          d="M 452 176 C 447 184, 440 191, 436 193 C 444 195, 447 199, 443 204"
          cycle="14s"
          delay="3.2s"
          width={2.5}
        />
        {/* Lips */}
        <Stroke
          d="M 443 204 C 445 208, 442 213, 446 217 C 451 222, 444 226, 440 227"
          cycle="14s"
          delay="3.6s"
          width={2.5}
        />
        {/* Chin & Jawline */}
        <Stroke
          d="M 440 227 C 447 235, 458 237, 468 234 C 485 228, 498 214, 506 195"
          cycle="14s"
          delay="4.0s"
          width={2.5}
        />
        {/* Neckline front */}
        <Stroke
          d="M 464 237 C 466 260, 464 285, 458 310"
          cycle="14s"
          delay="4.4s"
          width={2}
        />
        {/* Neckline back / shoulder */}
        <Stroke
          d="M 506 215 C 516 245, 532 278, 556 315"
          cycle="14s"
          delay="4.8s"
          width={2}
        />

        {/* Expressive Eye & Brow */}
        <Stroke
          d="M 452 172 C 458 168, 468 170, 474 175"
          cycle="13s"
          delay="3.4s"
          width={2.2}
        />
        <Stroke
          d="M 454 175 C 460 178, 468 178, 472 175"
          cycle="13s"
          delay="3.8s"
          width={1.8}
        />
        <Stroke
          d="M 460 171 C 464 171, 467 174, 466 177 C 464 179, 460 178, 460 171 Z"
          cycle="13s"
          delay="4.2s"
          width={2}
        />
        {/* Vermilion Iris Accent */}
        <Stroke
          d="M 463 173 A 1.5 1.5 0 1 1 463 175 A 1.5 1.5 0 1 1 463 173 Z"
          cycle="11s"
          delay="4.5s"
          accent
          width={2}
        />
        <Stroke
          d="M 448 162 C 456 157, 468 158, 476 164"
          cycle="14s"
          delay="3.0s"
          width={2.2}
        />

        {/* Cheekbone & Jaw Hatching */}
        <Stroke
          d="M 460 190 C 472 195, 482 188, 490 182"
          cycle="13s"
          delay="4.6s"
          faint
          width={1.4}
        />
        <Stroke
          d="M 468 232 L 476 224 M 473 234 L 481 226 M 478 236 L 486 228 M 483 236 L 491 228 M 488 234 L 496 226"
          cycle="12s"
          delay="5.2s"
          faint
          width={1.2}
        />

        {/* Hair Waves Morphing Into The Universe */}
        <Stroke
          d="M 466 142 C 473 120, 503 106, 528 113 C 556 121, 566 146, 563 171"
          cycle="13s"
          delay="4.2s"
          width={2.2}
        />
        <Stroke
          d="M 478 128 C 496 110, 526 102, 549 116 C 571 130, 575 165, 559 190"
          cycle="13s"
          delay="4.7s"
          width={2}
        />
        <Stroke
          d="M 528 113 C 546 93, 576 97, 585 123 C 591 143, 581 169, 566 189"
          cycle="13s"
          delay="5.1s"
          width={2}
        />
        <Stroke
          d="M 563 171 C 561 211, 576 249, 569 291"
          cycle="13s"
          delay="5.5s"
          width={2}
        />
        <Stroke
          d="M 559 190 C 553 230, 563 265, 583 295"
          cycle="13s"
          delay="5.9s"
          width={1.8}
        />

        {/* Escaping Swallows / Living Ink Birds */}
        {/* Bird 1: Vermilion Soaring Bird */}
        <Stroke
          d="M 537 79 C 546 77, 559 81, 566 94 C 573 79, 586 74, 596 75"
          cycle="11s"
          delay="6.2s"
          accent
          width={2.5}
        />
        <Stroke
          d="M 566 94 L 569 105 L 564 102 L 561 105 Z"
          cycle="11s"
          delay="6.5s"
          accent
          width={2}
        />
        {/* Bird 2 */}
        <Stroke
          d="M 532 64 Q 544 51, 556 61 Q 568 51, 580 63"
          cycle="12s"
          delay="6.8s"
          width={2}
        />
        <Stroke
          d="M 556 61 L 555 71"
          cycle="12s"
          delay="7.1s"
          width={1.8}
        />
        {/* Bird 3 (Distant) */}
        <Stroke
          d="M 506 51 Q 513 43, 521 49 Q 529 43, 536 51"
          cycle="13s"
          delay="7.4s"
          faint
          width={1.5}
        />

        {/* Botanical Leaves in Hair */}
        <Stroke
          d="M 549 116 C 561 110, 571 102, 576 88"
          cycle="13s"
          delay="5.8s"
          width={1.5}
        />
        <Stroke
          d="M 563 107 C 565 99, 573 99, 571 107 C 569 111, 563 111, 563 107 Z"
          cycle="13s"
          delay="6.2s"
          width={1.5}
        />
        <Stroke
          d="M 573 95 C 577 89, 585 91, 583 97 C 579 101, 573 99, 573 95 Z"
          cycle="13s"
          delay="6.5s"
          width={1.5}
        />

        {/* Celestial Crescent & Constellation Starfield */}
        <Stroke
          d="M 515 130 C 528 122, 528 144, 515 138 C 522 138, 522 130, 515 130 Z"
          cycle="14s"
          delay="5.4s"
          width={1.8}
        />
        <Stroke
          d="M 538 142 L 552 135 L 562 150 M 552 135 L 545 155"
          cycle="14s"
          delay="5.8s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 538 138 V 146 M 534 142 H 542"
          cycle="12s"
          delay="6.2s"
          accent
          width={1.5}
        />
        <Stroke
          d="M 562 146 V 154 M 558 150 H 566"
          cycle="12s"
          delay="6.6s"
          accent
          width={1.5}
        />

        {/* The Artist's Hand & Pencil Actively Drawing */}
        {/* Pencil lead touching portrait jaw */}
        <Stroke
          d="M 468 234 L 472 237 L 474 235 Z"
          cycle="13s"
          delay="3.8s"
          accent
          width={2.2}
        />
        <Stroke
          d="M 468 234 L 480 242 L 485 237 Z"
          cycle="13s"
          delay="4.2s"
          width={2}
        />
        <Stroke
          d="M 480 242 L 528 274 L 533 268 L 485 237 Z"
          cycle="13s"
          delay="4.5s"
          width={2}
        />
        <Stroke
          d="M 482 239 L 530 271"
          cycle="13s"
          delay="4.8s"
          faint
          width={1.2}
        />

        {/* Hand Anatomical Study */}
        <Stroke
          d="M 495 252 C 498 247, 505 248, 508 255 C 516 248, 526 254, 532 264"
          cycle="13s"
          delay="5.1s"
          width={2.2}
        />
        <Stroke
          d="M 497 250 C 500 248, 504 250, 505 253"
          cycle="13s"
          delay="5.4s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 485 262 C 488 258, 494 260, 495 266 C 502 264, 510 270, 512 278"
          cycle="13s"
          delay="5.7s"
          width={2.2}
        />
        <Stroke
          d="M 532 264 C 545 276, 558 294, 566 314"
          cycle="13s"
          delay="6.0s"
          width={2.2}
        />
        <Stroke
          d="M 566 314 L 582 346 M 542 324 L 558 356 M 556 354 C 568 350, 578 346, 584 344"
          cycle="13s"
          delay="6.4s"
          width={2}
        />

        {/* ========================================================
            LAYER 5: MASTER VERMILION INK RIVER & SPLATTERS
            ======================================================== */}
        {/* Main calligraphic ink swirl ribbon */}
        <Stroke
          d="M 116 392 C 160 380, 240 435, 340 428 C 420 422, 500 442, 610 420 C 660 410, 690 385, 680 355 C 670 330, 640 338, 642 360 C 644 380, 672 388, 700 375"
          cycle="12s"
          delay="3.5s"
          accent
          width={3.2}
        />
        <Stroke
          d="M 124 398 C 170 388, 245 440, 342 433 C 422 427, 498 447, 608 426"
          cycle="12s"
          delay="4.0s"
          accent
          width={1.6}
        />

        {/* Vermilion ink splatter droplets */}
        <Stroke
          d="M 138 381 A 2.2 2.2 0 1 1 138 385.4 A 2.2 2.2 0 1 1 138 381 Z"
          cycle="11s"
          delay="4.8s"
          accent
          width={2.2}
        />
        <Stroke
          d="M 150 397 A 1.8 1.8 0 1 1 150 400.6 A 1.8 1.8 0 1 1 150 397 Z"
          cycle="11s"
          delay="5.3s"
          accent
          width={1.8}
        />
        <Stroke
          d="M 282 432 A 2 2 0 1 1 282 436 A 2 2 0 1 1 282 432 Z"
          cycle="12s"
          delay="5.8s"
          accent
          width={2}
        />
        <Stroke
          d="M 482 438 A 1.6 1.6 0 1 1 482 441.2 A 1.6 1.6 0 1 1 482 438 Z"
          cycle="12s"
          delay="6.3s"
          accent
          width={1.6}
        />
        <Stroke
          d="M 688 347 A 2 2 0 1 1 688 351 A 2 2 0 1 1 688 347 Z"
          cycle="10s"
          delay="6.7s"
          accent
          width={2}
        />
        <Stroke
          d="M 698 381 A 1.6 1.6 0 1 1 698 384.2 A 1.6 1.6 0 1 1 698 381 Z"
          cycle="10s"
          delay="7.1s"
          accent
          width={1.6}
        />

        {/* Editorial Notation Arrow & Notes */}
        <Stroke
          d="M 618 200 C 625 210, 615 225, 602 228 M 602 228 L 608 223 M 602 228 L 609 233"
          cycle="14s"
          delay="7.0s"
          faint
          width={1.5}
        />
        <Stroke
          d="M 618 194 C 624 192, 630 196, 636 193 C 642 190, 648 194, 654 192"
          cycle="14s"
          delay="7.4s"
          faint
          width={1.2}
        />

        {/* Editorial Registration Marks */}
        <Stroke
          d="M 148 68 H 160 M 154 62 V 74"
          cycle="18s"
          delay="1.0s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 590 412 H 602 M 596 406 V 418"
          cycle="18s"
          delay="1.5s"
          faint
          width={1.2}
        />
      </svg>
    </figure>
  )
}

~~~
--- END FILE: client/src/features/dashboard/DashboardIllustration.jsx ---


--- BEGIN FILE: client/src/features/dashboard/DashboardPage.jsx ---
~~~
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext.js'
import { getErrorMessage } from '../../lib/api.js'
import Logo from '../../components/brand/Logo.jsx'
import Button from '../../components/ui/Button.jsx'
import CreateRoomForm from './CreateRoomForm.jsx'
import JoinRoomForm from './JoinRoomForm.jsx'
import RoomList from './RoomList.jsx'
import DashboardBackground from './DashboardBackground.jsx'
import { createRoom, joinRoom, listRooms } from './roomsApi.js'
import { describeError, joinErrorMessage } from './roomRules.js'

const idleFeedback = { status: 'idle', room: null, error: '' }

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Sign-out
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')

  // Room list: null until the first successful load
  const [rooms, setRooms] = useState(null)
  const [listStatus, setListStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [listError, setListError] = useState('')
  const listControllerRef = useRef(null)

  // Create / join operations, each with its own state and in-flight guard
  const [createState, setCreateState] = useState(idleFeedback)
  const [joinState, setJoinState] = useState(idleFeedback)
  const createInFlight = useRef(false)
  const joinInFlight = useRef(false)

  // Loads the authoritative list. Starting a new load aborts the previous one,
  // so an obsolete response can never overwrite a newer one.
  const loadRooms = useCallback(async ({ announce = true } = {}) => {
    listControllerRef.current?.abort()
    const controller = new AbortController()
    listControllerRef.current = controller

    if (announce) {
      setListStatus('loading')
      setListError('')
    }

    try {
      const list = await listRooms(controller.signal)
      if (controller.signal.aborted) return
      setRooms(list)
      setListStatus('ready')
    } catch (error) {
      if (controller.signal.aborted || error.name === 'AbortError') return
      setListError(describeError(error, 'Something went wrong while loading your rooms.'))
      setListStatus('error')
    }
  }, [])

  useEffect(() => {
    loadRooms({ announce: false }) // initial state is already 'loading'
    return () => listControllerRef.current?.abort()
  }, [loadRooms])

  const handleCreate = useCallback(
    async (settings) => {
      if (createInFlight.current) return false
      createInFlight.current = true
      setCreateState({ status: 'submitting', room: null, error: '' })

      try {
        const room = await createRoom(settings)
        setCreateState({ status: 'success', room, error: '' })
        loadRooms() // refresh from the backend; the create response isn't a list row
        return true
      } catch (error) {
        setCreateState({
          status: 'error',
          room: null,
          error: describeError(error, 'The room could not be created. Please try again.'),
        })
        return false
      } finally {
        createInFlight.current = false
      }
    },
    [loadRooms],
  )

  const handleJoin = useCallback(
    async (code) => {
      if (joinInFlight.current) return false
      joinInFlight.current = true
      setJoinState({ status: 'submitting', room: null, error: '' })

      try {
        const room = await joinRoom(code)
        setJoinState({ status: 'success', room, error: '' })
        loadRooms()
        return true
      } catch (error) {
        setJoinState({ status: 'error', room: null, error: joinErrorMessage(error) })
        return false
      } finally {
        joinInFlight.current = false
      }
    },
    [loadRooms],
  )

  // Editing a form clears its old result, but never interrupts a request in flight.
  const clearCreateFeedback = useCallback(
    () => setCreateState((s) => (s.status === 'submitting' ? s : idleFeedback)),
    [],
  )
  const clearJoinFeedback = useCallback(
    () => setJoinState((s) => (s.status === 'submitting' ? s : idleFeedback)),
    [],
  )

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)
    setSignOutError('')
    try {
      await logout()
      navigate('/', { replace: true })
    } catch (err) {
      setSignOutError(`You are still signed in. ${getErrorMessage(err, 'Signing out failed.')}`)
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-dvh overflow-x-clip">
      {/* Full-screen animated sketch background — fixed behind everything,
          never participates in layout, fully aria-hidden inside. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <DashboardBackground />
      </div>

      <header className="border-b border-ink/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Logo />
          <div className="flex items-center gap-4">
            <p className="hidden max-w-[14rem] truncate text-sm text-ink-soft sm:block">
              Signed in as <span className="font-semibold text-ink">{user.username}</span>
            </p>
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
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        {signOutError && (
          <p
            role="alert"
            className="mb-8 border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
          >
            {signOutError}
          </p>
        )}

        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
            Dashboard
          </p>
          <h1 className="mt-3 text-balance font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Your drawing rooms
          </h1>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Create a room and share its code, or join a friend's with theirs. Every room
            you're part of is listed here.
          </p>

          {/* On small screens the forms sit below the list, so offer shortcuts to them */}
          <div className="mt-6 flex flex-wrap gap-3 lg:hidden">
            <Button href="#create-room" size="sm">
              Create a room
            </Button>
            <Button href="#join-room" size="sm" variant="secondary">
              Join with a code
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <section aria-labelledby="rooms-heading" className="lg:col-span-7">
            <h2
              id="rooms-heading"
              className="mb-5 border-b-2 border-ink pb-3 font-display text-2xl font-medium tracking-tight"
            >
              Your rooms
            </h2>
            <RoomList
              rooms={rooms}
              status={listStatus}
              error={listError}
              onRetry={() => loadRooms()}
            />
          </section>

          <div className="space-y-10 lg:col-span-5">
            <CreateRoomForm
              onCreate={handleCreate}
              state={createState}
              onClearFeedback={clearCreateFeedback}
            />
            <JoinRoomForm
              onJoin={handleJoin}
              state={joinState}
              onClearFeedback={clearJoinFeedback}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

~~~
--- END FILE: client/src/features/dashboard/DashboardPage.jsx ---


--- BEGIN FILE: client/src/features/dashboard/JoinRoomForm.jsx ---
~~~
import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import TextField from '../../components/ui/TextField.jsx'
import { normalizeRoomCode, validateRoomCode } from './roomRules.js'

export default function JoinRoomForm({ onJoin, state, onClearFeedback }) {
  const [code, setCode] = useState('')
  const [touched, setTouched] = useState(false)
  const isSubmitting = state.status === 'submitting'
  const canSubmit = code.length >= 6

  // Inline feedback appears after the field is left, and only for a non-empty code.
  const clientError = touched && code ? validateRoomCode(code) : ''

  function handleChange(event) {
    setCode(normalizeRoomCode(event.target.value))
    if (state.status !== 'idle') onClearFeedback()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    if (validateRoomCode(code)) {
      setTouched(true)
      return
    }

    const joined = await onJoin(code)
    if (joined) {
      setCode('')
      setTouched(false)
    }
  }

  return (
    <section
      id="join-room"
      aria-labelledby="join-heading"
      className="border-t-2 border-ink pt-6"
    >
      <h2 id="join-heading" className="font-display text-2xl font-medium tracking-tight">
        Join with a code
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Got a code from a host? Enter it to take a seat.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {state.status === 'error' && (
          <p
            role="alert"
            className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
          >
            {state.error}
          </p>
        )}

        <TextField
          id="roomCode"
          label="Room code"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={8}
          required
          value={code}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          hint="6–8 letters or numbers."
          error={clientError}
          inputClassName="font-semibold uppercase tracking-[0.18em]"
        />

        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={!canSubmit || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Joining…' : 'Join room'}
        </Button>

        <div role="status">
          {state.status === 'success' && state.room && (
            <p className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm">
              <span className="font-semibold">You joined room </span>
              <span className="font-display text-lg font-medium tracking-[0.14em]">
                {state.room.code}
              </span>
              <span className="font-semibold">.</span>
              <span className="mt-1 block text-ink-soft">It will show up in your rooms.</span>
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
~~~
--- END FILE: client/src/features/dashboard/JoinRoomForm.jsx ---


--- BEGIN FILE: client/src/features/dashboard/RoomCard.jsx ---
~~~
import CopyCodeButton from './CopyCodeButton.jsx'
import {
  formatInputMode,
  formatRole,
  formatSeconds,
  formatStatus,
} from './roomRules.js'

function Fact({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">
        {label}
      </dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  )
}

// Expects a row from GET /api/rooms (snake_case, with role and member_count).
export default function RoomCard({ room }) {
  const isHost = room.role === 'host'

  return (
    <article
      aria-label={`Room ${room.code}`}
      className="grid border-2 border-ink bg-sheet sm:grid-cols-[12rem_1fr]"
    >
      <div className="flex flex-col items-start gap-3 border-b-2 border-dashed border-ink/50 p-4 sm:border-b-0 sm:border-r-2">
        <span
          className={`border-2 border-ink px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] ${
            isHost ? 'bg-vermilion text-ink' : 'bg-transparent'
          }`}
        >
          {formatRole(room.role)}
        </span>
        <p className="break-all font-display text-2xl font-medium tracking-[0.1em]">
          {room.code}
        </p>
        <CopyCodeButton code={room.code} />
      </div>

      <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-4 p-4 text-sm sm:grid-cols-3">
        <Fact label="Players" value={`${room.member_count} of ${room.max_players}`} />
        <Fact label="Mode" value={formatInputMode(room.input_mode)} />
        <Fact label="Status" value={formatStatus(room.status)} />
        <Fact label="Drawing" value={formatSeconds(room.drawing_duration)} />
        <Fact label="Voting" value={formatSeconds(room.voting_duration)} />
      </dl>
    </article>
  )
}
~~~
--- END FILE: client/src/features/dashboard/RoomCard.jsx ---


--- BEGIN FILE: client/src/features/dashboard/RoomList.jsx ---
~~~
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
~~~
--- END FILE: client/src/features/dashboard/RoomList.jsx ---


--- BEGIN FILE: client/src/features/dashboard/roomRules.js ---
~~~
import { ApiError, getErrorMessage } from '../../lib/api.js'

// ---- Options and defaults (mirror the backend's create-room rules) ----------

const range = (start, end, step = 1) =>
  Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step)

export const DEFAULT_SETTINGS = {
  maxPlayers: 6,
  drawingDuration: 60,
  votingDuration: 30,
  inputMode: 'canvas',
}

export const PLAYER_OPTIONS = range(3, 10)
export const DRAWING_OPTIONS = range(30, 180, 15) // backend requires steps of 15
export const VOTING_OPTIONS = range(15, 90, 15) // backend allows any 15-90; steps of 15 keep the list short

export const INPUT_MODES = [
  { value: 'canvas', label: 'Canvas', description: 'Draw digitally in the browser.' },
  { value: 'photo', label: 'Photo', description: 'Draw on paper, then capture a photo.' },
]

// ---- Labels ----------------------------------------------------------------

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

export function formatSeconds(seconds) {
  return `${seconds} seconds`
}

export function formatInputMode(mode) {
  return INPUT_MODES.find((item) => item.value === mode)?.label ?? capitalize(String(mode))
}

// Only "waiting" is documented, so unknown statuses are shown as returned
// rather than being relabelled as something the data doesn't say.
export function formatStatus(status) {
  if (status === 'waiting') return 'Waiting'
  return capitalize(String(status).replace(/_/g, ' '))
}

export function formatRole(role) {
  if (role === 'host') return 'Host'
  if (role === 'player') return 'Player'
  return capitalize(String(role))
}

// ---- Validation (the server stays authoritative) ---------------------------

// Returns { field: message } with '' for valid fields.
export function validateRoomSettings(values) {
  const { maxPlayers, drawingDuration, votingDuration, inputMode } = values
  return {
    maxPlayers:
      Number.isInteger(maxPlayers) && maxPlayers >= 3 && maxPlayers <= 10
        ? ''
        : 'Choose 3–10 players.',
    drawingDuration:
      Number.isInteger(drawingDuration) &&
      drawingDuration >= 30 &&
      drawingDuration <= 180 &&
      drawingDuration % 15 === 0
        ? ''
        : 'Choose 30–180 seconds in steps of 15.',
    votingDuration:
      Number.isInteger(votingDuration) && votingDuration >= 15 && votingDuration <= 90
        ? ''
        : 'Choose 15–90 seconds.',
    inputMode: INPUT_MODES.some((mode) => mode.value === inputMode)
      ? ''
      : 'Choose canvas or photo.',
  }
}

// Room codes are uppercase letters and digits. Applied as the person types.
export function normalizeRoomCode(raw) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
}

export function validateRoomCode(raw) {
  const code = raw.trim().toUpperCase()
  if (!code) return 'Enter a room code.'
  if (!/^[A-Z0-9]+$/.test(code)) return 'Room codes use letters and numbers only.'
  if (code.length < 6 || code.length > 8) return 'Room codes are 6–8 characters.'
  return ''
}

// ---- Error wording ---------------------------------------------------------

// Shared wording for failures. An expired session is reported honestly;
// this never touches the session or cookie itself.
export function describeError(error, fallback) {
  if (error instanceof ApiError && error.status === 401) {
    return 'Your session has expired. Log in again to continue.'
  }
  return getErrorMessage(error, fallback)
}

const JOIN_MESSAGES = {
  ROOM_NOT_FOUND: 'No room matches that code. Check it and try again.',
  ROOM_NOT_JOINABLE: 'That room is no longer accepting players.',
  ALREADY_IN_ROOM: 'You’re already in that room.',
  ROOM_FULL: 'That room is full.',
}

export function joinErrorMessage(error) {
  if (error instanceof ApiError && JOIN_MESSAGES[error.code]) {
    return JOIN_MESSAGES[error.code]
  }
  return describeError(error, 'Could not join the room. Please try again.')
}
~~~
--- END FILE: client/src/features/dashboard/roomRules.js ---


--- BEGIN FILE: client/src/features/dashboard/roomsApi.js ---
~~~
import { ApiError, apiFetch } from '../../lib/api.js'

function unexpectedResponse() {
  return new ApiError({
    status: 200,
    code: 'UNEXPECTED_RESPONSE',
    message: 'The server sent a response the app could not understand.',
  })
}

// GET /api/rooms -> data.rooms (snake_case, includes role and member_count)
export async function listRooms(signal) {
  const payload = await apiFetch('/api/rooms', { signal })
  const rooms = payload?.data?.rooms
  if (!Array.isArray(rooms)) throw unexpectedResponse()
  return rooms
}

// POST /api/rooms -> data.room (the inserted row: no role, no member_count)
export async function createRoom(settings) {
  const payload = await apiFetch('/api/rooms', { method: 'POST', body: settings })
  const room = payload?.data?.room
  if (!room) throw unexpectedResponse()
  return room
}

// POST /api/rooms/join -> data.room (camelCase: hostUserId, maxPlayers)
export async function joinRoom(code) {
  const payload = await apiFetch('/api/rooms/join', { method: 'POST', body: { code } })
  const room = payload?.data?.room
  if (!room) throw unexpectedResponse()
  return room
}
~~~
--- END FILE: client/src/features/dashboard/roomsApi.js ---


--- BEGIN FILE: client/src/features/room/ChatPanel.jsx ---
~~~
// ChatPanel: persistent realtime chat sidebar / bottom-sheet.
//
// Renders the message list and the compose field.
// Designed to be used inside RoomLayout on the right column.
//
// Props:
//   code          – room code (string)
//   socketStatus  – 'connecting' | 'joined' | 'error' | 'revoked'
//   currentUser   – { username } from AuthContext
//   isOpen        – whether the panel is visible (mobile toggle)
//   onClose       – called when the close button is pressed (mobile)

import { useEffect, useRef, useState } from 'react'
import { useChat } from './useChat.js'
import { MessageSquare, Send, X } from 'lucide-react'

// Format a UTC ISO timestamp to a compact local time string.
function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function ChatMessage({ message, isOwn }) {
  return (
    <div className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className="flex items-baseline gap-2">
        {!isOwn && (
          <span className="text-xs font-semibold text-ink">{message.username}</span>
        )}
        <span className="text-xs text-ink-faint">{formatTime(message.createdAt)}</span>
        {isOwn && (
          <span className="text-xs font-semibold text-ink">You</span>
        )}
      </div>
      <div
        className={`max-w-[80%] break-words rounded-control border-2 px-3 py-2 text-sm ${
          isOwn
            ? 'border-ink bg-ink text-paper'
            : 'border-ink/30 bg-sheet text-ink'
        }`}
      >
        {/* Rendered as text — never injected as HTML */}
        {message.content}
      </div>
    </div>
  )
}

function HistoryStatus({ status, error }) {
  if (status === 'loading') {
    return (
      <p className="py-4 text-center text-xs text-ink-faint" role="status">
        Loading messages…
      </p>
    )
  }
  if (status === 'error') {
    return (
      <p className="py-4 text-center text-xs font-semibold text-vermilion-deep" role="alert">
        {error}
      </p>
    )
  }
  return null
}

export default function ChatPanel({ code, socketStatus, currentUser, isOpen, onClose }) {
  const {
    messages,
    historyStatus,
    historyError,
    sendMessage,
    isSending,
    sendError,
    clearSendError,
    MAX_MESSAGE_LENGTH,
  } = useChat({ code, socketStatus })

  const [draft, setDraft] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to the bottom when new messages arrive.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const trimmed = draft.trim()
    if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH || isSending) return
    sendMessage(trimmed)
    setDraft('')
    clearSendError()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isRevoked = socketStatus === 'revoked'
  const isConnecting = socketStatus === 'connecting' || socketStatus === 'error'

  return (
    <aside
      aria-label="Room chat"
      className={`flex flex-col border-2 border-ink bg-sheet ${
        // Mobile: absolute overlay from the bottom, toggled by isOpen
        // Desktop: always visible as a flex column
        isOpen ? 'flex' : 'hidden lg:flex'
      } fixed inset-0 z-30 lg:static lg:z-auto lg:inset-auto`}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-ink-soft" aria-hidden="true" />
          <span className="text-sm font-semibold">Chat</span>
          {isConnecting && (
            <span className="text-xs text-ink-faint">(reconnecting…)</span>
          )}
        </div>
        {/* Close button — only shown on mobile */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-control border-2 border-ink p-1 hover:bg-ink hover:text-paper lg:hidden"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-3" role="log" aria-live="polite" aria-label="Chat messages">
        <HistoryStatus status={historyStatus} error={historyError} />

        {historyStatus === 'ready' && messages.length === 0 && (
          <p className="py-4 text-center text-xs text-ink-faint">
            No messages yet. Say hello!
          </p>
        )}

        <div className="space-y-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwn={msg.username === currentUser?.username}
            />
          ))}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Send error */}
      {sendError && (
        <p
          role="alert"
          className="mx-4 mb-1 border-2 border-l-[4px] border-ink border-l-vermilion bg-paper px-3 py-2 text-xs font-semibold"
        >
          {sendError}
        </p>
      )}

      {/* Revoked state */}
      {isRevoked ? (
        <div className="border-t-2 border-ink px-4 py-3">
          <p className="text-xs text-ink-faint">Chat is no longer available.</p>
        </div>
      ) : (
        /* Compose area */
        <div className="border-t-2 border-ink p-3">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (sendError) clearSendError()
              }}
              onKeyDown={handleKeyDown}
              placeholder={isConnecting ? 'Connecting…' : 'Message…'}
              disabled={isConnecting || isSending}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={1}
              aria-label="Chat message"
              className="flex-1 resize-none rounded-control border-2 border-ink bg-paper px-3 py-2 text-sm disabled:opacity-50"
              style={{ minHeight: '2.5rem', maxHeight: '6rem' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim() || isConnecting || isSending}
              aria-label="Send message"
              className="inline-flex items-center justify-center rounded-control border-2 border-ink px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-50"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </div>
          {draft.length > MAX_MESSAGE_LENGTH * 0.9 && (
            <p className="mt-1 text-right text-xs text-ink-faint">
              {draft.length}/{MAX_MESSAGE_LENGTH}
            </p>
          )}
        </div>
      )}
    </aside>
  )
}

~~~
--- END FILE: client/src/features/room/ChatPanel.jsx ---


--- BEGIN FILE: client/src/features/room/LobbyView.jsx ---
~~~
// LobbyView: displays real room data and current members in the waiting state.
//
// Props:
//   room          – room object from GET /api/rooms/:code
//   members       – member array from GET /api/rooms/:code/members
//   currentUser   – { username, ... } from AuthContext
//   onLeave       – async function() called when the user clicks "Leave room"

import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import { formatInputMode, formatSeconds, formatStatus } from '../dashboard/roomRules.js'
import { Crown, Users } from 'lucide-react'

function MemberRow({ member, isCurrentUser }) {
  const isHost = member.role === 'host'
  return (
    <li className="flex items-center gap-3 py-2">
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-control border-2 text-xs font-bold ${
          isHost ? 'border-vermilion bg-vermilion text-ink' : 'border-ink/40 bg-paper text-ink'
        }`}
        aria-hidden="true"
      >
        {member.username.charAt(0).toUpperCase()}
      </div>
      <span className="flex-1 truncate text-sm font-semibold">
        {member.username}
        {isCurrentUser && <span className="ml-1 text-ink-faint font-normal">(you)</span>}
      </span>
      {isHost && (
        <span
          className="inline-flex items-center gap-1 border-2 border-ink bg-vermilion px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.1em]"
          aria-label="Host"
        >
          <Crown className="size-3" aria-hidden="true" />
          Host
        </span>
      )}
    </li>
  )
}

function SettingRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2 text-sm">
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

export default function LobbyView({ room, members, currentUser, onLeave }) {
  const [isLeaving, setIsLeaving] = useState(false)
  const [leaveError, setLeaveError] = useState('')

  async function handleLeave() {
    if (isLeaving) return
    setIsLeaving(true)
    setLeaveError('')
    try {
      await onLeave()
    } catch (err) {
      setLeaveError(err?.message ?? 'Could not leave the room. Please try again.')
      setIsLeaving(false)
    }
  }

  const isHost = room.role === 'host'
  const waitingForMore = members.length < room.max_players

  return (
    <div className="space-y-8">
      {/* Status banner */}
      <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
          {formatStatus(room.status)}
        </p>
        <p className="mt-1 font-display text-xl font-medium leading-snug">
          {waitingForMore
            ? `Waiting for players… ${members.length} of ${room.max_players} joined`
            : `Room full — ${members.length} of ${room.max_players} players ready`}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {isHost
            ? 'You are the host. The game will start once everyone is ready. (Game start coming in a future update.)'
            : 'Waiting for the host to start the game.'}
        </p>
      </div>

      {/* Members */}
      <section aria-labelledby="members-heading">
        <h2
          id="members-heading"
          className="mb-3 flex items-center gap-2 border-b-2 border-ink pb-2 font-display text-lg font-medium tracking-tight"
        >
          <Users className="size-5" aria-hidden="true" />
          Players ({members.length}/{room.max_players})
        </h2>
        {members.length === 0 ? (
          <p className="text-sm text-ink-faint">No members found.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {members.map((member) => (
              <MemberRow
                key={member.user_id}
                member={member}
                isCurrentUser={member.username === currentUser?.username}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Room settings */}
      <section aria-labelledby="settings-heading">
        <h2
          id="settings-heading"
          className="mb-3 border-b-2 border-ink pb-2 font-display text-lg font-medium tracking-tight"
        >
          Room settings
        </h2>
        <div className="divide-y divide-ink/10">
          <SettingRow label="Max players" value={room.max_players} />
          <SettingRow label="Drawing time" value={formatSeconds(room.drawing_duration)} />
          <SettingRow label="Voting time" value={formatSeconds(room.voting_duration)} />
          <SettingRow label="Draw mode" value={formatInputMode(room.input_mode)} />
        </div>
      </section>

      {/* Leave error */}
      {leaveError && (
        <p
          role="alert"
          className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
        >
          {leaveError}
        </p>
      )}

      {/* Actions */}
      <div className="pt-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLeave}
          disabled={isLeaving}
          aria-busy={isLeaving}
        >
          {isLeaving ? 'Leaving…' : 'Leave room'}
        </Button>
      </div>
    </div>
  )
}

~~~
--- END FILE: client/src/features/room/LobbyView.jsx ---


--- BEGIN FILE: client/src/features/room/roomApi.js ---
~~~
import { ApiError, apiFetch } from '../../lib/api.js'

function unexpectedResponse() {
  return new ApiError({
    status: 200,
    code: 'UNEXPECTED_RESPONSE',
    message: 'The server sent a response the app could not understand.',
  })
}

// GET /api/rooms/:code  (caller must be a member)
// Returns the room object (snake_case fields from DB + role).
export async function getRoom(code, signal) {
  const payload = await apiFetch(`/api/rooms/${encodeURIComponent(code)}`, { signal })
  const room = payload?.data?.room
  if (!room) throw unexpectedResponse()
  return room
}

// GET /api/rooms/:code/members  (caller must be a member)
// Returns array of { user_id, username, role, joined_at }.
export async function getRoomMembers(code, signal) {
  const payload = await apiFetch(`/api/rooms/${encodeURIComponent(code)}/members`, { signal })
  const members = payload?.data?.members
  if (!Array.isArray(members)) throw unexpectedResponse()
  return members
}

// DELETE /api/rooms/:code/members/me
// Returns { deleted, code, roomId }.
export async function leaveRoom(code) {
  const payload = await apiFetch(`/api/rooms/${encodeURIComponent(code)}/members/me`, {
    method: 'DELETE',
  })
  const data = payload?.data
  if (!data) throw unexpectedResponse()
  return data
}

~~~
--- END FILE: client/src/features/room/roomApi.js ---


--- BEGIN FILE: client/src/features/room/RoomPage.jsx ---
~~~
// RoomPage: the top-level page for /rooms/:code.
//
// Architecture:
//   RoomPage
//   ├── useRoomData          – HTTP fetch of room + members
//   ├── useRoomSocket        – socket join + access_revoked handler
//   ├── RoomLayout (shell)   – header, two-column grid, persistent ChatPanel
//   │   ├── main content area → phase-specific view (LobbyView now)
//   │   └── ChatPanel
//   └── handles loading / error / not-found / access-revoked states

import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext.js'
import { useRoomData } from './useRoomData.js'
import { useRoomSocket } from './useRoomSocket.js'
import { leaveRoom } from './roomApi.js'
import LobbyView from './LobbyView.jsx'
import ChatPanel from './ChatPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import Logo from '../../components/brand/Logo.jsx'
import CopyCodeButton from '../dashboard/CopyCodeButton.jsx'
import PageLoader from '../../components/ui/PageLoader.jsx'
import { MessageSquare } from 'lucide-react'

// ── Access-revoked overlay ────────────────────────────────────────────────────
function AccessRevokedBanner({ payload, onBackToDashboard }) {
  const isDeleted = payload?.code === 'ROOM_DELETED'
  return (
    <div className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
          {isDeleted ? 'Room deleted' : 'You have left'}
        </p>
        <h1 className="mt-3 text-balance font-display text-3xl font-medium leading-tight tracking-tight">
          {payload?.message ?? (isDeleted ? 'This room no longer exists.' : 'You have left this room.')}
        </h1>
        <div className="mt-8">
          <Button onClick={onBackToDashboard}>Back to dashboard</Button>
        </div>
      </div>
    </div>
  )
}

// ── Room error / not-found states ─────────────────────────────────────────────
function RoomError({ status, error, onRetry }) {
  const navigate = useNavigate()

  if (status === 'not_found') {
    return (
      <div className="grid min-h-dvh place-items-center px-5 py-10">
        <div className="w-full max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
            Not found
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight">
            Room not found or you're not a member.
          </h1>
          <p className="mt-4 text-sm text-ink-soft">
            The room code may be invalid, or you may not have joined this room.
          </p>
          <div className="mt-8">
            <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'forbidden') {
    return (
      <div className="grid min-h-dvh place-items-center px-5 py-10">
        <div className="w-full max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
            Session expired
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight">
            Your session has expired.
          </h1>
          <p className="mt-4 text-sm text-ink-soft">Please log in again.</p>
          <div className="mt-8">
            <Button onClick={() => navigate('/login')}>Log in</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
          Error
        </p>
        <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight">
          Could not load the room.
        </h1>
        <p
          role="alert"
          className="mt-4 border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
        >
          {error}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onRetry}>Try again</Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main RoomPage ──────────────────────────────────────────────────────────────
export default function RoomPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // HTTP data
  const { room, members, status, error, refresh, retry } = useRoomData(code)

  // Access revocation state
  const [revokedPayload, setRevokedPayload] = useState(null)

  const handleAccessRevoked = useCallback((payload) => {
    setRevokedPayload(payload)
  }, [])

  // Socket lifecycle
  const { socketStatus, socketError } = useRoomSocket({
    code: code?.toUpperCase(),
    onAccessRevoked: handleAccessRevoked,
  })

  // Mobile chat panel toggle
  const [chatOpen, setChatOpen] = useState(false)

  // ── Leave ────────────────────────────────────────────────────────────────
  const handleLeave = useCallback(async () => {
    await leaveRoom(code)
    // The backend will emit room:access_revoked to our socket, which sets
    // revokedPayload. As a fallback, navigate to dashboard if it hasn't fired
    // within a short window.
    setTimeout(() => {
      setRevokedPayload((prev) => prev ?? { code: 'ROOM_LEFT', message: 'You have left this room.' })
    }, 2000)
  }, [code])

  // ── Render guards ─────────────────────────────────────────────────────────
  if (revokedPayload) {
    return (
      <AccessRevokedBanner
        payload={revokedPayload}
        onBackToDashboard={() => navigate('/dashboard')}
      />
    )
  }

  if (status === 'loading') {
    return <PageLoader label="Loading room…" />
  }

  if (status === 'not_found' || status === 'forbidden' || status === 'error') {
    return <RoomError status={status} error={error} onRetry={retry} />
  }

  // ── Full room layout ──────────────────────────────────────────────────────
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Room header */}
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-6 w-px bg-ink/20 sm:block" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-medium tracking-[0.1em]">
                {code?.toUpperCase()}
              </span>
              <CopyCodeButton code={code?.toUpperCase() ?? ''} />
            </div>
          </div>

          {/* Mobile: open chat button */}
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            aria-label="Open chat"
            className="inline-flex items-center gap-2 rounded-control border-2 border-ink px-3 py-1.5 text-sm font-semibold hover:bg-ink hover:text-paper lg:hidden"
          >
            <MessageSquare className="size-4" aria-hidden="true" />
            Chat
          </button>
        </div>
      </header>

      {/* Two-column layout: main content + persistent chat */}
      <div className="relative flex flex-1">
        {/* Main content area — lobby, drawing, or voting will slot in here */}
        <main className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:py-10">
          <div className="mx-auto max-w-2xl">
            {room && members && (
              <LobbyView
                room={room}
                members={members}
                currentUser={user}
                onLeave={handleLeave}
              />
            )}
          </div>
        </main>

        {/* Persistent chat panel — right column on desktop, overlay on mobile */}
        <div className="hidden lg:flex lg:w-80 lg:shrink-0 lg:flex-col lg:border-l-2 lg:border-ink">
          <ChatPanel
            code={code?.toUpperCase()}
            socketStatus={socketStatus}
            currentUser={user}
            isOpen={true}
            onClose={() => {}}
          />
        </div>

        {/* Mobile chat overlay */}
        {chatOpen && (
          <ChatPanel
            code={code?.toUpperCase()}
            socketStatus={socketStatus}
            currentUser={user}
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
          />
        )}
      </div>

      {/* Socket connection warning (non-blocking) */}
      {socketStatus === 'error' && (
        <div
          role="status"
          className="border-t-2 border-ink bg-paper px-5 py-2 text-center text-xs font-semibold text-ink-soft"
        >
          {socketError || 'Realtime connection lost. Trying to reconnect…'}
        </div>
      )}
    </div>
  )
}

~~~
--- END FILE: client/src/features/room/RoomPage.jsx ---


--- BEGIN FILE: client/src/features/room/useChat.js ---
~~~
// useChat: manages persistent realtime chat for a room.
//
// Protocol (verified from server/src/socket/handlers/chatSocket.js):
//   - History:  socket.emit("chat:history", {code, limit?, before?}, ack)
//               ack → {status:"success", data:{messages, hasMore, nextCursor}}
//               ack → {status:"error", error:{code, message}}
//   - Send:     socket.emit("chat:send", {code, content}, ack)
//               ack → {status:"success", data:{message}}
//               ack → {status:"error", error:{code, message}}
//   - Receive:  socket.on("chat:message", message)
//               message shape: {id, userId, username, content, createdAt}
//
// Deduplication: messages are tracked by their `id` (UUID from PostgreSQL).
// The broadcast "chat:message" fires for ALL room members including the sender,
// so we rely solely on the broadcast and ignore the ack's message body to
// avoid inserting the same message twice.
//
// History/realtime race: we subscribe to "chat:message" BEFORE requesting
// history so we can't miss messages that arrive between the history ack and
// the listener being registered. Duplicates from the overlap are deduped by id.

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSocket } from '../../lib/socket.js'

const MAX_MESSAGE_LENGTH = 1000

export function useChat({ code, socketStatus }) {
  const [messages, setMessages] = useState([])
  const [historyStatus, setHistoryStatus] = useState('idle') // 'idle'|'loading'|'ready'|'error'
  const [historyError, setHistoryError] = useState('')
  const [sendError, setSendError] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Track seen IDs to deduplicate incoming messages.
  const seenIdsRef = useRef(new Set())

  // Add a message only if its id hasn't been seen yet.
  const addMessage = useCallback((msg) => {
    if (!msg?.id) return
    if (seenIdsRef.current.has(msg.id)) return
    seenIdsRef.current.add(msg.id)
    setMessages((prev) => [...prev, msg])
  }, [])

  // Load initial history. Called once the socket has joined the room channel.
  const loadHistory = useCallback(() => {
    if (!code) return
    const socket = getSocket()

    setHistoryStatus('loading')
    setHistoryError('')

    socket.emit('chat:history', { code, limit: 50 }, (response) => {
      if (response?.status === 'success') {
        const incoming = response.data?.messages ?? []
        // Bulk-add, deduplicated.
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id))
          const fresh = incoming.filter((m) => !existingIds.has(m.id))
          // Mark all incoming as seen.
          incoming.forEach((m) => seenIdsRef.current.add(m.id))
          // History arrives oldest-to-newest from the server, prepend before any
          // realtime messages that may have arrived during the load.
          return [...fresh, ...prev.filter((m) => !existingIds.has(m.id) || prev.includes(m))]
        })
        setHistoryStatus('ready')
      } else {
        const msg = response?.error?.message ?? 'Could not load chat history.'
        setHistoryError(msg)
        setHistoryStatus('error')
      }
    })
  }, [code])

  // Subscribe to realtime broadcasts and load history when the socket is ready.
  useEffect(() => {
    if (socketStatus !== 'joined' || !code) return

    const socket = getSocket()

    const handleMessage = (msg) => {
      addMessage(msg)
    }

    // Register the realtime listener BEFORE requesting history so we don't
    // miss messages that arrive between the history response and listener setup.
    socket.on('chat:message', handleMessage)

    loadHistory()

    return () => {
      socket.off('chat:message', handleMessage)
    }
  }, [socketStatus, code, addMessage, loadHistory])

  // Reset messages when the room code changes (navigating to a different room).
  useEffect(() => {
    setMessages([])
    seenIdsRef.current = new Set()
    setHistoryStatus('idle')
    setHistoryError('')
    setSendError('')
  }, [code])

  const sendMessage = useCallback(
    (content) => {
      const trimmed = content?.trim() ?? ''
      if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) return
      if (!code) return

      const socket = getSocket()

      setIsSending(true)
      setSendError('')

      socket.emit('chat:send', { code, content: trimmed }, (response) => {
        setIsSending(false)
        if (response?.status !== 'success') {
          const msg = response?.error?.message ?? 'Could not send message.'
          setSendError(msg)
        }
        // The broadcast "chat:message" delivers the persisted message to everyone
        // including the sender, so we do NOT add it here from the ack.
      })
    },
    [code],
  )

  const clearSendError = useCallback(() => setSendError(''), [])

  return {
    messages,
    historyStatus,
    historyError,
    sendMessage,
    isSending,
    sendError,
    clearSendError,
    MAX_MESSAGE_LENGTH,
  }
}

~~~
--- END FILE: client/src/features/room/useChat.js ---


--- BEGIN FILE: client/src/features/room/useRoomData.js ---
~~~
// useRoomData: fetches the room and its member list over HTTP and keeps them
// in sync via a polling-free model — the caller can call refresh() after a
// socket event indicates state has changed.
//
// Returns:
//   room       – the room object, or null while loading / on error
//   members    – array of members, or null while loading / on error
//   status     – 'loading' | 'ready' | 'error' | 'not_found' | 'forbidden'
//   error      – human-readable message when status === 'error'
//   refresh    – function() to re-fetch

import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../../lib/api.js'
import { getRoom, getRoomMembers } from './roomApi.js'

export function useRoomData(code) {
  const [room, setRoom] = useState(null)
  const [members, setMembers] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const controllerRef = useRef(null)

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!code) return

      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller

      if (!silent) {
        setStatus('loading')
        setError('')
      }

      try {
        const [roomData, membersData] = await Promise.all([
          getRoom(code, controller.signal),
          getRoomMembers(code, controller.signal),
        ])

        if (controller.signal.aborted) return

        setRoom(roomData)
        setMembers(membersData)
        setStatus('ready')
      } catch (err) {
        if (controller.signal.aborted || err.name === 'AbortError') return

        if (err instanceof ApiError) {
          if (err.status === 404) {
            setStatus('not_found')
            return
          }
          if (err.status === 401) {
            setStatus('forbidden')
            return
          }
        }

        setError(err instanceof ApiError ? err.message : 'Could not load room data.')
        setStatus('error')
      }
    },
    [code],
  )

  useEffect(() => {
    load()
    return () => controllerRef.current?.abort()
  }, [load])

  const refresh = useCallback(() => load({ silent: true }), [load])
  const retry = useCallback(() => load(), [load])

  return { room, members, status, error, refresh, retry }
}

~~~
--- END FILE: client/src/features/room/useRoomData.js ---


--- BEGIN FILE: client/src/features/room/useRoomSocket.js ---
~~~
// useRoomSocket: manages the socket connection lifecycle for a room.
//
// Responsibilities:
//   1. Joins the socket room channel via "room:join" after the socket connects.
//   2. Handles "room:access_revoked" by calling onAccessRevoked with the payload.
//   3. Tracks socket connection state.
//   4. Cleans up listeners correctly on unmount or room code change.
//
// The socket singleton is reused — this hook never creates a new connection.

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSocket } from '../../lib/socket.js'

// socketStatus: 'connecting' | 'joined' | 'error' | 'revoked'
export function useRoomSocket({ code, onAccessRevoked }) {
  const [socketStatus, setSocketStatus] = useState('connecting')
  const [socketError, setSocketError] = useState('')
  // Track whether we've already joined this channel so reconnects re-join.
  const hasJoinedRef = useRef(false)
  const codeRef = useRef(code)

  useEffect(() => {
    codeRef.current = code
  }, [code])

  const joinChannel = useCallback((socket) => {
    const currentCode = codeRef.current
    if (!currentCode) return

    socket.emit('room:join', { code: currentCode }, (response) => {
      if (response?.status === 'success') {
        hasJoinedRef.current = true
        setSocketStatus('joined')
        setSocketError('')
      } else {
        const msg = response?.error?.message ?? 'Could not join the room channel.'
        setSocketStatus('error')
        setSocketError(msg)
      }
    })
  }, [])

  useEffect(() => {
    if (!code) return

    const socket = getSocket()
    hasJoinedRef.current = false
    setSocketStatus('connecting')
    setSocketError('')

    // If already connected, join immediately; otherwise wait for connect.
    const handleConnect = () => {
      hasJoinedRef.current = false
      joinChannel(socket)
    }

    const handleRevoked = (payload) => {
      setSocketStatus('revoked')
      if (typeof onAccessRevoked === 'function') {
        onAccessRevoked(payload)
      }
    }

    const handleConnectError = () => {
      setSocketStatus('error')
      setSocketError('Connection lost. Trying to reconnect…')
    }

    const handleDisconnect = () => {
      // Don't immediately error — socket.io will try to reconnect.
      setSocketStatus('connecting')
    }

    socket.on('connect', handleConnect)
    socket.on('room:access_revoked', handleRevoked)
    socket.on('connect_error', handleConnectError)
    socket.on('disconnect', handleDisconnect)

    // If the socket is already connected, join now without waiting for 'connect'.
    if (socket.connected) {
      joinChannel(socket)
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('room:access_revoked', handleRevoked)
      socket.off('connect_error', handleConnectError)
      socket.off('disconnect', handleDisconnect)
    }
  }, [code, joinChannel, onAccessRevoked])

  return { socketStatus, socketError }
}

~~~
--- END FILE: client/src/features/room/useRoomSocket.js ---


--- BEGIN FILE: client/src/features/welcome/BuildStatus.jsx ---
~~~
const ROADMAP = [
  { stage: 'Done', label: 'Visual foundation and the welcome page' },
  { stage: 'Now', label: 'Accounts: register, log in, stay signed in', current: true },
  { stage: 'Next', label: 'Dashboard, creating rooms, joining with a code' },
  { stage: 'Then', label: 'Room lobby with members, host and settings' },
  { stage: 'Later', label: 'Live lobby updates, drawing, voting and results' },
]

export default function BuildStatus() {
  return (
    <section
      id="build-status"
      aria-labelledby="status-heading"
      className="bg-paper-deep"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
            Build status
          </p>
          <h2
            id="status-heading"
            className="mt-3 text-balance font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
          >
            Accounts are open. Rooms come next.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
            InkInterpret is being built in stages. You can create an account and
            log in today. Creating rooms, joining with a code and playing are
            still being built, so there’s nothing to play yet.
          </p>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {ROADMAP.map(({ stage, label, current }, index) => (
            <li
              key={index}
              className="flex gap-4 border-t border-ink/25 py-4 first:border-t-2 first:border-ink"
            >
              <span
                className={`w-14 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] ${
                  current ? 'text-vermilion-deep' : 'text-ink-faint'
                }`}
              >
                {stage}
              </span>
              <span className={current ? 'font-semibold' : 'text-ink-soft'}>
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
~~~
--- END FILE: client/src/features/welcome/BuildStatus.jsx ---


--- BEGIN FILE: client/src/features/welcome/GameplayPreview.jsx ---
~~~
// One drawn stroke. pathLength="1" lets the CSS .draw-in animation trace it
// regardless of the path's real length.
function Stroke({ d, delay = 0, accent = false }) {
  return (
    <path
      d={d}
      pathLength="1"
      className={`draw-in ${accent ? 'stroke-vermilion' : 'stroke-current'}`}
      style={{ '--d': `${delay}ms` }}
    />
  )
}

function Sketch({ children }) {
  return (
    <svg
      viewBox="0 0 200 150"
      aria-hidden="true"
      focusable="false"
      className="block h-auto w-full text-ink"
      fill="none"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

// Interpretation A: a classic striped tower throwing light
function Tower({ delay = 0 }) {
  return (
    <Sketch>
      <Stroke d="M84 132 L94 56 L116 56 L126 132" delay={delay} />
      <Stroke d="M93 56 V40 H117 V56" delay={delay + 250} />
      <Stroke d="M91 40 L105 26 L119 40 Z" delay={delay + 400} />
      <Stroke d="M90 92 H120" delay={delay + 550} accent />
      <Stroke d="M92 74 H118" delay={delay + 650} accent />
      <Stroke d="M121 47 L184 30" delay={delay + 800} accent />
      <Stroke d="M121 47 L186 56" delay={delay + 900} accent />
      <Stroke
        d="M34 134 c12 -7 24 -7 36 0 s24 7 36 0 s24 -7 36 0 s24 7 36 0"
        delay={delay + 1000}
      />
    </Sketch>
  )
}

// Interpretation B: the lighthouse is a candle
function Candle({ delay = 0 }) {
  return (
    <Sketch>
      <Stroke d="M78 134 V74 H122 V134" delay={delay} />
      <Stroke d="M78 84 c5 9 10 9 12 0" delay={delay + 250} />
      <Stroke d="M78 98 H122" delay={delay + 350} />
      <Stroke d="M78 118 H122" delay={delay + 450} />
      <Stroke d="M100 74 V64" delay={delay + 550} />
      <Stroke
        d="M100 62 C86 50 98 42 100 30 C110 42 116 52 100 62 Z"
        delay={delay + 650}
        accent
      />
      <Stroke d="M50 134 H150" delay={delay + 800} />
    </Sketch>
  )
}

// Interpretation C: the lighthouse has an eye instead of a lamp
function Eye({ delay = 0 }) {
  return (
    <Sketch>
      <Stroke d="M90 134 L96 78 L114 78 L120 134" delay={delay} />
      <Stroke d="M62 52 C82 28 118 28 138 52 C118 76 82 76 62 52 Z" delay={delay + 250} />
      <circle cx="100" cy="52" r="9" className="fill-vermilion stroke-none" />
      <Stroke d="M100 22 V12" delay={delay + 600} />
      <Stroke d="M72 28 L64 20" delay={delay + 700} />
      <Stroke d="M128 28 L136 20" delay={delay + 800} />
      <Stroke d="M52 134 H148" delay={delay + 900} />
    </Sketch>
  )
}

export default function GameplayPreview() {
  return (
    <figure className="mx-auto w-full max-w-[34rem]">
      <div className="relative">
        {/* The prompt, like a label taped to the top of the page */}
        <div className="relative z-10 -rotate-1 border-2 border-ink bg-paper px-4 py-3 sm:w-[88%]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Prompt
          </p>
          <p className="font-display text-xl italic leading-snug sm:text-2xl">
            “A lighthouse that is afraid of the dark”
          </p>
        </div>

        {/* One interpretation, large */}
        <div className="relative -mt-3 rotate-[1.2deg] border-2 border-ink bg-sheet p-3 sm:ml-8">
          <Tower delay={400} />
        </div>

        {/* Two more readings of the same prompt, one circled as the favourite */}
        <div className="relative -mt-5 grid grid-cols-2 gap-5 px-2 sm:px-6">
          <div className="-rotate-2 border-2 border-ink bg-sheet p-2">
            <Candle delay={1300} />
          </div>
          <div className="relative rotate-[1.5deg] border-2 border-ink bg-sheet p-2">
            <Eye delay={1700} />
            <svg
              viewBox="0 0 220 170"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
              className="pointer-events-none absolute -left-2 -top-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-vermilion"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <path
                className="draw-in stroke-current"
                style={{ '--d': '2800ms' }}
                pathLength="1"
                vectorEffect="non-scaling-stroke"
                d="M14 30 C 40 8, 150 4, 200 22 C 214 60, 212 120, 196 150 C 150 166, 60 168, 20 152 C 4 110, 6 64, 14 30 Z"
              />
            </svg>
          </div>
        </div>
      </div>

      <figcaption className="mt-5 text-xs text-ink-faint">
        Illustration of a round: one prompt, three different drawings, one
        favourite circled. Not real gameplay.
      </figcaption>
    </figure>
  )
}
~~~
--- END FILE: client/src/features/welcome/GameplayPreview.jsx ---


--- BEGIN FILE: client/src/features/welcome/Hero.jsx ---
~~~
import { ArrowDown, ArrowRight } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../context/authContext.js'
import GameplayPreview from './GameplayPreview.jsx'

export default function Hero() {
  const { user } = useAuth()

  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-28 lg:pt-20"
    >
      <div className="lg:col-span-6">
        <p className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
          <span className="h-px w-8 bg-ink" aria-hidden="true" />
          A drawing game for 3–10 players
        </p>

        <h1
          id="hero-heading"
          className="text-balance font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-medium leading-[1.03] tracking-tight"
        >
          Same prompt.{' '}
          <span className="relative inline-block whitespace-nowrap italic">
            Wildly
            <svg
              className="absolute -bottom-2 left-0 h-3 w-full text-vermilion"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="draw-in stroke-current"
                style={{ '--d': '500ms' }}
                pathLength="1"
                d="M2 8 C 50 2, 90 11, 140 6 S 240 3, 298 7"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </span>{' '}
          different drawings.
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
          InkInterpret is a multiplayer drawing game. Everyone in the room gets
          the same prompt, sketches their own reading of it, and then the room
          votes on the interpretations.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {user ? (
            <Button to="/dashboard">
              Go to dashboard
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          ) : (
            <Button to="/register">
              Get started
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          )}
          <Button href="#how-it-works" variant="secondary">
            How it works
            <ArrowDown className="size-5" aria-hidden="true" />
          </Button>
        </div>

        <p className="mt-4 text-sm text-ink-faint">
          {user
            ? `Signed in as ${user.username}. Rooms and gameplay are still being built.`
            : 'Accounts are open. Rooms and gameplay are still being built.'}
        </p>

        <ul className="mt-12 flex max-w-md flex-wrap gap-y-2 border-t border-ink/20 pt-5 text-sm font-semibold text-ink-soft">
          <li className="pr-5">3–10 players</li>
          <li className="border-l border-ink/25 px-5">Canvas or paper</li>
          <li className="border-l border-ink/25 pl-5">Vote &amp; reveal</li>
        </ul>
      </div>

      <div className="lg:col-span-6">
        <GameplayPreview />
      </div>
    </section>
  )
}
~~~
--- END FILE: client/src/features/welcome/Hero.jsx ---


--- BEGIN FILE: client/src/features/welcome/HowItWorks.jsx ---
~~~
import { Camera, Pencil } from 'lucide-react'

// Small specimens, each different, so the three steps aren't three identical cards.

function RoomCodeSpecimen() {
  const code = ['A', 'B', 'C', '2', '3', '4']
  return (
    <div>
      <div
        role="img"
        aria-label="Example room code: A B C 2 3 4"
        className="flex gap-2"
      >
        {code.map((char, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="grid size-11 place-items-center border-2 border-paper/60 font-display text-2xl"
          >
            {char}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-paper/60">
        Example room code
      </p>
    </div>
  )
}

function InputModeSpecimen() {
  return (
    <ul className="space-y-3">
      <li className="flex items-center gap-3 border-b border-paper/20 pb-3">
        <Pencil className="size-5 shrink-0 text-vermilion" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Canvas</strong>
          <span className="text-paper/75"> — draw in the browser</span>
        </span>
      </li>
      <li className="flex items-center gap-3">
        <Camera className="size-5 shrink-0 text-vermilion" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Photo</strong>
          <span className="text-paper/75"> — draw on paper, snap it</span>
        </span>
      </li>
    </ul>
  )
}

function VoteSpecimen() {
  return (
    <svg
      role="img"
      aria-label="Three drawings with the middle one circled as the favourite"
      viewBox="0 0 240 84"
      className="h-auto w-full max-w-xs"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className="stroke-paper/60" strokeWidth="2">
        <rect x="6" y="12" width="64" height="60" />
        <rect x="88" y="12" width="64" height="60" />
        <rect x="170" y="12" width="64" height="60" />
        <path d="M20 58 L38 28 L56 58" />
        <path d="M104 52 C112 28 128 28 136 52" />
        <path d="M186 56 H218 M202 56 V30" />
      </g>
      <path
        className="stroke-vermilion"
        strokeWidth="3.5"
        d="M84 20 C100 4, 146 4, 158 18 C164 36, 164 56, 156 74 C140 84, 100 84, 86 74 C78 56, 78 36, 84 20 Z"
      />
    </svg>
  )
}

const STEPS = [
  {
    title: 'Join a room',
    body: 'Get a room code from the host and enter it. The host sets the rules: how many players, how long drawing and voting last, and whether you draw on canvas or on paper.',
    Specimen: RoomCodeSpecimen,
  },
  {
    title: 'Draw your interpretation',
    body: 'Everyone gets the same prompt and a countdown. Sketch your own reading of it, in the browser or on paper photographed with your camera, depending on the mode the host chose.',
    Specimen: InputModeSpecimen,
  },
  {
    title: 'Vote and reveal',
    body: 'Look through everyone’s drawings and vote. When voting closes, the results are revealed.',
    Specimen: VoteSpecimen,
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="on-ink bg-ink text-paper"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion">
          How it works
        </p>
        <h2
          id="how-heading"
          className="mt-3 max-w-xl text-balance font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
        >
          From blank page to verdict in three steps.
        </h2>

        <ol className="mt-12">
          {STEPS.map(({ title, body, Specimen }, index) => (
            <li
              key={title}
              className="grid gap-6 border-t border-paper/20 py-10 md:grid-cols-12 md:items-start md:gap-8"
            >
              <span
                aria-hidden="true"
                className="font-display text-6xl italic leading-none text-vermilion md:col-span-2"
              >
                {index + 1}
              </span>
              <div className="md:col-span-5">
                <h3 className="font-display text-2xl font-medium">{title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-paper/75">
                  {body}
                </p>
              </div>
              <div className="md:col-span-5">
                <Specimen />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
~~~
--- END FILE: client/src/features/welcome/HowItWorks.jsx ---


--- BEGIN FILE: client/src/features/welcome/WelcomePage.jsx ---
~~~
import SiteHeader from '../../components/layout/SiteHeader.jsx'
import SiteFooter from '../../components/layout/SiteFooter.jsx'
import Hero from './Hero.jsx'
import HowItWorks from './HowItWorks.jsx'
import BuildStatus from './BuildStatus.jsx'

export default function WelcomePage() {
  return (
    <div id="top" className="overflow-x-clip">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:border-2 focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        <Hero />
        <HowItWorks />
        <BuildStatus />
      </main>

      <SiteFooter />
    </div>
  )
}
~~~
--- END FILE: client/src/features/welcome/WelcomePage.jsx ---


--- BEGIN FILE: client/src/index.css ---
~~~
@import "tailwindcss";

/* ------------------------------------------------------------------
   Design tokens. Tailwind v4 turns every --color-*, --font-*,
   --radius-* and --shadow-* below into utilities automatically
   (bg-paper, text-ink, font-display, rounded-control, shadow-stamp...).
   ------------------------------------------------------------------ */
@theme {
  /* Surfaces */
  --color-paper: #f4eee2;
  --color-sheet: #fbf7ee;
  --color-paper-deep: #eae1cf;

  /* Ink */
  --color-ink: #14110f;
  --color-ink-soft: #4a433b;
  --color-ink-faint: #6b6154;

  /* The one accent */
  --color-vermilion: #e8441e;
  --color-vermilion-deep: #b8310f;

  /* Type */
  --font-display: "Fraunces", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;

  /* Shape: nearly square corners, hard offset shadow used only on primary actions */
  --radius-control: 3px;
  --shadow-stamp: 3px 3px 0 0 var(--color-ink);
  --shadow-stamp-lift: 5px 5px 0 0 var(--color-ink);
}

/* ------------------------------------------------------------------
   Base: resets and global typography only.
   ------------------------------------------------------------------ */
@layer base {
  html {
    scroll-behavior: smooth;
    /* Anchored sections stop below the sticky header instead of under it */
    scroll-padding-top: 5rem;
  }

  body {
    background-color: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-optical-sizing: auto;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  /* Faint paper grain. Decorative, non-interactive, very low opacity. */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 100;
    pointer-events: none;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .08 0 0 0 0 .07 0 0 0 0 .06 0 0 0 .6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  ::selection {
    background-color: var(--color-vermilion);
    color: var(--color-ink);
  }

  /* One focus style for the whole product: a solid ink ring, offset so it
     never touches the element. Dark sections flip it to paper. */
  :focus-visible {
    outline: 3px solid var(--color-ink);
    outline-offset: 3px;
  }
  .on-ink :focus-visible {
    outline-color: var(--color-paper);
  }
}

/* ------------------------------------------------------------------
   The "ink being drawn" effect. SVG paths using pathLength="1" start
   undrawn and trace themselves in. Without animation they are simply
   fully drawn, so the page works with motion disabled.
   ------------------------------------------------------------------ */
@keyframes draw-stroke {
  0% {
    stroke-dashoffset: 1;
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.draw-in {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: draw-stroke 900ms cubic-bezier(0.45, 0, 0.2, 1) var(--d, 0ms) both;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .draw-in {
    animation: none;
  }
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
  }
}
~~~
--- END FILE: client/src/index.css ---


--- BEGIN FILE: client/src/lib/api.js ---
~~~
// One place that knows how to talk to the backend. Feature code gets either
// the parsed JSON body or a thrown ApiError. It never touches fetch directly.

export class ApiError extends Error {
  constructor({ status, code, message }) {
    super(message)
    this.name = 'ApiError'
    this.status = status // HTTP status, or 0 if the server was unreachable
    this.code = code // backend error code (e.g. USERNAME_TAKEN) or null
  }
}

function fallbackMessage(status) {
  if (status >= 500) return 'The server ran into a problem. Please try again in a moment.'
  if (status === 401) return 'You need to be signed in to do that.'
  return `The request failed (HTTP ${status}).`
}

// Reads the body as text first so an empty or non-JSON response
// (e.g. an HTML error page from the proxy) can never crash the app.
async function parseBody(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

// The contract gives an error code and a human-readable message but not where
// they sit in the JSON, so this accepts the two common layouts:
//   { error: { code, message } }   or   { code, message }
function readError(payload, status) {
  const nested = payload && typeof payload.error === 'object' ? payload.error : null
  const code = nested?.code ?? payload?.code ?? null
  const rawMessage =
    nested?.message ??
    (typeof payload?.error === 'string' ? payload.error : null) ??
    payload?.message

  return {
    code: typeof code === 'string' ? code : null,
    message:
      typeof rawMessage === 'string' && rawMessage ? rawMessage : fallbackMessage(status),
  }
}

export async function apiFetch(path, { method = 'GET', body, signal } = {}) {
  const headers = { Accept: 'application/json' }
  const init = {
    method,
    headers,
    signal,
    credentials: 'include', // send and accept the HTTP-only session cookie
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(path, init)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'Could not reach the server. Check your connection and try again.',
    })
  }

  const payload = await parseBody(response)

  if (!response.ok) {
    const { code, message } = readError(payload, response.status)
    throw new ApiError({ status: response.status, code, message })
  }

  return payload
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error instanceof ApiError ? error.message : fallback
}
~~~
--- END FILE: client/src/lib/api.js ---


--- BEGIN FILE: client/src/lib/socket.js ---
~~~
// Singleton Socket.IO client. A single connection is shared across the entire
// app — creating one per component mount would multiply connections against
// the same session.
//
// The socket connects lazily on the first getSocket() call. Subsequent calls
// return the same instance without reconnecting.
//
// The backend Socket.IO server reads the session cookie for authentication, so
// we send credentials and point at the same origin the Vite proxy forwards to.

import { io } from 'socket.io-client'

let socket = null

// Returns the shared socket, creating it on the first call.
export function getSocket() {
  if (!socket) {
    socket = io('http://localhost:5001', {
      withCredentials: true,  // send the HTTP-only session cookie
      autoConnect: true,
    })
  }
  return socket
}

// Disconnects and destroys the singleton. Call this on sign-out so a fresh
// unauthenticated socket is not accidentally reused.
export function destroySocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

~~~
--- END FILE: client/src/lib/socket.js ---


--- BEGIN FILE: client/src/main.jsx ---
~~~
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'

// Router outside, auth inside: the provider (and its guards) can use routing hooks.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
~~~
--- END FILE: client/src/main.jsx ---


--- BEGIN FILE: client/src/routes/GuestRoute.jsx ---
~~~
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
~~~
--- END FILE: client/src/routes/GuestRoute.jsx ---


--- BEGIN FILE: client/src/routes/ProtectedRoute.jsx ---
~~~
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
~~~
--- END FILE: client/src/routes/ProtectedRoute.jsx ---


# Backend game, room, authentication, and chat files


--- BEGIN FILE: server/src/index.js ---
~~~

import { createServer } from "node:http";
import express from "express";

import { pool } from "./database/pool.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { sessionMiddleware } from "./config/session.js";
import { createSocketServer } from "./socket/index.js";
import { createGameTimer } from "./services/gameTimerService.js";

const app = express();
const httpServer = createServer(app);

const PORT = 5001;

const allowedOrigins = (
  process.env.CLIENT_ORIGINS ?? "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Initialize Socket.IO with shared session authentication
// and registered socket event handlers.
const io = createSocketServer(httpServer, allowedOrigins);
app.set("io", io);
const gameTimer = createGameTimer(io);

// Express middleware
app.use(express.json());
app.use(sessionMiddleware);

// HTTP health checks
app.get("/api/health", (req, res) => {
  res.status(200).json({
    health: "Ok",
    message: "The InkInterpret server is healthy!",
  });
});

app.get("/api/health/database", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      health: "Ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(503).json({
      health: "unhealthy",
      database: "disconnected",
    });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// Centralized error handler must remain after routes.
app.use(errorHandler);

// Express and Socket.IO share this HTTP server.
httpServer.listen(PORT, () => {
  console.log(`The InkInterpret server is listening on port ${PORT}`);
});

const shutdown = () => {
  gameTimer.stop();
  httpServer.close(() => pool.end());
};
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);

~~~
--- END FILE: server/src/index.js ---


--- BEGIN FILE: server/src/socket/index.js ---
~~~
import { Server } from "socket.io";
import { sessionMiddleware } from "../config/session.js";
import { registerConnectionHandlers } from "./handlers/connection.js";
import { registerSocketHandlers } from "./handlers/roomSocket.js";
import { registerChatHandlers } from "./handlers/chatSocket.js";
import { registerGameHandlers } from "./handlers/gameSocket.js";

export const createSocketServer = (httpServer, allowedOrigins) => {
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  io.engine.use(sessionMiddleware);

  io.use((socket, next) => {
    if (!socket.request.session?.userId) {
      const error = new Error("Authentication required");
      error.data = { code: "UNAUTHORIZED" };
      return next(error);
    }
    next();
  });

  registerConnectionHandlers(io);
  registerSocketHandlers(io);
  registerChatHandlers(io);
  registerGameHandlers(io);

  return io;
};

// Remove every connection belonging to `userId` from the given room's
// live channel. Safe to call after the room has been deleted — leaving a
// non-existent channel is a no-op.

export const revokeUserFromRoom = async (
  io,
  roomId,
  userId,
  { roomDeleted = false } = {},
) => {
  if (!io) return;

  const channel = `room:${roomId}`;
  const sockets = await io.in(channel).fetchSockets();

  const socketsToRevoke = sockets.filter((socket) => {
    // If the room was deleted, every socket in its channel is stale.
    if (roomDeleted) return true;

    // Otherwise, revoke every tab belonging to the departing user.
    return socket.request.session?.userId === userId;
  });

  await Promise.all(
    socketsToRevoke.map(async (socket) => {
      try {
        socket.emit("room:access_revoked", {
          code: roomDeleted ? "ROOM_DELETED" : "ROOM_LEFT",
          message: roomDeleted
            ? "This room no longer exists."
            : "You have left this room.",
        });
      } finally {
        // Even if an event listener/adapter throws, do not leave a stale
        // socket subscribed to a room that the database has already revoked.
        await socket.leave(channel);
      }
    }),
  );
};

~~~
--- END FILE: server/src/socket/index.js ---


--- BEGIN FILE: server/src/socket/handlers/connection.js ---
~~~
import { markUserConnected, markUserDisconnected } from "../../services/gameService.js";

export const registerConnectionHandlers = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.request.session.userId;

    console.log(`Socket connected: ${socket.id}`);
    markUserConnected(userId).catch((error) => console.error("Unable to record game connection", error));

    socket.on("disconnect", async (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
      const sockets = await io.fetchSockets();
      const stillConnected = sockets.some(
        (candidate) => candidate.id !== socket.id && candidate.request.session?.userId === userId
      );
      if (!stillConnected) {
        markUserDisconnected(userId).catch((error) => console.error("Unable to record game disconnect", error));
      }
    });
  });
};

~~~
--- END FILE: server/src/socket/handlers/connection.js ---


--- BEGIN FILE: server/src/socket/handlers/gameSocket.js ---
~~~
import { z } from "zod";
import { getGameState, markUserConnected, startGame, submitCanvasDrawing, submitPhotoDrawing, submitPrompt, submitVote } from "../../services/gameService.js";

const code = z.string().trim().toUpperCase().regex(/^[A-Z0-9]{6,8}$/);
const schemas = {
  start: z.object({ code }),
  prompt: z.object({ code, prompt: z.string().trim().min(1).max(500) }),
  canvas: z.object({ code, canvasData: z.string().min(1).max(8 * 1024 * 1024) }),
  photo: z.object({ code, dataUrl: z.string().min(1).max(12 * 1024 * 1024) }),
  vote: z.object({ code, drawingId: z.string().uuid() }),
  state: z.object({ code }),
};

const error = (code, message) => ({ status: "error", error: { code, message } });
const ok = (data = {}) => ({ status: "success", data });

const respond = (handler, schema) => async (socket, payload, acknowledge) => {
  const reply = typeof acknowledge === "function" ? acknowledge : () => {};
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return reply(error("VALIDATION_ERROR", "Invalid game command payload."));
  try { return reply(ok(await handler(socket, parsed.data))); }
  catch (cause) { return reply(error(cause.code ?? "INTERNAL_ERROR", cause.isOperational ? cause.message : "Unable to process game command.")); }
};

export const registerGameHandlers = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.request.session.userId;
    const requireChannel = (roomCode, state) => {
      // State hides the room UUID; the membership/roster checks in services are
      // authoritative. This guard retains the existing socket-room contract.
      if (!socket.rooms.has(socket.id)) throw new Error(`Socket unavailable for ${roomCode}`);
      return state;
    };
    socket.on("game:start", respond(async (_socket, data) => {
      const game = await startGame({ roomCode: data.code, userId });
      const sockets = await io.fetchSockets();
      await Promise.all([...new Set(sockets.map((candidate) => candidate.request.session?.userId).filter(Boolean))].map(markUserConnected));
      io.to(`room:${game.room_id}`).emit("game:started", { gameId: game.id, phase: game.current_phase, phaseEndsAt: game.phase_ends_at });
      return { gameId: game.id, phase: game.current_phase, phaseEndsAt: game.phase_ends_at };
    }, schemas.start));
    socket.on("game:state", respond(async (_socket, data) => requireChannel(data.code, await getGameState({ roomCode: data.code, userId })), schemas.state));
    socket.on("game:prompt:submit", respond(async (_socket, data) => {
      const game = await submitPrompt({ roomCode: data.code, userId, prompt: data.prompt });
      io.to(`room:${game.room_id}`).emit("game:phase", { phase: game.current_phase, phaseEndsAt: game.phase_ends_at });
      return { phase: game.current_phase, phaseEndsAt: game.phase_ends_at };
    }, schemas.prompt));
    socket.on("game:drawing:submit", respond(async (_socket, data) => ({ drawingId: await submitCanvasDrawing({ roomCode: data.code, userId, canvasData: data.canvasData }) }), schemas.canvas));
    socket.on("game:capture:submit", respond(async (_socket, data) => ({ drawingId: await submitPhotoDrawing({ roomCode: data.code, userId, dataUrl: data.dataUrl }) }), schemas.photo));
    socket.on("game:vote:submit", respond(async (_socket, data) => { await submitVote({ roomCode: data.code, userId, publicDrawingId: data.drawingId }); return {}; }, schemas.vote));
  });
};

~~~
--- END FILE: server/src/socket/handlers/gameSocket.js ---


--- BEGIN FILE: server/src/socket/handlers/roomSocket.js ---
~~~

import { z } from "zod";
import { pool } from "../../database/pool.js";
import { LIVE_CHAT_ROOM_STATUSES } from "../../services/chatService.js";

const joinRoomSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6,8}$/),
});

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("room:join", async (payload, acknowledge) => {
      const reply =
        typeof acknowledge === "function" ? acknowledge : () => {};

      const parsed = joinRoomSchema.safeParse(payload);

      if (!parsed.success) {
        return reply({
          status: "error",
          error: {
            code: "INVALID_ROOM_CODE",
            message: "A valid room code is required.",
          },
        });
      }

      try {
        const userId = socket.request.session?.userId;

        if (!userId) {
          return reply({
            status: "error",
            error: {
              code: "UNAUTHORIZED",
              message: "Authentication required.",
            },
          });
        }

        const result = await pool.query(
          `SELECT r.id, r.code
           FROM rooms AS r
           JOIN room_members AS rm
             ON rm.room_id = r.id
           WHERE r.code = $1
             AND rm.user_id = $2
             AND r.status = ANY($3::varchar[])
           LIMIT 1`,
          [parsed.data.code, userId, LIVE_CHAT_ROOM_STATUSES]
        );

        if (result.rowCount === 0) {
          return reply({
            status: "error",
            error: {
              code: "ROOM_ACCESS_DENIED",
              message: "Room not found or you are not a member.",
            },
          });
        }

        const room = result.rows[0];

        await socket.join(`room:${room.id}`);

        return reply({
          status: "success",
          data: {
            roomId: room.id,
            code: room.code,
          },
        });
      } catch (error) {
        console.error("Socket room join error:", error);

        return reply({
          status: "error",
          error: {
            code: "INTERNAL_ERROR",
            message: "Unable to join the room.",
          },
        });
      }
    });
  });
};

~~~
--- END FILE: server/src/socket/handlers/roomSocket.js ---


--- BEGIN FILE: server/src/socket/handlers/chatSocket.js ---
~~~
import { z } from "zod";
import { pool } from "../../database/pool.js";
import {
  createChatMessage,
  getChatHistory,
  getLiveRoomMembership,
} from "../../services/chatService.js";

const roomCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6,8}$/);

const sendMessageSchema = z.object({
  code: roomCodeSchema,
  content: z.string().min(1).max(1000),
});

const historySchema = z.object({
  code: roomCodeSchema,
  limit: z.number().int().min(1).max(100).optional(),
  before: z
    .object({
      createdAt: z.string(),
      id: z.string().uuid(),
    })
    .optional(),
});

const RATE_LIMIT_WINDOW_MS = 10_000;
const MAX_MESSAGES_PER_WINDOW = 8;

const messageTimestamps = new Map();

const errorResponse = (code, message) => ({
  status: "error",
  error: { code, message },
});

const successResponse = (data) => ({
  status: "success",
  data,
});

const isRateLimited = (socket) => {
  const now = Date.now();

  const timestamps = (messageTimestamps.get(socket.id) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_MESSAGES_PER_WINDOW) {
    messageTimestamps.set(socket.id, timestamps);
    return true;
  }

  timestamps.push(now);
  messageTimestamps.set(socket.id, timestamps);

  return false;
};

// Remove sockets whose room membership has been revoked.
const pruneUnauthorizedSockets = async (io, roomId) => {
  const channel = `room:${roomId}`;

  const [membersResult, sockets] = await Promise.all([
    pool.query(
      `SELECT user_id
       FROM room_members
       WHERE room_id = $1`,
      [roomId]
    ),
    io.in(channel).fetchSockets(),
  ]);

  const memberIds = new Set(membersResult.rows.map((row) => row.user_id));

  await Promise.all(
    sockets.map(async (socket) => {
      const userId = socket.request.session?.userId;

      if (!userId || !memberIds.has(userId)) {
        await socket.leave(channel);
      }
    })
  );
};

export const registerChatHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("chat:send", async (payload, acknowledge) => {
      const reply =
        typeof acknowledge === "function" ? acknowledge : () => {};

      const parsed = sendMessageSchema.safeParse(payload);

      if (!parsed.success) {
        return reply(
          errorResponse(
            "INVALID_MESSAGE",
            "Provide a valid room code and a message of 1–1000 characters."
          )
        );
      }

      if (isRateLimited(socket)) {
        return reply(
          errorResponse(
            "RATE_LIMITED",
            "Too many messages. Please wait before sending more."
          )
        );
      }

      try {
        const userId = socket.request.session?.userId;

        if (!userId) {
          return reply(
            errorResponse("UNAUTHORIZED", "Authentication required.")
          );
        }

        // Authorize BEFORE writing anything to the database.
        const membership = await getLiveRoomMembership({
          roomCode: parsed.data.code,
          userId,
        });

        if (
          !membership ||
          !socket.rooms.has(`room:${membership.roomId}`)
        ) {
          return reply(
            errorResponse(
              "ROOM_ACCESS_DENIED",
              "Join the room before sending messages."
            )
          );
        }

        const roomId = membership.roomId;
        const channel = `room:${roomId}`;

        const result = await createChatMessage({
          roomCode: parsed.data.code,
          userId,
          content: parsed.data.content,
        });

        if (result.error) {
          return reply(
            errorResponse(
              result.error,
              result.error === "INVALID_MESSAGE"
                ? "Message content is invalid."
                : "Room not found or you are not a member."
            )
          );
        }

        const { message } = result;

        await pruneUnauthorizedSockets(io, roomId);

        // The message is already persisted in PostgreSQL.
        io.to(channel).emit("chat:message", message);

        return reply(successResponse({ message }));
      } catch (error) {
        console.error("Chat send error:", error);

        return reply(
          errorResponse("INTERNAL_ERROR", "Unable to send message.")
        );
      }
    });

    socket.on("chat:history", async (payload, acknowledge) => {
      const reply =
        typeof acknowledge === "function" ? acknowledge : () => {};

      const parsed = historySchema.safeParse(payload);

      if (!parsed.success) {
        return reply(
          errorResponse(
            "INVALID_HISTORY_REQUEST",
            "The room code, limit, or pagination cursor is invalid."
          )
        );
      }

      try {
        const userId = socket.request.session?.userId;

        if (!userId) {
          return reply(
            errorResponse("UNAUTHORIZED", "Authentication required.")
          );
        }

        const history = await getChatHistory({
          roomCode: parsed.data.code,
          userId,
          limit: parsed.data.limit,
          before: parsed.data.before,
        });

        if (history.error) {
          return reply(
            errorResponse(
              history.error,
              "Room not found or you are not a member."
            )
          );
        }

        return reply(successResponse(history));
      } catch (error) {
        console.error("Chat history error:", error);

        return reply(
          errorResponse(
            "INTERNAL_ERROR",
            "Unable to retrieve chat history."
          )
        );
      }
    });

    socket.on("disconnect", () => {
      messageTimestamps.delete(socket.id);
    });
  });
};

~~~
--- END FILE: server/src/socket/handlers/chatSocket.js ---


--- BEGIN FILE: server/src/services/gameService.js ---
~~~
import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../database/pool.js";
import { AppError } from "../utils/AppError.js";

const PROMPT_MS = 45_000;
const RESULT_MS = 12_000;
const DISCONNECT_ABORT_MS = 60_000;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_CANVAS_CHARS = 8 * 1024 * 1024;
const storageDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../storage/game-drawings"
);

const addMilliseconds = (date, milliseconds) =>
  new Date(date.getTime() + milliseconds);

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const replacement = randomInt(index + 1);
    [copy[index], copy[replacement]] = [copy[replacement], copy[index]];
  }
  return copy;
};

export const createPromptGiverOrder = (participantIds) => {
  if (!Array.isArray(participantIds) || participantIds.length < 3) {
    throw new Error("At least three participants are required to create a game roster");
  }
  if (new Set(participantIds).size !== participantIds.length) {
    throw new Error("Game participants must be unique");
  }
  return shuffle(participantIds);
};

const appError = (status, message, code) => new AppError(status, message, code);

const rollback = async (client) => {
  try { await client.query("ROLLBACK"); } catch { /* preserve original error */ }
};

const currentRound = async (client, gameId, roundNumber, lock = false) => {
  const result = await client.query(
    `SELECT * FROM game_rounds
     WHERE game_id = $1 AND round_number = $2${lock ? " FOR UPDATE" : ""}`,
    [gameId, roundNumber]
  );
  return result.rows[0] ?? null;
};

const assertRosterMember = async (client, gameId, userId) => {
  const result = await client.query(
    `SELECT 1 FROM game_participants WHERE game_id = $1 AND user_id = $2`,
    [gameId, userId]
  );
  if (!result.rowCount) throw appError(403, "You are not in this game roster", "NOT_GAME_PARTICIPANT");
};

const setPhase = async (client, game, phase, deadline, extras = {}) => {
  const result = await client.query(
    `UPDATE games
     SET current_phase = $2, phase_ends_at = $3,
         current_round_number = COALESCE($4, current_round_number),
         status = COALESCE($5, status), ended_at = COALESCE($6, ended_at),
         abort_reason = COALESCE($7, abort_reason)
     WHERE id = $1
     RETURNING *`,
    [game.id, phase, deadline, extras.roundNumber ?? null, extras.status ?? null, extras.endedAt ?? null, extras.abortReason ?? null]
  );
  return result.rows[0];
};

const votingOrResult = async (client, game, round, now) => {
  const drawings = await client.query(
    `SELECT COUNT(*)::int AS count FROM game_drawings WHERE round_id = $1`, [round.id]
  );
  if (drawings.rows[0].count < 2) {
    await client.query(
      `UPDATE game_rounds SET voting_skipped = true, voting_skip_reason = 'FEWER_THAN_TWO_DRAWINGS'
       WHERE id = $1`, [round.id]
    );
    return setPhase(client, game, "result", addMilliseconds(now, RESULT_MS));
  }
  return setPhase(client, game, "voting", addMilliseconds(now, game.voting_duration * 1000));
};

const markMissingDrawings = async (client, round) => {
  await client.query(
    `UPDATE game_round_participants SET drawing_status = 'missing'
     WHERE round_id = $1 AND drawing_status = 'pending'`, [round.id]
  );
};

const applyVotingPenalties = async (client, game, round) => {
  if (round.voting_skipped) return;
  const missing = await client.query(
    `SELECT gp.user_id
     FROM game_participants AS gp
     WHERE gp.game_id = $1
       AND NOT EXISTS (
         SELECT 1 FROM game_votes AS gv
         WHERE gv.round_id = $2 AND gv.voter_user_id = gp.user_id
       )`,
    [game.id, round.id]
  );
  for (const { user_id: userId } of missing.rows) {
    const inserted = await client.query(
      `INSERT INTO game_score_events (game_id, round_id, user_id, event_type, points)
       VALUES ($1, $2, $3, 'non_voting_penalty', -3)
       ON CONFLICT (round_id, user_id, event_type) DO NOTHING
       RETURNING id`,
      [game.id, round.id, userId]
    );
    if (inserted.rowCount) {
      await client.query(
        `UPDATE game_participants SET score = score - 3 WHERE game_id = $1 AND user_id = $2`,
        [game.id, userId]
      );
    }
  }
};

const transitionLockedGame = async (client, game, now) => {
  const round = await currentRound(client, game.id, game.current_round_number, true);
  if (!round) throw new Error(`Game ${game.id} has no current round`);

  if (game.current_phase === "prompt") {
    if (round.prompt_status === "pending") {
      await client.query(
        `UPDATE game_rounds SET prompt_status = 'missed' WHERE id = $1`, [round.id]
      );
    }
    return { game: await setPhase(client, game, "drawing", addMilliseconds(now, game.drawing_duration * 1000)), event: "game:prompt:missed", round };
  }
  if (game.current_phase === "drawing") {
    if (game.input_mode === "canvas") await markMissingDrawings(client, round);
    if (game.input_mode === "photo") {
      return { game: await setPhase(client, game, "capture", addMilliseconds(now, game.capture_duration * 1000)), event: "game:phase", round };
    }
    return { game: await votingOrResult(client, game, round, now), event: "game:phase", round };
  }
  if (game.current_phase === "capture") {
    await markMissingDrawings(client, round);
    return { game: await votingOrResult(client, game, round, now), event: "game:phase", round };
  }
  if (game.current_phase === "voting") {
    await applyVotingPenalties(client, game, round);
    await client.query(`UPDATE game_rounds SET result_processed = true WHERE id = $1`, [round.id]);
    return { game: await setPhase(client, game, "result", addMilliseconds(now, RESULT_MS)), event: "game:results", round };
  }
  if (game.current_phase === "result") {
    const total = await client.query(`SELECT COUNT(*)::int AS count FROM game_rounds WHERE game_id = $1`, [game.id]);
    if (game.current_round_number >= total.rows[0].count) {
      const ended = await setPhase(client, game, "finished", now, { status: "finished", endedAt: now });
      await client.query(`UPDATE rooms SET status = 'waiting', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [game.room_id]);
      return { game: ended, event: "game:finished", round };
    }
    const nextNumber = game.current_round_number + 1;
    const nextRound = await currentRound(client, game.id, nextNumber, true);
    const nextDeadline = addMilliseconds(now, PROMPT_MS);
    await client.query(`UPDATE game_rounds SET prompt_deadline = $2 WHERE id = $1`, [nextRound.id, nextDeadline]);
    return { game: await setPhase(client, game, "prompt", nextDeadline, { roundNumber: nextNumber }), event: "game:phase", round: { ...nextRound, prompt_deadline: nextDeadline } };
  }
  return { game, event: null, round };
};

export const startGame = async ({ roomCode, userId }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const roomResult = await client.query(
      `SELECT * FROM rooms WHERE code = $1 FOR UPDATE`, [roomCode]
    );
    const room = roomResult.rows[0];
    if (!room) throw appError(404, "Room not found", "ROOM_NOT_FOUND");
    if (room.host_user_id !== userId) throw appError(403, "Only the room host can start the game", "HOST_REQUIRED");
    if (room.status !== "waiting") throw appError(409, "Room is not ready to start", "ROOM_NOT_STARTABLE");
    const members = await client.query(
      `SELECT rm.user_id FROM room_members rm WHERE rm.room_id = $1 ORDER BY rm.joined_at, rm.id`, [room.id]
    );
    if (members.rowCount < 3) throw appError(409, "At least three players are required", "NOT_ENOUGH_PLAYERS");
    const order = createPromptGiverOrder(members.rows.map((row) => row.user_id));
    const now = new Date();
    const promptDeadline = addMilliseconds(now, PROMPT_MS);
    const created = await client.query(
      `INSERT INTO games (room_id, input_mode, drawing_duration, voting_duration, current_round_number, current_phase, phase_ends_at)
       VALUES ($1, $2, $3, $4, 1, 'prompt', $5) RETURNING *`,
      [room.id, room.input_mode, room.drawing_duration, room.voting_duration, promptDeadline]
    );
    const game = created.rows[0];
    for (let index = 0; index < order.length; index += 1) {
      await client.query(
        `INSERT INTO game_participants (game_id, user_id, roster_position, disconnected_at)
         VALUES ($1, $2, $3, $4)`, [game.id, order[index], index + 1, now]
      );
      const roundResult = await client.query(
        `INSERT INTO game_rounds (game_id, round_number, prompt_giver_user_id, prompt_deadline)
         VALUES ($1, $2, $3, $4) RETURNING id`, [game.id, index + 1, order[index], promptDeadline]
      );
      const roundId = roundResult.rows[0].id;
      for (const participantId of order) {
        await client.query(`INSERT INTO game_round_participants (round_id, user_id) VALUES ($1, $2)`, [roundId, participantId]);
      }
    }
    await client.query(`UPDATE rooms SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [room.id]);
    await client.query("COMMIT");
    return game;
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

export const submitPrompt = async ({ roomCode, userId, prompt }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const game = await lockedActiveGame(client, roomCode);
    const now = new Date();
    if (game.current_phase !== "prompt" || new Date(game.phase_ends_at) <= now) throw appError(409, "The prompt phase is closed", "PHASE_CLOSED");
    const round = await currentRound(client, game.id, game.current_round_number, true);
    if (round.prompt_giver_user_id !== userId) throw appError(403, "Only the designated prompt giver may submit", "PROMPT_GIVER_REQUIRED");
    if (round.prompt_status !== "pending") throw appError(409, "A prompt was already resolved", "PROMPT_ALREADY_RESOLVED");
    await client.query(`UPDATE game_rounds SET prompt_text = $2, prompt_author_user_id = $3, prompt_status = 'submitted' WHERE id = $1`, [round.id, prompt, userId]);
    const updated = await setPhase(client, game, "drawing", addMilliseconds(now, game.drawing_duration * 1000));
    await client.query("COMMIT");
    return updated;
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

const lockedActiveGame = async (client, roomCode) => {
  const result = await client.query(
    `SELECT g.* FROM games g JOIN rooms r ON r.id = g.room_id
     WHERE r.code = $1 AND g.status = 'active' FOR UPDATE OF g`, [roomCode]
  );
  if (!result.rowCount) throw appError(404, "No active game exists for this room", "GAME_NOT_FOUND");
  return result.rows[0];
};

const assertSubmissionPhase = async (client, game, userId, phase) => {
  await assertRosterMember(client, game.id, userId);
  if (game.current_phase !== phase || new Date(game.phase_ends_at) <= new Date()) {
    throw appError(409, "This submission phase is closed", "PHASE_CLOSED");
  }
  return currentRound(client, game.id, game.current_round_number, true);
};

export const submitCanvasDrawing = async ({ roomCode, userId, canvasData }) => {
  if (typeof canvasData !== "string" || !canvasData.trim() || canvasData.length > MAX_CANVAS_CHARS) throw appError(400, "Invalid canvas data", "INVALID_DRAWING");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const game = await lockedActiveGame(client, roomCode);
    if (game.input_mode !== "canvas") throw appError(409, "This room requires photo capture", "WRONG_INPUT_MODE");
    const round = await assertSubmissionPhase(client, game, userId, "drawing");
    const result = await client.query(
      `INSERT INTO game_drawings (round_id, artist_user_id, submission_type, canvas_data)
       VALUES ($1, $2, 'canvas', $3) ON CONFLICT (round_id, artist_user_id) DO NOTHING RETURNING public_id`,
      [round.id, userId, canvasData]
    );
    if (!result.rowCount) throw appError(409, "You already submitted a drawing", "DRAWING_ALREADY_SUBMITTED");
    await client.query(`UPDATE game_round_participants SET drawing_status = 'submitted' WHERE round_id = $1 AND user_id = $2`, [round.id, userId]);
    await client.query("COMMIT"); return result.rows[0].public_id;
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

const decodeImage = (dataUrl) => {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl ?? "");
  if (!match) throw appError(400, "Only PNG, JPEG, or WebP images are accepted", "INVALID_IMAGE");
  const data = Buffer.from(match[2], "base64");
  if (!data.length || data.length > MAX_IMAGE_BYTES) throw appError(400, "Image must be at most 8 MB", "IMAGE_TOO_LARGE");
  return { mimeType: match[1], data };
};

export const submitPhotoDrawing = async ({ roomCode, userId, dataUrl }) => {
  const { mimeType, data } = decodeImage(dataUrl);
  const client = await pool.connect();
  let filePath;
  try {
    await client.query("BEGIN");
    const game = await lockedActiveGame(client, roomCode);
    if (game.input_mode !== "photo") throw appError(409, "This room requires canvas drawings", "WRONG_INPUT_MODE");
    const round = await assertSubmissionPhase(client, game, userId, "capture");
    const existing = await client.query(`SELECT 1 FROM game_drawings WHERE round_id = $1 AND artist_user_id = $2`, [round.id, userId]);
    if (existing.rowCount) throw appError(409, "You already submitted a drawing", "DRAWING_ALREADY_SUBMITTED");
    const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
    const storageKey = `${randomUUID()}.${extension}`;
    await mkdir(storageDirectory, { recursive: true });
    filePath = resolve(storageDirectory, storageKey);
    await writeFile(filePath, data, { flag: "wx" });
    const result = await client.query(
      `INSERT INTO game_drawings (round_id, artist_user_id, submission_type, storage_key, mime_type, byte_size)
       VALUES ($1, $2, 'photo', $3, $4, $5) RETURNING public_id`,
      [round.id, userId, storageKey, mimeType, data.length]
    );
    await client.query(`UPDATE game_round_participants SET drawing_status = 'submitted' WHERE round_id = $1 AND user_id = $2`, [round.id, userId]);
    await client.query("COMMIT"); return result.rows[0].public_id;
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

export const submitVote = async ({ roomCode, userId, publicDrawingId }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const game = await lockedActiveGame(client, roomCode);
    const round = await assertSubmissionPhase(client, game, userId, "voting");
    const drawing = await client.query(`SELECT id, artist_user_id FROM game_drawings WHERE round_id = $1 AND public_id = $2`, [round.id, publicDrawingId]);
    if (!drawing.rowCount) throw appError(400, "That drawing is not a voting option", "INVALID_DRAWING");
    if (drawing.rows[0].artist_user_id === userId) throw appError(400, "You cannot vote for your own drawing", "SELF_VOTE");
    const vote = await client.query(
      `INSERT INTO game_votes (round_id, voter_user_id, drawing_id) VALUES ($1, $2, $3)
       ON CONFLICT (round_id, voter_user_id) DO NOTHING RETURNING id`, [round.id, userId, drawing.rows[0].id]
    );
    if (!vote.rowCount) throw appError(409, "You already voted this round", "VOTE_ALREADY_SUBMITTED");
    await client.query(`UPDATE game_round_participants SET voted_at = CURRENT_TIMESTAMP WHERE round_id = $1 AND user_id = $2`, [round.id, userId]);
    await client.query("COMMIT");
  } catch (error) { await rollback(client); throw error; } finally { client.release(); }
};

export const getGameState = async ({ roomCode, userId }) => {
  const gameResult = await pool.query(
    `SELECT g.* FROM games g JOIN rooms r ON r.id = g.room_id
     JOIN room_members rm ON rm.room_id = r.id AND rm.user_id = $2
     JOIN game_participants gp ON gp.game_id = g.id AND gp.user_id = $2
     WHERE r.code = $1 ORDER BY g.started_at DESC LIMIT 1`, [roomCode, userId]
  );
  if (!gameResult.rowCount) throw appError(404, "Game not found", "GAME_NOT_FOUND");
  const game = gameResult.rows[0];
  const round = await currentRound(pool, game.id, game.current_round_number);
  const participants = await pool.query(
    `SELECT gp.roster_position AS "position", gp.score, gp.user_id = $2 AS "isYou", u.username
     FROM game_participants gp JOIN users u ON u.id = gp.user_id WHERE gp.game_id = $1 ORDER BY gp.roster_position`, [game.id, userId]
  );
  const drawings = await pool.query(
    `SELECT gd.public_id AS "publicId", gd.submission_type AS "type"
       ${game.current_phase === "result" || game.status !== "active" ? ", u.username AS artist, COUNT(gv.id)::int AS votes" : ""}
     FROM game_drawings gd
     JOIN game_rounds gr ON gr.id = gd.round_id
     ${game.current_phase === "result" || game.status !== "active" ? "JOIN users u ON u.id = gd.artist_user_id LEFT JOIN game_votes gv ON gv.drawing_id = gd.id" : ""}
     WHERE gd.round_id = $1
     ${game.current_phase === "result" || game.status !== "active" ? "GROUP BY gd.id, u.username" : ""}
     ORDER BY gd.public_id`, [round.id]
  );
  return {
    id: game.id, status: game.status, phase: game.current_phase, phaseEndsAt: game.phase_ends_at,
    round: { number: round.round_number, promptStatus: round.prompt_status, prompt: round.prompt_text, votingSkipped: round.voting_skipped, votingSkipReason: round.voting_skip_reason },
    participants: participants.rows, drawings: drawings.rows.map((drawing) => ({ ...drawing, assetUrl: `/api/rooms/${roomCode}/game/drawings/${drawing.publicId}` })),
  };
};

export const getDrawingAsset = async ({ roomCode, userId, publicId }) => {
  const result = await pool.query(
    `SELECT gd.submission_type, gd.canvas_data, gd.storage_key, gd.mime_type
     FROM game_drawings gd
     JOIN game_rounds gr ON gr.id = gd.round_id
     JOIN games g ON g.id = gr.game_id
     JOIN rooms r ON r.id = g.room_id
     JOIN room_members rm ON rm.room_id = r.id AND rm.user_id = $2
     JOIN game_participants gp ON gp.game_id = g.id AND gp.user_id = $2
     WHERE r.code = $1 AND gd.public_id = $3
     ORDER BY g.started_at DESC LIMIT 1`,
    [roomCode, userId, publicId]
  );
  if (!result.rowCount) throw appError(404, "Drawing not found", "DRAWING_NOT_FOUND");
  const drawing = result.rows[0];
  if (drawing.submission_type === "canvas") return { mimeType: "application/json", body: JSON.stringify({ canvasData: drawing.canvas_data }) };
  if (!drawing.storage_key || resolve(storageDirectory, drawing.storage_key) !== resolve(storageDirectory, drawing.storage_key.split("/").pop())) {
    throw appError(404, "Drawing file not found", "DRAWING_NOT_FOUND");
  }
  try { return { mimeType: drawing.mime_type, body: await readFile(resolve(storageDirectory, drawing.storage_key)) }; }
  catch { throw appError(404, "Drawing file not found", "DRAWING_NOT_FOUND"); }
};

export const processDueGames = async () => {
  const due = await pool.query(`SELECT id FROM games WHERE status = 'active' AND phase_ends_at <= CURRENT_TIMESTAMP ORDER BY phase_ends_at LIMIT 25`);
  const transitions = [];
  for (const { id } of due.rows) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const locked = await client.query(`SELECT * FROM games WHERE id = $1 FOR UPDATE`, [id]);
      const game = locked.rows[0];
      if (game?.status === "active" && new Date(game.phase_ends_at) <= new Date()) transitions.push(await transitionLockedGame(client, game, new Date()));
      await client.query("COMMIT");
    } catch (error) { await rollback(client); console.error("Game deadline transition failed", error); } finally { client.release(); }
  }
  return transitions;
};

export const markUserConnected = async (userId) => pool.query(
  `UPDATE game_participants gp SET connected_at = CURRENT_TIMESTAMP, disconnected_at = NULL
   FROM games g WHERE g.id = gp.game_id AND g.status = 'active' AND gp.user_id = $1`, [userId]
);

export const markUserDisconnected = async (userId) => pool.query(
  `UPDATE game_participants gp SET disconnected_at = CURRENT_TIMESTAMP
   FROM games g WHERE g.id = gp.game_id AND g.status = 'active' AND gp.user_id = $1`, [userId]
);

export const markAllActiveParticipantsDisconnected = async () => pool.query(
  `UPDATE game_participants gp SET disconnected_at = CURRENT_TIMESTAMP
   FROM games g WHERE g.id = gp.game_id AND g.status = 'active'`
);

export const getRoomIdForGame = async (gameId) => {
  const result = await pool.query(`SELECT room_id FROM games WHERE id = $1`, [gameId]);
  return result.rows[0]?.room_id;
};

export const processConnectivity = async () => {
  const client = await pool.connect();
  const aborted = [];
  try {
    await client.query("BEGIN");
    const games = await client.query(`SELECT * FROM games WHERE status = 'active' FOR UPDATE`);
    const now = new Date();
    for (const game of games.rows) {
      const connected = await client.query(`SELECT COUNT(*)::int AS count FROM game_participants WHERE game_id = $1 AND disconnected_at IS NULL`, [game.id]);
      if (connected.rows[0].count >= 2) {
        if (game.insufficient_connected_since) await client.query(`UPDATE games SET insufficient_connected_since = NULL WHERE id = $1`, [game.id]);
      } else if (!game.insufficient_connected_since) {
        await client.query(`UPDATE games SET insufficient_connected_since = $2 WHERE id = $1`, [game.id, now]);
      } else if (now - new Date(game.insufficient_connected_since) >= DISCONNECT_ABORT_MS) {
        await setPhase(client, game, "aborted", now, { status: "aborted", endedAt: now, abortReason: "INSUFFICIENT_CONNECTED_PLAYERS" });
        await client.query(`UPDATE rooms SET status = 'waiting', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [game.room_id]);
        aborted.push(game);
      }
    }
    await client.query("COMMIT");
  } catch (error) { await rollback(client); console.error("Game connectivity sweep failed", error); } finally { client.release(); }
  return aborted;
};

~~~
--- END FILE: server/src/services/gameService.js ---


--- BEGIN FILE: server/src/services/gameTimerService.js ---
~~~
import { getGameState, markAllActiveParticipantsDisconnected, processConnectivity, processDueGames } from "./gameService.js";

const SWEEP_MS = 1_000;

export const createGameTimer = (io) => {
  let running = false;
  const initialized = markAllActiveParticipantsDisconnected().catch((error) => {
    console.error("Unable to initialize game connection recovery", error);
  });
  const sweep = async () => {
    if (running) return;
    running = true;
    try {
      await initialized;
      const transitions = await processDueGames();
      for (const transition of transitions) {
        const state = await getGameStateForBroadcast(transition.game);
        const channel = `room:${transition.game.room_id}`;
        if (transition.event === "game:prompt:missed") {
          io.to(channel).emit("game:prompt:missed", {
            round: transition.round.round_number,
            message: `${state.round.promptGiver} didn't submit a prompt. Draw something that impresses the others!`,
          });
        }
        io.to(channel).emit(transition.event ?? "game:phase", state);
      }
      const aborted = await processConnectivity();
      for (const game of aborted) io.to(`room:${game.room_id}`).emit("game:aborted", { reason: "INSUFFICIENT_CONNECTED_PLAYERS" });
    } finally { running = false; }
  };
  const interval = setInterval(sweep, SWEEP_MS);
  interval.unref();
  sweep();
  return { stop: () => clearInterval(interval), sweep };
};

const getGameStateForBroadcast = async (game) => {
  // The broadcast payload is deliberately roster-neutral during voting. A
  // temporary participant lookup only supplies the state serializer's access
  // check and is not included in the payload.
  const { pool } = await import("../database/pool.js");
  const participant = await pool.query(
    `SELECT gp.user_id, r.code FROM game_participants gp JOIN games g ON g.id = gp.game_id JOIN rooms r ON r.id = g.room_id
     WHERE gp.game_id = $1 ORDER BY gp.roster_position LIMIT 1`, [game.id]
  );
  const state = await getGameState({ roomCode: participant.rows[0].code, userId: participant.rows[0].user_id });
  const round = await pool.query(
    `SELECT u.username FROM game_rounds gr JOIN users u ON u.id = gr.prompt_giver_user_id
     WHERE gr.game_id = $1 AND gr.round_number = $2`, [game.id, game.current_round_number]
  );
  return { ...state, round: { ...state.round, promptGiver: round.rows[0]?.username } };
};

~~~
--- END FILE: server/src/services/gameTimerService.js ---


--- BEGIN FILE: server/src/services/chatService.js ---
~~~

import { pool } from "../database/pool.js";

const MAX_MESSAGE_LENGTH = 1000;
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

// These are the room states in which the live room channel and persistent
// chat are available. Keep room-channel admission and chat authorization on
// this same policy.
export const LIVE_CHAT_ROOM_STATUSES = Object.freeze([
  "waiting",
  "in_progress",
]);

export const getLiveRoomMembership = async ({ roomCode, userId }) => {
  const result = await pool.query(
    `SELECT r.id
     FROM rooms AS r
     JOIN room_members AS rm ON rm.room_id = r.id
     WHERE r.code = $1
       AND rm.user_id = $2
       AND r.status = ANY($3::varchar[])
     LIMIT 1`,
    [roomCode, userId, LIVE_CHAT_ROOM_STATUSES]
  );

  return result.rowCount > 0 ? { roomId: result.rows[0].id } : null;
};

export const createChatMessage = async ({
  roomCode,
  userId,
  content,
}) => {
  const message = content?.trim();

  if (
    typeof message !== "string" ||
    message.length === 0 ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return { error: "INVALID_MESSAGE" };
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // This is the same lock used by leaveRoom. It establishes a single order
    // between a send and a leave: a message is either committed before leave,
    // or the later send sees that membership has gone and is rejected.
    const access = await client.query(
      `SELECT r.id
       FROM rooms AS r
       JOIN room_members AS rm ON rm.room_id = r.id
       WHERE r.code = $1
         AND rm.user_id = $2
         AND r.status = ANY($3::varchar[])
       FOR UPDATE OF r`,
      [roomCode, userId, LIVE_CHAT_ROOM_STATUSES]
    );

    if (access.rowCount === 0) {
      await client.query("ROLLBACK");
      return { error: "ROOM_ACCESS_DENIED" };
    }

    const result = await client.query(
      `WITH inserted AS (
         INSERT INTO chat_messages (room_id, user_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, room_id, user_id, content, created_at
       )
       SELECT
         i.id,
         i.room_id AS "roomId",
         i.user_id AS "userId",
         u.username,
         i.content,
         i.created_at AS "createdAt"
       FROM inserted AS i
       JOIN users AS u ON u.id = i.user_id`,
      [access.rows[0].id, userId, message]
    );

    await client.query("COMMIT");
    return { message: result.rows[0] };
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original error.
    }
    throw error;
  } finally {
    client.release();
  }
};

export const getChatHistory = async ({
  roomCode,
  userId,
  limit = DEFAULT_PAGE_SIZE,
  before = null,
}) => {
  const pageSize = Math.min(
    Math.max(Number.parseInt(limit, 10) || DEFAULT_PAGE_SIZE, 1),
    MAX_PAGE_SIZE
  );

  // History is authorized from the current database membership, rather than
  // from a client-controlled room code or Socket.IO channel alone.
  const access = await getLiveRoomMembership({ roomCode, userId });

  if (!access) {
    return { error: "ROOM_ACCESS_DENIED" };
  }

  const roomId = access.roomId;

  let cursorCondition = "";
  const values = [roomId, pageSize + 1];

  if (before) {
    if (
      typeof before.createdAt !== "string" ||
      typeof before.id !== "string" ||
      !Number.isFinite(Date.parse(before.createdAt)) ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        before.id
      )
    ) {
      return { error: "INVALID_CURSOR" };
    }

    cursorCondition = `
      AND (cm.created_at, cm.id) < ($3::timestamptz, $4::uuid)
    `;

    values.push(before.createdAt, before.id);
  }

  const result = await pool.query(
    `SELECT
       cm.id,
       cm.user_id AS "userId",
       u.username,
       cm.content,
       cm.created_at AS "createdAt"
     FROM chat_messages AS cm
     JOIN users AS u ON u.id = cm.user_id
     WHERE cm.room_id = $1
       ${cursorCondition}
     ORDER BY cm.created_at DESC, cm.id DESC
     LIMIT $2`,
    values
  );

  const hasMore = result.rows.length > pageSize;
  const rows = result.rows.slice(0, pageSize);

  // Return messages oldest-to-newest for straightforward rendering.
  rows.reverse();

  return {
    messages: rows,
    hasMore,
    nextCursor:
      hasMore && rows.length > 0
        ? {
            createdAt: rows[0].createdAt.toISOString(),
            id: rows[0].id,
          }
        : null,
  };
};

~~~
--- END FILE: server/src/services/chatService.js ---


--- BEGIN FILE: server/src/services/leaveRoomService.js ---
~~~
import { pool } from "../database/pool.js";
import { AppError } from "../utils/AppError.js";

export async function leaveRoom({ userId, code }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const roomResult = await client.query(
      `SELECT id, host_user_id, status
       FROM rooms
       WHERE code = $1
       FOR UPDATE`,
      [code],
    );

    const room = roomResult.rows[0];

    if (!room) {
      throw new AppError(404, "Room not found", "ROOM_NOT_FOUND");
    }

    if (room.status !== "waiting") {
      throw new AppError(
        409,
        "You cannot leave a room after the game has started",
        "ROOM_IN_PROGRESS",
      );
    }

    const membershipResult = await client.query(
      `SELECT id, role
       FROM room_members
       WHERE room_id = $1 AND user_id = $2`,
      [room.id, userId],
    );

    if (membershipResult.rowCount === 0) {
      throw new AppError(
        404,
        "You are not a member of this room",
        "NOT_ROOM_MEMBER",
      );
    }

    const wasHost = room.host_user_id === userId;

    await client.query(
      `DELETE FROM room_members
       WHERE room_id = $1 AND user_id = $2`,
      [room.id, userId],
    );

    const remainingResult = await client.query(
      `SELECT user_id
       FROM room_members
       WHERE room_id = $1
       ORDER BY joined_at ASC, id ASC
       LIMIT 1`,
      [room.id],
    );

    if (remainingResult.rowCount === 0) {
      await client.query("DELETE FROM rooms WHERE id = $1", [room.id]);
      await client.query("COMMIT");

      return { deleted: true, code, roomId: room.id };
    }

    if (wasHost) {
      const nextHostId = remainingResult.rows[0].user_id;

      await client.query(
        `UPDATE room_members
         SET role = CASE
           WHEN user_id = $2 THEN 'host'
           ELSE 'player'
         END
         WHERE room_id = $1`,
        [room.id, nextHostId],
      );

      await client.query(
        `UPDATE rooms
         SET host_user_id = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [room.id, nextHostId],
      );
    }

    await client.query("COMMIT");

    return { deleted: false, code, roomId: room.id };
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original error.
    }

    throw error;
  } finally {
    client.release();
  }
}

~~~
--- END FILE: server/src/services/leaveRoomService.js ---


--- BEGIN FILE: server/src/controllers/gameController.js ---
~~~
import { getDrawingAsset, getGameState, markUserConnected, startGame } from "../services/gameService.js";

const normalizedCode = (value) => value?.trim().toUpperCase();

export const startGameController = async (req, res, next) => {
  try {
    const game = await startGame({ roomCode: normalizedCode(req.params.code), userId: req.session.userId });
    const io = req.app.get("io");
    const sockets = await io.fetchSockets();
    await Promise.all([...new Set(sockets.map((socket) => socket.request.session?.userId).filter(Boolean))].map(markUserConnected));
    io.to(`room:${game.room_id}`).emit("game:started", { gameId: game.id, phase: game.current_phase, phaseEndsAt: game.phase_ends_at });
    res.status(201).json({ status: "success", data: { game } });
  } catch (error) { next(error); }
};

export const getGameStateController = async (req, res, next) => {
  try {
    const game = await getGameState({ roomCode: normalizedCode(req.params.code), userId: req.session.userId });
    res.status(200).json({ status: "success", data: { game } });
  } catch (error) { next(error); }
};

export const getDrawingController = async (req, res, next) => {
  try {
    const drawing = await getDrawingAsset({ roomCode: normalizedCode(req.params.code), userId: req.session.userId, publicId: req.params.publicId });
    res.type(drawing.mimeType).send(drawing.body);
  } catch (error) { next(error); }
};

~~~
--- END FILE: server/src/controllers/gameController.js ---


--- BEGIN FILE: server/src/controllers/roomReadController.js ---
~~~
import {
  listUserRooms,
  getRoomForMember,
  listRoomMembers,
} from "../services/roomReadService.js";

export async function listRoomsController(req, res, next) {
  try {
    const rooms = await listUserRooms(req.session.userId);

    return res.status(200).json({
      status: "success",
      data: { rooms },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoomController(req, res, next) {
  const code = req.params.code.trim().toUpperCase();

  if (!/^[A-Z0-9]{6,8}$/.test(code)) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_ROOM_CODE",
      message: "Invalid room code",
    });
  }

  try {
    const room = await getRoomForMember({
      userId: req.session.userId,
      code,
    });

    return res.status(200).json({
      status: "success",
      data: { room },
    });
  } catch (error) {
    next(error);
  }
}

export async function listRoomMembersController(req, res, next) {
  const code = req.params.code.trim().toUpperCase();

  if (!/^[A-Z0-9]{6,8}$/.test(code)) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_ROOM_CODE",
      message: "Invalid room code",
    });
  }

  try {
    const members = await listRoomMembers({
      userId: req.session.userId,
      code,
    });

    return res.status(200).json({
      status: "success",
      data: { members },
    });
  } catch (error) {
    next(error);
  }
}
~~~
--- END FILE: server/src/controllers/roomReadController.js ---


--- BEGIN FILE: server/src/controllers/leaveRoomController.js ---
~~~
import { leaveRoom } from "../services/leaveRoomService.js";
import { revokeUserFromRoom } from "../socket/index.js";

export async function leaveRoomController(req, res, next) {
  const code = req.params.code.trim().toUpperCase();

  if (!/^[A-Z0-9]{6,8}$/.test(code)) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_ROOM_CODE",
      message: "Invalid room code",
    });
  }

  try {
    const userId = req.session.userId;

    const result = await leaveRoom({ userId, code });

    // The DB transaction has committed. Only now do we revoke live access.
    // Failures here must not fail the HTTP response — the leave is already
    // persisted and cannot be rolled back.
    if (result.roomId) {
      try {
        const io = req.app.get("io");
        await revokeUserFromRoom(io, result.roomId, userId, {
          roomDeleted: result.deleted,
        });
      } catch (revokeError) {
        console.error(
          "Failed to revoke socket access after successful leave:",
          revokeError
        );
      }
    }

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

~~~
--- END FILE: server/src/controllers/leaveRoomController.js ---


--- BEGIN FILE: server/src/routes/roomRoutes.js ---
~~~
import { Router } from "express";
import { createRoomController } from "../controllers/roomController.js";
// import { requireAuth } from "../middleware/requireAuth.js";
import { authRequire } from "../middlewares/authRequire.js";
import { joinRoomController } from "../controllers/joinRoomController.js";
import { getRoomController, listRoomMembersController, listRoomsController } from "../controllers/roomReadController.js";
import { leaveRoomController } from "../controllers/leaveRoomController.js";
import { getDrawingController, getGameStateController, startGameController } from "../controllers/gameController.js";

const router = Router();

router.use(authRequire);

router.post("/", authRequire, createRoomController);
router.post("/join", authRequire, joinRoomController);
router.post("/:code/game/start", startGameController);
router.get("/:code/game", getGameStateController);
router.get("/:code/game/drawings/:publicId", getDrawingController);
router.get("/", listRoomsController);
router.get("/:code", getRoomController);
router.delete("/:code/members/me", leaveRoomController);
router.get("/:code/members", listRoomMembersController);


export default router;

~~~
--- END FILE: server/src/routes/roomRoutes.js ---


--- BEGIN FILE: server/src/database/pool.js ---
~~~
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;
const moduleDirectory = dirname(fileURLToPath(import.meta.url));

// Resolve the server environment relative to this module, rather than the
// caller's working directory. This keeps the shared pool usable by server/
// commands and repository-root standalone scripts alike.
dotenv.config({
  path: resolve(moduleDirectory, "../../.env"),
  quiet: true,
});

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (error) => {
    console.log(`An unexpected postres error has occured ${error}`);
});

~~~
--- END FILE: server/src/database/pool.js ---


--- BEGIN FILE: server/src/middlewares/authRequire.js ---
~~~
import { AppError } from "../utils/AppError.js";


export const authRequire = (req, res, next) => {
    if (!req.session?.userId) {
        return next(
            new AppError(401, 'Authentication required', "UNAUTHORIZED")
        );
    }
    next();
}
~~~
--- END FILE: server/src/middlewares/authRequire.js ---


# Database migrations


--- BEGIN FILE: server/migrations/1792146803004_init-user.js ---
~~~
// /**
//  * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
//  */
// export const shorthands = undefined;

// /**
//  * @param pgm {import('node-pg-migrate').MigrationBuilder}
//  * @param run {() => void | undefined}
//  * @returns {Promise<void> | void}
//  */
// export const up = (pgm) => {};

// /**
//  * @param pgm {import('node-pg-migrate').MigrationBuilder}
//  * @param run {() => void | undefined}
//  * @returns {Promise<void> | void}
//  */
// export const down = (pgm) => {};



export const up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        username: {
            type: 'varchar(30)',
            notNull: true,
            unique: true,
        },
        password_hash: {
            type: 'varchar(255)',
            notNull: true,
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        }
    });
}

export const down = (pgm) => {
    pgm.dropTable('users');
}
~~~
--- END FILE: server/migrations/1792146803004_init-user.js ---


--- BEGIN FILE: server/migrations/1792313717984_init-sessions.js ---
~~~
// /**
//  * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
//  */
// export const shorthands = undefined;

// /**
//  * @param pgm {import('node-pg-migrate').MigrationBuilder}
//  * @param run {() => void | undefined}
//  * @returns {Promise<void> | void}
//  */
// export const up = (pgm) => {};

// /**
//  * @param pgm {import('node-pg-migrate').MigrationBuilder}
//  * @param run {() => void | undefined}
//  * @returns {Promise<void> | void}
//  */
// export const down = (pgm) => {};



export const up = (pgm) => {
    pgm.createTable('user_sessions', {
        sid: {
            type: "varchar",
            primaryKey: true
        },
        sess: {
            type: "json",
            notNull: true
        },
        expire: {
            type: "timestamptz",
            notNull: true
        }
    });

    pgm.createIndex("user_sessions", "expire");
}

export const down = (pgm) => {
    pgm.dropTable("user_sessions");
}
~~~
--- END FILE: server/migrations/1792313717984_init-sessions.js ---


--- BEGIN FILE: server/migrations/1792316730967_init-rooms.js ---
~~~
// /**
//  * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
//  */
// export const shorthands = undefined;

// /**
//  * @param pgm {import('node-pg-migrate').MigrationBuilder}
//  * @param run {() => void | undefined}
//  * @returns {Promise<void> | void}
//  */
// export const up = (pgm) => {};

// /**
//  * @param pgm {import('node-pg-migrate').MigrationBuilder}
//  * @param run {() => void | undefined}
//  * @returns {Promise<void> | void}
//  */
// export const down = (pgm) => {};


export const up = (pgm) => {
  pgm.createTable("rooms", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    code: {
      type: "varchar(8)",
      notNull: true,
      unique: true,
    },

    host_user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "RESTRICT",
    },

    max_players: {
      type: "smallint",
      notNull: true,
      default: 6,
    },

    drawing_duration: {
      type: "smallint",
      notNull: true,
      default: 60,
    },

    voting_duration: {
      type: "smallint",
      notNull: true,
      default: 30,
    },

    input_mode: {
      type: "varchar(10)",
      notNull: true,
      default: "canvas",
    },

    status: {
      type: "varchar(20)",
      notNull: true,
      default: "waiting",
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("rooms", "rooms_code_format_check", {
    check: "code ~ '^[A-Z0-9]{6,8}$'",
  });

  pgm.addConstraint("rooms", "rooms_max_players_check", {
    check: "max_players BETWEEN 3 AND 10",
  });

  pgm.addConstraint("rooms", "rooms_drawing_duration_check", {
    check: "drawing_duration BETWEEN 30 AND 180 AND drawing_duration % 15 = 0",
  });

  pgm.addConstraint("rooms", "rooms_voting_duration_check", {
    check: "voting_duration BETWEEN 15 AND 90",
  });

  pgm.addConstraint("rooms", "rooms_input_mode_check", {
    check: "input_mode IN ('canvas', 'photo')",
  });

  pgm.addConstraint("rooms", "rooms_status_check", {
    check: "status IN ('waiting', 'in_progress', 'finished', 'closed')",
  });

  pgm.createIndex("rooms", "host_user_id");
  pgm.createIndex("rooms", "status");
};

export const down = (pgm) => {
  pgm.dropTable("rooms");
};

~~~
--- END FILE: server/migrations/1792316730967_init-rooms.js ---


--- BEGIN FILE: server/migrations/1792317377319_init-room-members.js ---
~~~
export const up = (pgm) => {
  pgm.createTable("room_members", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    room_id: {
      type: "uuid",
      notNull: true,
      references: "rooms",
      onDelete: "CASCADE",
    },

    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },

    role: {
      type: "varchar(10)",
      notNull: true,
      default: "player",
    },

    joined_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("room_members", "room_members_role_check", {
    check: "role IN ('host', 'player')",
  });

  pgm.addConstraint("room_members", "room_members_room_user_unique", {
    unique: ["room_id", "user_id"],
  });

  pgm.createIndex("room_members", "user_id");
};

export const down = (pgm) => {
  pgm.dropTable("room_members");
};
~~~
--- END FILE: server/migrations/1792317377319_init-room-members.js ---


--- BEGIN FILE: server/migrations/1792591161392_add-chat-messages.js ---
~~~

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.createTable("chat_messages", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    room_id: {
      type: "uuid",
      notNull: true,
      references: "rooms",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    content: {
      type: "varchar(1000)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("clock_timestamp()"),
    },
  });

  pgm.addConstraint("chat_messages", "chat_messages_content_not_empty", {
    check: "length(trim(content)) > 0",
  });

  pgm.createIndex(
    "chat_messages",
    ["room_id", "created_at", "id"],
    {
      name: "chat_messages_room_history_idx",
    }
  );
};

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.dropTable("chat_messages");
};

~~~
--- END FILE: server/migrations/1792591161392_add-chat-messages.js ---


--- BEGIN FILE: server/migrations/1792670000000_add-games.js ---
~~~
export const up = (pgm) => {
  pgm.createTable("games", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    room_id: { type: "uuid", notNull: true, references: "rooms", onDelete: "RESTRICT" },
    status: { type: "varchar(16)", notNull: true, default: "active" },
    input_mode: { type: "varchar(10)", notNull: true },
    drawing_duration: { type: "smallint", notNull: true },
    voting_duration: { type: "smallint", notNull: true },
    capture_duration: { type: "smallint", notNull: true, default: 25 },
    current_round_number: { type: "smallint", notNull: true, default: 1 },
    current_phase: { type: "varchar(16)", notNull: true, default: "prompt" },
    phase_ends_at: { type: "timestamptz", notNull: true },
    insufficient_connected_since: { type: "timestamptz" },
    started_at: { type: "timestamptz", notNull: true, default: pgm.func("CURRENT_TIMESTAMP") },
    ended_at: { type: "timestamptz" },
    abort_reason: { type: "varchar(100)" },
  });
  pgm.addConstraint("games", "games_status_check", { check: "status IN ('active', 'finished', 'aborted')" });
  pgm.addConstraint("games", "games_phase_check", { check: "current_phase IN ('prompt', 'drawing', 'capture', 'voting', 'result', 'finished', 'aborted')" });
  pgm.addConstraint("games", "games_capture_duration_check", { check: "capture_duration BETWEEN 15 AND 40" });
  pgm.createIndex("games", ["status", "phase_ends_at"], { name: "games_due_phase_idx" });
  pgm.createIndex("games", "room_id", { name: "games_one_active_room_idx", where: "status = 'active'", unique: true });

  pgm.createTable("game_participants", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    game_id: { type: "uuid", notNull: true, references: "games", onDelete: "CASCADE" },
    user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    roster_position: { type: "smallint", notNull: true },
    score: { type: "integer", notNull: true, default: 0 },
    connected_at: { type: "timestamptz" },
    disconnected_at: { type: "timestamptz" },
  });
  pgm.addConstraint("game_participants", "game_participants_game_user_unique", { unique: ["game_id", "user_id"] });
  pgm.addConstraint("game_participants", "game_participants_position_unique", { unique: ["game_id", "roster_position"] });
  pgm.createIndex("game_participants", ["user_id", "game_id"]);

  pgm.createTable("game_rounds", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    game_id: { type: "uuid", notNull: true, references: "games", onDelete: "CASCADE" },
    round_number: { type: "smallint", notNull: true },
    prompt_giver_user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    prompt_author_user_id: { type: "uuid", references: "users", onDelete: "RESTRICT" },
    prompt_text: { type: "varchar(500)" },
    prompt_status: { type: "varchar(16)", notNull: true, default: "pending" },
    prompt_deadline: { type: "timestamptz", notNull: true },
    voting_skipped: { type: "boolean", notNull: true, default: false },
    voting_skip_reason: { type: "varchar(50)" },
    result_processed: { type: "boolean", notNull: true, default: false },
  });
  pgm.addConstraint("game_rounds", "game_rounds_game_number_unique", { unique: ["game_id", "round_number"] });
  pgm.addConstraint("game_rounds", "game_rounds_prompt_status_check", { check: "prompt_status IN ('pending', 'submitted', 'missed')" });

  pgm.createTable("game_drawings", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    round_id: { type: "uuid", notNull: true, references: "game_rounds", onDelete: "CASCADE" },
    artist_user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    public_id: { type: "uuid", notNull: true, unique: true, default: pgm.func("gen_random_uuid()") },
    submission_type: { type: "varchar(10)", notNull: true },
    canvas_data: { type: "text" },
    storage_key: { type: "varchar(255)" },
    mime_type: { type: "varchar(100)" },
    byte_size: { type: "integer" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("CURRENT_TIMESTAMP") },
  });
  pgm.addConstraint("game_drawings", "game_drawings_round_artist_unique", { unique: ["round_id", "artist_user_id"] });
  pgm.addConstraint("game_drawings", "game_drawings_type_check", { check: "submission_type IN ('canvas', 'photo')" });

  pgm.createTable("game_votes", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    round_id: { type: "uuid", notNull: true, references: "game_rounds", onDelete: "CASCADE" },
    voter_user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    drawing_id: { type: "uuid", notNull: true, references: "game_drawings", onDelete: "RESTRICT" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("CURRENT_TIMESTAMP") },
  });
  pgm.addConstraint("game_votes", "game_votes_round_voter_unique", { unique: ["round_id", "voter_user_id"] });

  pgm.createTable("game_score_events", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    game_id: { type: "uuid", notNull: true, references: "games", onDelete: "CASCADE" },
    round_id: { type: "uuid", notNull: true, references: "game_rounds", onDelete: "CASCADE" },
    user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    event_type: { type: "varchar(32)", notNull: true },
    points: { type: "integer", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("CURRENT_TIMESTAMP") },
  });
  pgm.addConstraint("game_score_events", "game_score_events_once", { unique: ["round_id", "user_id", "event_type"] });
  pgm.addConstraint("game_score_events", "game_score_events_type_check", { check: "event_type = 'non_voting_penalty'" });
};

export const down = (pgm) => {
  pgm.dropTable("game_score_events");
  pgm.dropTable("game_votes");
  pgm.dropTable("game_drawings");
  pgm.dropTable("game_rounds");
  pgm.dropTable("game_participants");
  pgm.dropTable("games");
};

~~~
--- END FILE: server/migrations/1792670000000_add-games.js ---


--- BEGIN FILE: server/migrations/1792670000001_add-game-round-participant-status.js ---
~~~
export const up = (pgm) => {
  pgm.createTable("game_round_participants", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    round_id: { type: "uuid", notNull: true, references: "game_rounds", onDelete: "CASCADE" },
    user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    drawing_status: { type: "varchar(16)", notNull: true, default: "pending" },
    voted_at: { type: "timestamptz" },
  });
  pgm.addConstraint("game_round_participants", "game_round_participants_unique", { unique: ["round_id", "user_id"] });
  pgm.addConstraint("game_round_participants", "game_round_participants_drawing_status_check", { check: "drawing_status IN ('pending', 'submitted', 'missing')" });
};

export const down = (pgm) => pgm.dropTable("game_round_participants");

~~~
--- END FILE: server/migrations/1792670000001_add-game-round-participant-status.js ---
