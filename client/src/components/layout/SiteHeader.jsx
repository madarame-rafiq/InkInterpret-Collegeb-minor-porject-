import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import Button from '../ui/Button.jsx'
import { NAV_LINKS } from './navLinks.js'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  // Escape closes the mobile menu and returns focus to the toggle button.
  useEffect(() => {
    if (!open) return
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-control text-sm font-semibold text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              {link.label}
            </a>
          ))}
          <Button href="#build-status" size="sm">
            Get started
          </Button>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-control border-2 border-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-ink/15 md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-ink/10">
              <a
                href={link.href}
                onClick={close}
                className="block py-3 font-display text-xl"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="py-4">
            <Button href="#build-status" onClick={close} className="w-full">
              Get started
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  )
}