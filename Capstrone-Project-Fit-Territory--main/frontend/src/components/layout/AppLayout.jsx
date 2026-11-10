
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Activity, Award, Dumbbell, Footprints, Gift,
  LayoutDashboard, LogOut, Map, Menu, Settings, Sparkles, Trophy, Wallet, X,
} from 'lucide-react'

const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Explore map', to: '/explore', icon: Map },
  { label: 'Activity', to: '/activity', icon: Activity },
  { label: 'Workouts', to: '/workouts', icon: Dumbbell },
  { label: 'Exercise library', to: '/exercises', icon: Footprints },
  { label: 'AI coach', to: '/coach', icon: Sparkles },
  { label: 'Leaderboard', to: '/leaderboard', icon: Trophy },
  { label: 'Challenges', to: '/challenges', icon: Award },
  { label: 'Fit Coins', to: '/wallet', icon: Wallet },
  { label: 'Rewards', to: '/rewards', icon: Gift },
]

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const profileName = user?.name || 'Athlete'

  const initials = profileName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const firstName = profileName.trim().split(/\s+/)[0] || ''

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark">
            <Footprints size={20} strokeWidth={2.4} />
          </div>
          <span>fit<span className="brand-light">territory</span></span>
          <button
            className="icon-button sidebar-close"
            aria-label="Close navigation"
            onClick={closeMenu}
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-label">YOUR JOURNEY</div>

        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Challenges' && (
                <span className="nav-count">2</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon"><Sparkles size={16} /></div>
            <div>
              <strong>Keep exploring</strong>
              <p>Every step opens new ground.</p>
            </div>
          </div>

          <NavLink
            to="/profile"
            onClick={closeMenu}
            className={({ isActive }) =>
              `nav-link profile-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="avatar avatar-lime">{initials}</span>
            <span className="profile-name">
              <strong>{profileName}</strong>
              <small>Level 08 · Trail seeker</small>
            </span>
            <Settings size={16} className="profile-settings" />
          </NavLink>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            <span>MY TERRITORY</span>
            <span className="breadcrumb-dot">/</span>
            <strong>
              Good afternoon{firstName ? `, ${firstName}` : ''}
            </strong>
          </div>

          <div className="topbar-actions">
            <span className="demo-pill"><span /> DEMO MODE</span>

            <NavLink to="/wallet" className="coin-pill">
              <span className="coin-symbol">F</span> 1,240
              <span className="coin-plus">+</span>
            </NavLink>

            <NavLink
              to="/profile"
              className="top-avatar avatar avatar-lime"
              aria-label="Profile"
            >
              {initials}
            </NavLink>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="page-content"><Outlet /></main>

        <footer className="app-footer">
          <span>FIT TERRITORY</span>
          <span>Move your way. Discover your world.</span>
          <span>Demo experience · Data saved on this device</span>
        </footer>
      </div>
    </div>
  )
}
