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
