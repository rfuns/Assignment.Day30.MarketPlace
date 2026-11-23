import styles from './Spinner.module.css'

export default function Spinner({ label = 'Memuat...' }) {
  return (
    <div className={styles.wrap} role="status">
      <span className={styles.ring} />
      <span>{label}</span>
    </div>
  )
}
