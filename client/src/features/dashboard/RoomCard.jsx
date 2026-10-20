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