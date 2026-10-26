import DrawingImage from './DrawingImage.jsx'

// Round result (isFinal=false) or the terminal state (isFinal=true).
// Artist names and vote totals exist in the state only from the result phase on.
export default function ResultsView({ game, isFinal = false }) {
  const { drawings, round, participants } = game
  const you = participants.find((player) => player.isYou)

  const ranked = [...drawings].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
  const topVotes = ranked[0]?.votes ?? 0
  const showVotes = !round.votingSkipped

  const standings = [...participants].sort(
    (a, b) => b.score - a.score || a.position - b.position,
  )

  return (
    <div className="space-y-6">
      {round.votingSkipped && (
        <div className="border-2 border-l-[6px] border-ink border-l-vermilion bg-sheet px-5 py-4">
          <p className="font-display text-xl font-medium leading-snug">
            Voting was skipped this round.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {round.votingSkipReason === 'FEWER_THAN_TWO_DRAWINGS'
              ? 'The server skipped it because fewer than two drawings were submitted.'
              : 'The server skipped voting for this round.'}
          </p>
        </div>
      )}

      {drawings.length === 0 ? (
        <p className="border-2 border-dashed border-ink/40 px-5 py-6 text-center text-sm text-ink-soft">
          No drawings were submitted this round.
        </p>
      ) : (
        <section aria-labelledby="results-heading">
          <h2
            id="results-heading"
            className="mb-4 border-b-2 border-ink pb-2 font-display text-xl font-medium tracking-tight"
          >
            {round.votingSkipped ? 'The drawings' : 'The artists are revealed'}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {ranked.map((entry, index) => {
              const isTop = showVotes && topVotes > 0 && entry.votes === topVotes
              const isYours = Boolean(you) && entry.artist === you.username
              return (
                <li
                  key={entry.publicId}
                  className={`border-2 bg-sheet ${isTop ? 'border-ink shadow-stamp' : 'border-ink/40'}`}
                >
                  <DrawingImage entry={entry} alt={`Drawing by ${entry.artist ?? `artist ${index + 1}`}`} />
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-ink/20 px-3 py-2">
                    <p className="font-display text-lg font-medium leading-tight">
                      {entry.artist ?? 'Unknown artist'}
                      {isYours && <span className="ml-1 text-sm font-normal text-ink-faint">(you)</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      {isTop && (
                        <span className="border-2 border-ink bg-vermilion px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.1em]">
                          Most votes
                        </span>
                      )}
                      {showVotes && typeof entry.votes === 'number' && (
                        <span className="text-sm font-semibold tabular-nums">
                          {entry.votes} {entry.votes === 1 ? 'vote' : 'votes'}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {isFinal && (
        <section aria-labelledby="standings-heading">
          <h2
            id="standings-heading"
            className="mb-3 border-b-2 border-ink pb-2 font-display text-xl font-medium tracking-tight"
          >
            Final standings
          </h2>
          <ol className="divide-y divide-ink/10">
            {standings.map((player, index) => (
              <li key={player.position} className="flex items-center gap-3 py-2 text-sm">
                <span className="w-6 shrink-0 text-xs font-semibold text-ink-faint">{index + 1}</span>
                <span className="flex-1 truncate font-semibold">
                  {player.username}
                  {player.isYou && <span className="ml-1 font-normal text-ink-faint">(you)</span>}
                </span>
                <span className="font-display text-lg font-medium tabular-nums">{player.score}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}