// GamePhaseView: renders the room's main area for an existing game, from the
// server's phase. Every phase is server-driven; this view never advances one.

import { Users } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import PhaseTimer from './PhaseTimer.jsx'
import PromptView from './PromptView.jsx'
import DrawingView from './DrawingView.jsx'
import CaptureView from './CaptureView.jsx'
import VotingView from './VotingView.jsx'
import ResultsView from './ResultsView.jsx'

const PHASE_LABELS = {
  prompt: 'Prompt',
  drawing: 'Drawing',
  capture: 'Photo capture',
  voting: 'Voting',
  result: 'Round result',
  finished: 'Finished',
  aborted: 'Game ended',
}

const ABORT_MESSAGES = {
  INSUFFICIENT_CONNECTED_PLAYERS: 'Too few players stayed connected, so the server ended the game.',
}

// The missed-prompt notice arrives as a socket event with no room identifier,
// and the socket stays in a room's channel after you navigate away. So a notice
// is shown only if it fits THIS game: same round, and it names this round's
// prompt giver. Otherwise it's ignored.
function noticeApplies(notice, game) {
  if (!notice || notice.round !== game.round.number) return false
  const giver = game.participants.find((p) => p.position === game.round.number)
  return Boolean(giver) && typeof notice.message === 'string' && notice.message.startsWith(`${giver.username} `)
}

function Panel({ title, children }) {
  return (
    <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-5 py-4">
      <p className="font-display text-xl font-medium leading-snug">{title}</p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-soft">{children}</div>
    </div>
  )
}

function PromptCard({ game, notice }) {
  const { round } = game

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
          {noticeApplies(notice, game)
            ? notice.message
            : 'No prompt was submitted for this round. Everyone still draws.'}
        </p>
      </div>
    )
  }

  return null
}

const paperSteps = [
  'Grab a sheet of paper and a dark pen or marker.',
  'Draw your interpretation of the prompt.',
  'When the capture step opens, photograph it or upload a photo.',
]

function PaperInstructions() {
  return (
    <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-5 py-4">
      <p className="font-display text-xl font-medium leading-snug">Draw on paper now.</p>
      <ol className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
        {paperSteps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="font-display text-base font-medium text-vermilion-deep" aria-hidden="true">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-ink-soft">
        Everyone draws every round, including the prompt giver. Keep your drawing close: you’ll
        submit it in the capture step, not before.
      </p>
    </div>
  )
}

function PhaseBody({ game, notice, abortReason, inputMode, roomCode, onRefreshGame, onReturnToLobby }) {
  const { phase, round, participants } = game
  const promptGiver = participants.find((p) => p.position === round.number) ?? null
  const roundKey = `${game.id}:${round.number}`
  // The server states the mode; the room setting is only a fallback.
  const mode = game.inputMode ?? inputMode

  switch (phase) {
    case 'prompt':
      return (
        <PromptView
          key={roundKey}
          roomCode={roomCode}
          isPromptGiver={Boolean(promptGiver?.isYou)}
          promptGiverName={promptGiver?.username}
          onRefreshGame={onRefreshGame}
        />
      )

    case 'drawing':
      return (
        <>
          <PromptCard game={game} notice={notice} />
          {mode === 'photo' ? (
            <PaperInstructions />
          ) : (
            // Keyed by round so each round starts with a fresh canvas.
            <DrawingView
              key={roundKey}
              roomCode={roomCode}
              game={game}
              onRefreshGame={onRefreshGame}
            />
          )}
        </>
      )

    case 'capture':
      return (
        <>
          <PromptCard game={game} notice={notice} />
          {mode === 'canvas' ? (
            <Panel title="There’s no capture step in a canvas room.">
              <p>The round moves on when the server’s timer ends.</p>
            </Panel>
          ) : (
            <CaptureView
              key={roundKey}
              roomCode={roomCode}
              game={game}
              onRefreshGame={onRefreshGame}
            />
          )}
        </>
      )

    case 'voting':
      return (
        <>
          <PromptCard game={game} notice={notice} />
          <VotingView
            key={roundKey}
            roomCode={roomCode}
            game={game}
            onRefreshGame={onRefreshGame}
          />
        </>
      )

    case 'result':
      return (
        <>
          <PromptCard game={game} notice={notice} />
          <ResultsView key={roundKey} game={game} />
        </>
      )

    case 'finished':
      return (
        <>
          <ResultsView key={roundKey} game={game} isFinal />
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
  inputMode,
  roomCode,
  syncError,
  onRetrySync,
  onRefreshGame,
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
  const showMissedBanner = isActive && phase !== 'prompt' && noticeApplies(notice, game)

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
        inputMode={inputMode}
        roomCode={roomCode}
        onRefreshGame={onRefreshGame}
        onReturnToLobby={onReturnToLobby}
      />

      <PlayerStrip participants={participants} round={round} isActive={isActive} />
    </div>
  )
}