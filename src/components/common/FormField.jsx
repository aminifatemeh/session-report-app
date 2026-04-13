import styles from './FormField.module.scss';

export default function FormField({ label, error, helper, children, required }) {
    return (
        <div className={styles.field}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            {children}
            {helper && !error && <p className={styles.helper}>{helper}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}
