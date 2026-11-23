import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Container from './Container'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>
        <Container>
          <Outlet />
        </Container>
      </main>
      <footer className={styles.footer}>
        <Container>MarketPlace · Assignment Day 30 · Data dari FakeStoreAPI</Container>
      </footer>
    </div>
  )
}
