// GamePhaseView: renders the room's main area for an existing game, from the
// server's phase. Stage 1 shows real state only. Phases whose interactive UI
// arrives in later stages say so honestly and offer no controls that imply
// they work. No scores are shown; positive vote scoring isn't implemented on
// the backend yet, so any total would be misleading.

import { Users } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import PhaseTimer from './PhaseTimer.jsx'

const PHASE_LABELS = {
  prompt: 'Prompt',
  drawing: 'Drawing',
  capture: 'Photo capture',
  voting: 'Voting',
  result: 'Round result',
  finished: 'Finished',
  aborted: 'Game ended',
}

const SKIP_REASONS = {
  FEWER_THAN_TWO_DRAWINGS: 'fewer than two drawings were submitted',
}

const ABORT_MESSAGES = {
  INSUFFICIENT_CONNECTED_PLAYERS: 'Too few players stayed connected, so the server ended the game.',
}

function Panel({ title, children }) {
  return (
    <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-5 py-4">
      <p className="font-display text-xl font-medium leading-snug">{title}</p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-soft">{children}</div>
    </div>
  )
}

function PromptCard({ round, notice }) {
  const showNotice = notice && notice.round === round.number

  if (round.promptStatus === 'submitted' && round.prompt) {
    return (
      <div className="border-2 border-ink bg-paper px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          This round’s prompt
        </p>
        <p className="mt-1 font-display text-2xl italic leading-snug">“{round.prompt}”</p>
      </div>
    )
  }

  if (round.promptStatus === 'missed') {
    return (
      <div className="border-2 border-ink bg-paper px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          No prompt this round
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {/* The server's own wording when we received it live. After a refresh
              only the status survives, so state just that fact. */}
          {showNotice ? notice.message : 'No prompt was submitted for this round.'}
        </p>
      </div>
    )
  }

  return null
}

function PhaseBody({ game, notice, abortReason, onReturnToLobby }) {
  const { phase, round, participants, drawings } = game
  const promptGiver = participants.find((p) => p.position === round.number) ?? null
  const totalRounds = participants.length

  switch (phase) {
    case 'prompt':
      return promptGiver?.isYou ? (
        <Panel title="You’re the prompt giver this round.">
          <p>
            Prompt entry isn’t built into this version yet, so no prompt can be sent from here.
            The round will move on to drawing when the timer ends.
          </p>
          <p>Everyone draws every round, including the prompt giver.</p>
        </Panel>
      ) : (
        <Panel title={`Waiting for ${promptGiver?.username ?? 'the prompt giver'} to write the prompt.`}>
          <p>Everyone draws every round, including the prompt giver.</p>
        </Panel>
      )

    case 'drawing':
      return (
        <>
          <PromptCard round={round} notice={notice} />
          <Panel title="The drawing window is open.">
            <p>
              Drawing tools aren’t built into this version yet, so nothing can be submitted from
              here. The round moves on when the server’s timer ends.
            </p>
          </Panel>
        </>
      )

    case 'capture':
      return (
        <>
          <PromptCard round={round} notice={notice} />
          <Panel title="The photo capture window is open.">
            <p>
              Photo capture isn’t built into this version yet. The round moves on when the
              server’s timer ends.
            </p>
          </Panel>
        </>
      )

    case 'voting':
      return (
        <>
          <PromptCard round={round} notice={notice} />
          <Panel title="Voting is open.">
            <p>
              {drawings.length} anonymous {drawings.length === 1 ? 'drawing is' : 'drawings are'} in
              this round. The voting gallery isn’t built into this version yet, so no vote can be
              cast from here.
            </p>
            <p>Artists stay hidden until the round result.</p>
          </Panel>
        </>
      )

    case 'result':
      return round.votingSkipped ? (
        <Panel title="Voting was skipped this round.">
          <p>
            {SKIP_REASONS[round.votingSkipReason]
              ? `The server skipped it because ${SKIP_REASONS[round.votingSkipReason]}.`
              : 'The server skipped voting for this round.'}
          </p>
          <p>
            {round.number >= totalRounds
              ? 'That was the last round.'
              : 'The next round starts when the timer ends.'}
          </p>
        </Panel>
      ) : (
        <Panel title={`Round ${round.number} is complete.`}>
          <p>
            The results screen isn’t built into this version yet. Scores aren’t shown because the
            server doesn’t award points for votes yet.
          </p>
        </Panel>
      )

    case 'finished':
      return (
        <>
          <Panel title="The game is over.">
            <p>
              The final results screen isn’t built into this version yet, and scores aren’t shown
              because they wouldn’t be correct.
            </p>
          </Panel>
          <Button onClick={onReturnToLobby}>Return to lobby</Button>
        </>
      )

    case 'aborted':
      return (
        <>
          <Panel title="The game ended early.">
            <p>{ABORT_MESSAGES[abortReason] ?? 'The server ended this game before it finished.'}</p>
          </Panel>
          <Button onClick={onReturnToLobby}>Return to lobby</Button>
        </>
      )

    default:
      return (
        <Panel title="The server reported a phase this version doesn’t know.">
          <p>Phase: {phase}</p>
        </Panel>
      )
  }
}

