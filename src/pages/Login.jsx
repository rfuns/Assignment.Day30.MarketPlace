import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Card from '../components/Card'
import Container from '../components/Container'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [form, setForm] = useState({ identity: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to={from} replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ username: form.identity, password: form.password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container narrow className={styles.wrap}>
      <Card padding="lg">
        <form className={styles.form} onSubmit={submit} noValidate>
          <h1 className={styles.title}>Masuk</h1>
          {location.state?.from && <Alert type="info">Silakan login untuk membuka halaman tersebut.</Alert>}
          <Alert>{error}</Alert>
          <Field label="Username atau Email" autoComplete="username" value={form.identity} onChange={set('identity')} />
          <Field label="Password" type="password" autoComplete="current-password" value={form.password} onChange={set('password')} />
          <Button type="submit" size="lg" fullWidth loading={loading}>Login</Button>
          <p className={styles.hint}>
            Akun demo seller: <code>johnd</code> / <code>m38rmF$</code>
            <br />
            Akun demo pembeli: <code>kevinryan</code> / <code>kev02937@</code>
          </p>
          <p className={styles.alt}>Belum punya akun? <Link to="/register">Daftar</Link></p>
        </form>
      </Card>
    </Container>
  )
}
