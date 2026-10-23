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
