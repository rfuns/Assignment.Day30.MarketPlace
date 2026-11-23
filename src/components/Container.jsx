import { cx } from '../utils/format'
import styles from './Container.module.css'

export default function Container({ narrow = false, className, children }) {
  return <div className={cx(styles.container, narrow && styles.narrow, className)}>{children}</div>
}
