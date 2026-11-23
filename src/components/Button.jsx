import { Link } from 'react-router-dom'
import { cx } from '../utils/format'
import styles from './Button.module.css'

// Dynamic styling lewat props: variant, size, fullWidth, loading. Jika ada `to`, dirender sebagai Link.
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  to,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}) {
  const classes = cx(styles.button, styles[variant], styles[size], fullWidth && styles.full, className)
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading} {...rest}>
      {loading && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </button>
  )
}
