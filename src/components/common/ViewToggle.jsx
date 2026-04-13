import styles from './ViewToggle.module.scss';

export default function ViewToggle({ view, onToggle }) {
    return (
        <div className={styles.toggle} role="group" aria-label="View toggle">
            <button
                className={[styles.btn, view === 'grid' ? styles.active : ''].join(' ')}
                onClick={() => onToggle('grid')}
                aria-pressed={view === 'grid'}
                title="Grid view"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="0" y="0" width="7" height="7" rx="1.5"/>
                    <rect x="9" y="0" width="7" height="7" rx="1.5"/>
                    <rect x="0" y="9" width="7" height="7" rx="1.5"/>
                    <rect x="9" y="9" width="7" height="7" rx="1.5"/>
                </svg>
            </button>
            <button
                className={[styles.btn, view === 'list' ? styles.active : ''].join(' ')}
                onClick={() => onToggle('list')}
                aria-pressed={view === 'list'}
                title="List view"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="0" y="0" width="16" height="3" rx="1.5"/>
                    <rect x="0" y="6" width="16" height="3" rx="1.5"/>
                    <rect x="0" y="12" width="16" height="3" rx="1.5"/>
                </svg>
            </button>
        </div>
    );
}
