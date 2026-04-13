import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Sidebar.module.scss'

// ─── Icons (inline SVG) ───────────────────
const Icons = {
    logo: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#2563eb"/>
            <path d="M8 20V10l6-3 6 3v10l-6 3-6-3z" stroke="#fff" strokeWidth="1.5"
                  strokeLinejoin="round"/>
            <path d="M14 7v13M8 10l6 3 6-3" stroke="#fff" strokeWidth="1.5"
                  strokeLinejoin="round"/>
        </svg>
    ),
    dashboard: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
    ),
    students: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    teachers: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
            <path d="M12 12v.01M8 12v.01M16 12v.01"/>
            <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
        </svg>
    ),
    reports: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
        </svg>
    ),
    logout: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
    ),
    chevron: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
        </svg>
    ),
}

// ─── Nav Items ────────────────────────────
const NAV_ITEMS = [
    { to: '/dashboard',  label: 'Dashboard',  icon: Icons.dashboard },
    { to: '/students',   label: 'Students',   icon: Icons.students  },
    { to: '/teachers',   label: 'Teachers',   icon: Icons.teachers  },
    { to: '/reports',    label: 'Reports',    icon: Icons.reports   },
]

// ─── Component ────────────────────────────
export default function Sidebar({ collapsed, mobileOpen, onMobileClose }) {
    const navigate = useNavigate()

    function handleLogout() {
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <aside
            className={[
                styles.sidebar,
                collapsed      ? styles.collapsed   : '',
                mobileOpen     ? styles.mobileOpen  : '',
            ].join(' ')}
        >
            {/* Logo */}
            <div className={styles.logo}>
                <span className={styles.logoIcon}>{Icons.logo}</span>
                {!collapsed && (
                    <span className={styles.logoText}>EduReport</span>
                )}
            </div>

            {/* Nav */}
            <nav className={styles.nav}>
                {NAV_ITEMS.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onMobileClose}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <span className={styles.navIcon}>{item.icon}</span>
                        {!collapsed && (
                            <span className={styles.navLabel}>{item.label}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className={styles.bottom}>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <span className={styles.navIcon}>{Icons.logout}</span>
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    )
}
