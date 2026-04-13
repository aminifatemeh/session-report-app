import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Please enter your username and password.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const user = await login(username.trim(), password);
            if (user.role === 'supervisor') navigate('/supervisor');
            else if (user.role === 'teacher')  navigate('/teacher');
            else navigate('/student');
        } catch {
            setError('Incorrect username or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {/* Branding */}
                <div className={styles.brand}>
                    <div className={styles.logoWrap}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="8" fill="currentColor" fillOpacity="0.15"/>
                            <path d="M14 5L22 9.5v9L14 23l-8-4.5v-9L14 5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            <path d="M14 5v18M6 9.5l8 4.5 8-4.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className={styles.brandName}>EduReport</h1>
                    <p className={styles.brandSub}>Session Reporting System</p>
                </div>

                {/* Form */}
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <h2 className={styles.formTitle}>Welcome back</h2>
                    <p className={styles.formSub}>Sign in to your account to continue</p>

                    <div className={styles.field}>
                        <label className={styles.label}>Username</label>
                        <input
                            className="input"
                            type="text"
                            autoComplete="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Password</label>
                        <div className={styles.passWrap}>
                            <input
                                className="input"
                                type={showPass ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className={styles.passToggle}
                                onClick={() => setShowPass(v => !v)}
                                tabIndex={-1}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M2 9s2.636-5 7-5 7 5 7 5-2.636 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
                                        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M2 2l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M2 9s2.636-5 7-5 7 5 7 5-2.636 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
                                        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorMsg} role="alert">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.spinner} />
                        ) : (
                            <>
                                Sign In
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Demo credentials helper */}
                <div className={styles.demo}>
                    <p className={styles.demoTitle}>Demo credentials</p>
                    <div className={styles.demoGrid}>
                        <div className={styles.demoItem}>
                            <span className={styles.demoRole}>Supervisor</span>
                            <code>admin / admin123</code>
                        </div>
                        <div className={styles.demoItem}>
                            <span className={styles.demoRole}>Teacher</span>
                            {/* ✅ */}
                            <code>sara.ahmadi / pass1234</code>
                        </div>
                        <div className={styles.demoItem}>
                            <span className={styles.demoRole}>Student</span>
                            {/* ✅ */}
                            <code>parisa.tehrani / pass1234</code>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
