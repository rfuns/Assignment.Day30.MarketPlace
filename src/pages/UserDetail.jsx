import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import Alert from '../components/Alert'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import styles from './UserDetail.module.css'

export default function UserDetail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setUser(null)
    setError('')
    api.getUser(id)
      .then((r) => active && setUser(r.data))
      .catch((e) => active && setError(e.message))
    return () => {
      active = false
    }
  }, [id])

  if (error) {
    return (
      <div className={styles.stack}>
        <Alert>{error}</Alert>
        <Button to="/users" variant="secondary">← Kembali</Button>
      </div>
    )
  }
  if (!user) return <Spinner />

  const rows = [
    ['Username', user.username],
    ['Email', user.email],
    ['Telepon', user.phone || '-'],
  ]

  return (
    <div className={styles.stack}>
      <Link to="/users" className={styles.back}>← Semua pengguna</Link>
      <Card padding="lg" className={styles.card}>
        <img src={user.avatar} alt="" className={styles.avatar} />
        <h1 className={styles.name}>{user.first_name} {user.last_name}</h1>
        <Badge tone={user.role === 'seller' ? 'warning' : 'success'}>{user.role}</Badge>
        <dl className={styles.list}>
          {rows.map(([k, v]) => (
            <div key={k} className={styles.row}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  )
}
