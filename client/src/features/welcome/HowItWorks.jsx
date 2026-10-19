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