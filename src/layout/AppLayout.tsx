import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__row">
          <nav className="app-nav" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                'app-nav__link' + (isActive ? ' app-nav__link--active' : '')
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                'app-nav__link' + (isActive ? ' app-nav__link--active' : '')
              }
            >
              Favorites
            </NavLink>
            <NavLink
              to="/watched"
              className={({ isActive }) =>
                'app-nav__link' + (isActive ? ' app-nav__link--active' : '')
              }
            >
              Watched
            </NavLink>
            <NavLink
              to="/planned"
              className={({ isActive }) =>
                'app-nav__link' + (isActive ? ' app-nav__link--active' : '')
              }
            >
              Plan to watch
            </NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
