const base =
  'inline-flex items-center justify-center gap-2 rounded-control border-2 border-ink font-semibold ' +
  'transition-[transform,box-shadow,background-color,color] duration-150 ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants = {
  // Stamp-style: vermilion fill, ink text (4.7:1 contrast), hard offset shadow
  primary:
    'bg-vermilion text-ink shadow-stamp ' +
    'hover:-translate-x-px hover:-translate-y-px hover:shadow-stamp-lift ' +
    'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
  // Outline: fills with ink on hover
  secondary: 'bg-transparent text-ink hover:bg-ink hover:text-paper',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-base',
}

// Renders an <a> when given href, otherwise a <button>.
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}