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