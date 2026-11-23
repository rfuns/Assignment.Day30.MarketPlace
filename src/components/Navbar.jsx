import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Button from './Button'
import Container from './Container'
import { cx } from '../utils/format'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, isAuthenticated, isSeller, logout } = useAuth()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const close = () => setOpen(false)
  const linkClass = ({ isActive }) => cx(styles.link, isActive && styles.active)

  const handleLogout = () => {
    logout()
    close()
    navigate('/')
  }

  return (
    <header className={styles.header}>
      <Container className={styles.bar}>
        <Link to="/" className={styles.brand} onClick={close}>
          🛍️ Market<span>Place</span>
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-label="Buka menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>

        <nav className={cx(styles.menu, open && styles.open)}>
          <NavLink to="/" end className={linkClass} onClick={close}>Home</NavLink>
          <NavLink to="/cart" className={linkClass} onClick={close}>
            Keranjang{count > 0 && <span className={styles.count}>{count}</span>}
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/users" className={linkClass} onClick={close}>Pengguna</NavLink>
          )}
          {isSeller && (
            <NavLink to="/seller" className={linkClass} onClick={close}>Dashboard Seller</NavLink>
          )}

          <div className={styles.actions}>
            {isAuthenticated ? (
              <>
                <span className={styles.hello}>Hi, {user.first_name || user.username}</span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="secondary" size="sm" onClick={close}>Login</Button>
                <Button to="/register" size="sm" onClick={close}>Daftar</Button>
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}
