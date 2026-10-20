import { Link } from 'react-router-dom'
import Logo from '../../components/brand/Logo.jsx'

// A blank frame with the vermilion ink drop from the logo, and one line
// being drawn: the start of a drawing, before anyone has interpreted it.
function BeginningSketch() {
  return (
    <svg
      viewBox="0 0 240 200"
      aria-hidden="true"
      focusable="false"
      className="h-auto w-full max-w-xs"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="20"
        y="16"
        width="200"
        height="168"
        strokeWidth="2"
        className="stroke-paper/40"
        transform="rotate(-2 120 100)"
      />
      <path
        className="stroke-paper/40"
        strokeWidth="2"
        d="M52 152 C 80 144, 104 160, 132 150 S 190 144, 200 152"
      />
      <path
        className="draw-in stroke-paper"
        style={{ '--d': '300ms' }}
        pathLength="1"
        strokeWidth="3"
        d="M60 122 C 80 62, 120 52, 140 92 S 170 132, 190 82"
      />
      <circle cx="120" cy="50" r="9" className="fill-vermilion" />
    </svg>
  )
}

export default function AuthLayout({ eyebrow, title, intro, headingRef, children }) {
  return (
    <div className="min-h-dvh overflow-x-clip lg:grid lg:grid-cols-12">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:border-2 focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>

      {/* On mobile this is just a dark band with the logo; on desktop it's a panel. */}
      <aside className="on-ink bg-ink text-paper lg:col-span-5">
        <div className="flex flex-col px-5 py-4 sm:px-8 lg:min-h-dvh lg:justify-between lg:px-12 lg:py-10">
          <div>
            <Logo />
          </div>

          <div className="hidden lg:block">
            <BeginningSketch />
            <p className="mt-6 max-w-xs font-display text-2xl italic leading-snug">
              Every drawing starts with a mark.
            </p>
          </div>

          <div className="hidden lg:block">
            <Link
              to="/"
              className="rounded-control text-sm font-semibold underline-offset-4 hover:underline"
            >
              Back to the welcome page
            </Link>
          </div>
        </div>
      </aside>

      <main
        id="main"
        className="flex items-center justify-center px-5 py-10 sm:px-8 lg:col-span-7 lg:px-16 lg:py-16"
      >
        <div className="w-full max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-vermilion-deep">
            {eyebrow}
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-balance font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
          >
            {title}
          </h1>
          {intro && <p className="mt-3 leading-relaxed text-ink-soft">{intro}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}