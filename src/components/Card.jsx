import { cx } from '../utils/format'
import styles from './Card.module.css'

// Wadah permukaan reusable. `padding` & `hoverable` mengubah tampilan secara dinamis.
export default function Card({ as: Tag = 'div', padding = 'md', hoverable = false, className, children, ...rest }) {
  return (
    <Tag className={cx(styles.card, styles[`pad-${padding}`], hoverable && styles.hoverable, className)} {...rest}>
      {children}
    </Tag>
  )
}
