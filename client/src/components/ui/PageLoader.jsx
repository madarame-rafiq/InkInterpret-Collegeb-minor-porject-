export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div role="status" className="grid min-h-dvh place-items-center px-5">
      <div className="text-center">
        <svg
          viewBox="0 0 120 24"
          aria-hidden="true"
          focusable="false"
          className="mx-auto h-6 w-28 text-vermilion"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path
            className="draw-in stroke-current"
            pathLength="1"
            d="M4 14 C 20 2, 34 24, 50 12 S 80 2, 96 14 S 112 18, 116 10"
          />
        </svg>
        <p className="mt-3 text-sm font-semibold text-ink-soft">{label}</p>
      </div>
    </div>
  )
}