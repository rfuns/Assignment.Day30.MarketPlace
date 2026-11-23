import { cx } from '../utils/format'
import styles from './Badge.module.css'

export default function Badge({ tone = 'neutral', children }) {
  return <span className={cx(styles.badge, styles[tone])}>{children}</span>
}