function PlayerStrip({ participants, round, isActive }) {
  return (
    <section aria-labelledby="game-players-heading">
      <h2
        id="game-players-heading"
        className="mb-3 flex items-center gap-2 border-b-2 border-ink pb-2 font-display text-lg font-medium tracking-tight"
      >
        <Users className="size-5" aria-hidden="true" />
        Players ({participants.length})
      </h2>
      <ul className="divide-y divide-ink/10">
        {participants.map((player) => (
          <li key={player.position} className="flex items-center gap-3 py-2 text-sm">
            <span
              className="w-6 shrink-0 text-xs font-semibold text-ink-faint"
              aria-label={`Prompt turn ${player.position}`}
            >
              {player.position}
            </span>
            <span className="flex-1 truncate font-semibold">
              {player.username}
              {player.isYou && <span className="ml-1 font-normal text-ink-faint">(you)</span>}
            </span>
            {isActive && player.position === round.number && (
              <span className="border-2 border-ink bg-vermilion px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.1em]">
                Prompt giver
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function GamePhaseView({
  game,
  notice,
  abortReason,
  syncError,
  onRetrySync,
  onReturnToLobby,
}) {
  const { phase, status, round, participants, phaseEndsAt } = game
  const isActive = status === 'active'
  const totalRounds = participants.length
  const isLastRound = round.number >= totalRounds

  const timerLabels = {
    prompt: 'Prompt closes in',
    drawing: 'Drawing ends in',
    capture: 'Capture ends in',
    voting: 'Voting ends in',
    result: isLastRound ? 'Game ends in' : 'Next round in',
  }
  const timerLabel = isActive ? timerLabels[phase] : null

  // The server's own message about a missed prompt stays visible all round.
  const showMissedBanner =
    isActive && notice && notice.round === round.number && phase !== 'prompt'

  return (
    <div className="space-y-6">
      {syncError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 border-2 border-l-[6px] border-ink border-l-vermilion bg-paper px-4 py-3 text-sm"
        >
          <span className="font-semibold">
            Couldn’t refresh the game. What’s shown may be out of date.
          </span>
          <Button size="sm" variant="secondary" onClick={onRetrySync}>
            Try again
          </Button>
        </div>
      )}

      <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
            {isActive ? `Round ${round.number} of ${totalRounds}` : 'Game over'}
          </p>
          <h1 className="mt-1 text-balance font-display text-3xl font-medium leading-tight tracking-tight">
            {PHASE_LABELS[phase] ?? phase}
          </h1>
        </div>
        {timerLabel && <PhaseTimer endsAt={phaseEndsAt} label={timerLabel} />}
      </header>

      {showMissedBanner && (
        <p
          role="status"
          className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-4 py-3 text-sm font-semibold"
        >
          {notice.message}
        </p>
      )}

      <PhaseBody
        game={game}
        notice={notice}
        abortReason={abortReason}
        onReturnToLobby={onReturnToLobby}
      />

      <PlayerStrip participants={participants} round={round} isActive={isActive} />
    </div>
  )
}