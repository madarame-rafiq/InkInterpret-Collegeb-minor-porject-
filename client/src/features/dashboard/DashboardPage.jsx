import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext.js'
import { getErrorMessage } from '../../lib/api.js'
import Logo from '../../components/brand/Logo.jsx'
import Button from '../../components/ui/Button.jsx'
import CreateRoomForm from './CreateRoomForm.jsx'
import JoinRoomForm from './JoinRoomForm.jsx'
import RoomList from './RoomList.jsx'
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
            Create a room and share its code, or join a friend’s with theirs. Every room
            you’re part of is listed here.
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