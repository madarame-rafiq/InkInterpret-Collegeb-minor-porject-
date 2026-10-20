import { Link } from 'react-router-dom'

// The mark is a lowercase "i": a brush-stroke stem, a vermilion ink drop for
// the dot, and a loose underline. It reads as "ink" and as "interpret".
export function BrandMark({ className = 'size-9' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="fill-current"
        d="M16.6 17.2c-.5 4.6-.3 9.1-.9 14.3 1.5.5 3.6.5 5.3-.1-.6-5-.4-9.7.1-14.2-1.5-.6-3.2-.6-4.5 0Z"
      />
      <path
        className="fill-vermilion"
        d="M19 5.2c2.6-.2 4.6 1.8 4.4 4.4-.2 2.4-2.2 4-4.5 3.9-2.5-.1-4.3-2-4.2-4.3.1-2.2 1.8-3.8 4.3-4Z"
      />
      <path
        className="stroke-current"
        d="M8 35.5c6-1.4 17-1.6 24.5-.2"
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Wordmark({ className = '' }) {
  return (
    <span
      className={`font-display text-xl leading-none tracking-tight ${className}`}
    >
      <span className="font-semibold">Ink</span>
      <span className="italic">Interpret</span>
    </span>
  )
}

// href -> in-page anchor (the welcome page's own "#top")
// otherwise -> router link to the welcome page
export default function Logo({ href }) {
  const className = 'inline-flex items-center gap-2 rounded-control'
  const content = (
    <>
      <BrandMark />
      <Wordmark />
    </>
  )

  if (href) {
    return (
      <a href={href} aria-label="InkInterpret, back to top" className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link to="/" aria-label="InkInterpret, home" className={className}>
      {content}
    </Link>
  )
}