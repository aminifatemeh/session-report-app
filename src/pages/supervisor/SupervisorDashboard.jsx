import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SupervisorDashboard.module.scss';

export default function SupervisorDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="page-content">
            <div className={styles.welcome}>
                <h1 className={styles.greeting}>Welcome back, <span>{user.username}</span></h1>
                <p className={styles.sub}>Manage your institute's teachers and students from here.</p>
            </div>

            <div className={styles.cards}>
                <button className={styles.navCard} onClick={() => navigate('/supervisor/teachers')}>
                    <div className={styles.cardIcon} data-color="blue">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M20 24v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="2"/>
                            <path d="M24 24v-2a4 4 0 00-3-3.87M17 4.13a4 4 0 010 7.74" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div className={styles.cardText}>
                        <h2>Teachers</h2>
                        <p>View and manage all teachers, their profiles and assigned students.</p>
                    </div>
                    <svg className={styles.arrow} width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <button className={styles.navCard} onClick={() => navigate('/supervisor/students')}>
                    <div className={styles.cardIcon} data-color="purple">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M22 24v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="2"/>
                            <path d="M17 4.13a4 4 0 010 7.74" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div className={styles.cardText}>
                        <h2>Students</h2>
                        <p>View and manage all students, their terms and session reports.</p>
                    </div>
                    <svg className={styles.arrow} width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
