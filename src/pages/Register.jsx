import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Card from '../components/Card'
import Container from '../components/Container'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', role: 'buyer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/', { replace: true })
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
          <h1 className={styles.title}>Buat Akun</h1>
          <Alert>{error}</Alert>
          <div className={styles.row}>
            <Field label="Nama depan" value={form.first_name} onChange={set('first_name')} />
            <Field label="Nama belakang" value={form.last_name} onChange={set('last_name')} />
          </div>
          <Field label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} />
          <Field label="Password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} />
          <Field label="Daftar sebagai" as="select" value={form.role} onChange={set('role')}>
            <option value="buyer">Pembeli</option>
            <option value="seller">Seller</option>
          </Field>
          <Button type="submit" size="lg" fullWidth loading={loading}>Daftar</Button>
          <p className={styles.alt}>Sudah punya akun? <Link to="/login">Login</Link></p>
        </form>
      </Card>
    </Container>
  )
}
