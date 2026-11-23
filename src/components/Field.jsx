import { useId } from 'react'
import { cx } from '../utils/format'
import styles from './Field.module.css'

// Input / textarea / select dengan label & error. `as` menentukan elemen.
export default function Field({ label, error, as: Tag = 'input', children, className, ...rest }) {
  const id = useId()
  return (
    <div className={cx(styles.field, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <Tag id={id} className={cx(styles.control, error && styles.invalid)} aria-invalid={!!error} {...rest}>
        {children}
      </Tag>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
