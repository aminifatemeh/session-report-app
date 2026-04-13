import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import styles from './Layout.module.scss';

export default function StudentLayout() {
    const { user, role } = useAuth();
    if (!user || role !== 'student') return <Navigate to="/login" replace />;
    return (
        <div className={styles.layout}>
            <Navbar />
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}
