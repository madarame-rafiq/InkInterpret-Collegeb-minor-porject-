export default function DashboardBackdrop() {
  return (
    <>
      <style>{`
        @keyframes dashboardSketchDraw {
          0%   { stroke-dashoffset: 1; opacity: 0; }
          3%   { stroke-dashoffset: 1; opacity: 1; }
          25%  { stroke-dashoffset: 0; opacity: 1; }
          65%  { stroke-dashoffset: 0; opacity: 1; }
          78%  { stroke-dashoffset: 0; opacity: 0; }
          100% { stroke-dashoffset: 1; opacity: 0; }
        }
        .dashboard-sketch path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          opacity: 0;
          animation: dashboardSketchDraw var(--cycle, 14s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        .dashboard-sketch path:nth-child(even) {
          animation-delay: calc(var(--delay, 0s) + 0.2s);
        }
        @media (prefers-reduced-motion: reduce) {
          .dashboard-sketch path {
            animation: none;
            stroke-dashoffset: 0;
            opacity: 0.35;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Sun — top-right */}
        <svg
          className="dashboard-sketch absolute right-[3%] top-[6%] h-14 w-14 text-vermilion/25 sm:h-20 sm:w-20"
          style={{ '--cycle': '13s', '--delay': '1.5s' }}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength="1" d="M68 50 A18 18 0 1 1 32 50 A18 18 0 1 1 68 50" />
          <path pathLength="1" d="M50 18 L50 8" />
          <path pathLength="1" d="M50 82 L50 92" />
          <path pathLength="1" d="M18 50 L8 50" />
          <path pathLength="1" d="M82 50 L92 50" />
          <path pathLength="1" d="M27 27 L20 20" />
          <path pathLength="1" d="M73 73 L80 80" />
          <path pathLength="1" d="M73 27 L80 20" />
          <path pathLength="1" d="M27 73 L20 80" />
        </svg>

        {/* Pencil — bottom-left */}
        <svg
          className="dashboard-sketch absolute bottom-[6%] left-[2%] hidden h-16 w-24 text-ink/25 sm:block"
          style={{ '--cycle': '15s', '--delay': '0s' }}
          viewBox="0 0 96 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength="1" d="M6 42 L 78 6 L 90 24 L 18 42 Z" />
          <path pathLength="1" d="M78 6 L 74 2 L 84 10 Z" />
          <path pathLength="1" d="M6 42 L 14 44 L 18 42" />
          <path pathLength="1" d="M20 34 L 82 16" />
        </svg>

        {/* Bird — top-left */}
        <svg
          className="dashboard-sketch absolute left-[6%] top-[10%] h-7 w-12 text-ink/25 sm:h-9 sm:w-14"
          style={{ '--cycle': '12s', '--delay': '4s' }}
          viewBox="0 0 64 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength="1" d="M4 20 Q 16 8, 28 18 Q 40 8, 52 20" />
          <path pathLength="1" d="M52 20 Q 58 16, 60 18" />
        </svg>

        {/* Sparkle — mid-right */}
        <svg
          className="dashboard-sketch absolute right-[10%] top-[48%] hidden h-8 w-8 text-vermilion/30 sm:block"
          style={{ '--cycle': '10s', '--delay': '2.5s' }}
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path pathLength="1" d="M20 6 L20 34" />
          <path pathLength="1" d="M6 20 L34 20" />
          <path pathLength="1" d="M10 10 L30 30" />
          <path pathLength="1" d="M30 10 L10 30" />
        </svg>

        {/* Flower — bottom-right */}
        <svg
          className="dashboard-sketch absolute bottom-[4%] right-[4%] hidden h-20 w-16 text-ink/20 md:block"
          style={{ '--cycle': '16s', '--delay': '5.5s' }}
          viewBox="0 0 80 110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength="1" d="M40 105 Q 42 80, 40 55" />
          <path pathLength="1" d="M40 78 Q 22 76, 18 62 Q 32 60, 40 70" />
          <path pathLength="1" d="M40 88 Q 56 86, 62 72 Q 48 70, 40 80" />
          <path pathLength="1" d="M40 55 Q 30 42, 38 32 Q 46 40, 40 55" />
          <path pathLength="1" d="M40 55 Q 50 42, 42 32 Q 34 40, 40 55" />
          <path pathLength="1" d="M40 55 Q 30 55, 26 47 Q 36 44, 40 55" />
          <path pathLength="1" d="M40 55 Q 50 55, 54 47 Q 44 44, 40 55" />
          <path pathLength="1" d="M36 48 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0" />
        </svg>
      </div>
    </>
  )
}