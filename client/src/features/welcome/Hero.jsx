import { ArrowDown, ArrowRight } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import GameplayPreview from './GameplayPreview.jsx'

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-28 lg:pt-20"
    >
      <div className="lg:col-span-6">
        <p className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
          <span className="h-px w-8 bg-ink" aria-hidden="true" />
          A drawing game for 3–10 players
        </p>

        <h1
          id="hero-heading"
          className="text-balance font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-medium leading-[1.03] tracking-tight"
        >
          Same prompt.{' '}
          <span className="relative inline-block whitespace-nowrap italic">
            Wildly
            <svg
              className="absolute -bottom-2 left-0 h-3 w-full text-vermilion"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="draw-in stroke-current"
                style={{ '--d': '500ms' }}
                pathLength="1"
                d="M2 8 C 50 2, 90 11, 140 6 S 240 3, 298 7"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </span>{' '}
          different drawings.
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
          InkInterpret is a multiplayer drawing game. Everyone in the room gets
          the same prompt, sketches their own reading of it, and then the room
          votes on the interpretations.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="#build-status">
            Get started
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
          <Button href="#how-it-works" variant="secondary">
            How it works
            <ArrowDown className="size-5" aria-hidden="true" />
          </Button>
        </div>

        <p className="mt-4 text-sm text-ink-faint">
          Sign-up and rooms arrive in the next build. For now, this page is the
          tour.
        </p>

        <ul className="mt-12 flex max-w-md flex-wrap gap-y-2 border-t border-ink/20 pt-5 text-sm font-semibold text-ink-soft">
          <li className="pr-5">3–10 players</li>
          <li className="border-l border-ink/25 px-5">Canvas or paper</li>
          <li className="border-l border-ink/25 pl-5">Vote &amp; reveal</li>
        </ul>
      </div>

      <div className="lg:col-span-6">
        <GameplayPreview />
      </div>
    </section>
  )
}