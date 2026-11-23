import { cx } from '../utils/format'
import styles from './Alert.module.css'

export default function Alert({ type = 'error', children }) {
  if (!children) return null
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={cx(styles.alert, styles[type])}>
      {children}
    </div>
  )
}
