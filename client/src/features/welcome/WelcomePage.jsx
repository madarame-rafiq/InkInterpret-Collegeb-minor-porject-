import SiteHeader from '../../components/layout/SiteHeader.jsx'
import SiteFooter from '../../components/layout/SiteFooter.jsx'
import Hero from './Hero.jsx'
import HowItWorks from './HowItWorks.jsx'
import BuildStatus from './BuildStatus.jsx'

export default function WelcomePage() {
  return (
    <div id="top" className="overflow-x-clip">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:border-2 focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        <Hero />
        <HowItWorks />
        <BuildStatus />
      </main>

      <SiteFooter />
    </div>
  )
}