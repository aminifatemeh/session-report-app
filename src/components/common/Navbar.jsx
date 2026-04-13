import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';
import styles from './Navbar.module.scss';

const roleLabel = { supervisor: 'Supervisor', teacher: 'Teacher', student: 'Student' };
const roleColor = { supervisor: 'accent', teacher: 'primary', student: 'success' };

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className={styles.navbar}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <rect width="22" height="22" rx="6" fill="currentColor" fillOpacity="0.15"/>
                            <path d="M11 4L18 8v6l-7 4L4 14V8l7-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                            <path d="M11 4v14M4 8l7 4 7-4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className={styles.brandName}>EduReport</span>
                </div>

                <div className={styles.right}>
                    <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
            </span>
                        <span className={[styles.roleBadge, styles[roleColor[user.role]]].join(' ')}>
              {roleLabel[user.role]}
            </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10.5 11.5L14 8l-3.5-3.5M14 8H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
}
