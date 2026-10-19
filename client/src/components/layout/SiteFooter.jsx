import Logo from '../brand/Logo.jsx'
import { NAV_LINKS } from './navLinks.js'

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/15">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-ink-soft">
            A multiplayer drawing and interpretation game. A college minor
            project, currently in development.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-control underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#top"
                className="rounded-control underline-offset-4 hover:underline"
              >
                Back to top
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}