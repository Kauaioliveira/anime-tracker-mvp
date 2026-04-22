import { NavLink, Outlet } from 'react-router-dom'
import HeaderQuickSearch from '../components/search/HeaderQuickSearch.tsx'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'relative z-[2] rounded-lg px-3 py-1.5 text-[0.94rem] font-semibold tracking-wide text-[var(--text-h)] no-underline hover:bg-[var(--accent-bg)] max-sm:inline-flex max-sm:min-h-11 max-sm:items-center max-sm:px-[0.65rem] max-sm:py-1.5',
    isActive ? 'border border-[var(--accent-border)] bg-[var(--accent-bg)]' : '',
  ]
    .filter(Boolean)
    .join(' ')

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-[100] border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-lg pt-[max(0.75rem,env(safe-area-inset-top,0px))] pe-[max(1.25rem,env(safe-area-inset-right,0px))] pb-3 ps-[max(1.25rem,env(safe-area-inset-left,0px))] text-left">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-3">
          <nav
            className="relative z-[1] flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1"
            aria-label="Main navigation"
          >
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              Favorites
            </NavLink>
            <NavLink to="/watched" className={navLinkClass}>
              Watched
            </NavLink>
            <NavLink to="/planned" className={navLinkClass}>
              Plan to watch
            </NavLink>
          </nav>
          <HeaderQuickSearch />
        </div>
      </header>
      <Outlet />
    </div>
  )
}
