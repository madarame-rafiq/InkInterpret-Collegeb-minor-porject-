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