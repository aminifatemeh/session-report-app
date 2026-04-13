import { useNavigate } from 'react-router-dom';
import styles from './PageHeader.module.scss';

export default function PageHeader({ title, subtitle, backTo, backLabel = 'Back', actions }) {
    const navigate = useNavigate();

    return (
        <div className={styles.header}>
            <div className={styles.left}>
                {backTo && (
                    <button className={styles.backBtn} onClick={() => navigate(backTo)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {backLabel}
                    </button>
                )}
                <div>
                    <h1 className={styles.title}>{title}</h1>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
}
