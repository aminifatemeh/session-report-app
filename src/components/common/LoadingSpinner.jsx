import styles from './LoadingSpinner.module.scss';

export default function LoadingSpinner({ size = 'md', centered = false }) {
    return (
        <div className={[styles.wrapper, centered ? styles.centered : ''].join(' ')}>
            <div className={[styles.spinner, styles[size]].join(' ')} />
        </div>
    );
}
