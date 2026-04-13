import styles from './Button.module.scss';

const variants = {
    primary: styles.primary,
    secondary: styles.secondary,
    ghost: styles.ghost,
    danger: styles.danger,
    success: styles.success,
};

const sizes = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
};

export default function Button({
                                   children,
                                   variant = 'primary',
                                   size = 'md',
                                   onClick,
                                   type = 'button',
                                   disabled = false,
                                   className = '',
                                   icon,
                                   iconEnd,
                                   fullWidth = false,
                                   ...rest
                               }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={[
                styles.btn,
                variants[variant] || styles.primary,
                sizes[size] || styles.md,
                fullWidth ? styles.fullWidth : '',
                className,
            ].filter(Boolean).join(' ')}
            {...rest}
        >
            {icon && <span className={styles.iconStart}>{icon}</span>}
            {children}
            {iconEnd && <span className={styles.iconEnd}>{iconEnd}</span>}
        </button>
    );
}
