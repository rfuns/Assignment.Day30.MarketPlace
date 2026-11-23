import Button from '../components/Button'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.code}>404</h1>
      <p>Halaman tidak ditemukan.</p>
      <Button to="/">Kembali ke Home</Button>
    </div>
  )
}
