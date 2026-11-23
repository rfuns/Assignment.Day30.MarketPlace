import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import Alert from '../components/Alert'
import Badge from '../components/Badge'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import styles from './Users.module.css'

export default function Users() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setError('')
    api.getUsers(page, 6)
      .then((r) => active && setResult(r))
      .catch((e) => active && setError(e.message))
    return () => {
      active = false
    }
  }, [page])

  return (
    <>
      <PageHeader title="Daftar Pengguna" subtitle="Halaman terlindungi: hanya bisa diakses dengan token." />
      <Alert>{error}</Alert>
      {!result && !error && <Spinner />}
      {result && (
        <>
          <div className={styles.grid}>
            {result.data.map((u) => (
              <Card key={u.id} hoverable className={styles.user}>
                <Link to={`/users/${u.id}`} className={styles.link}>
                  <img src={u.avatar} alt="" className={styles.avatar} />
                  <div className={styles.text}>
                    <strong className={styles.name}>{u.first_name} {u.last_name}</strong>
                    <span className={styles.email}>{u.email}</span>
                    <Badge tone={u.role === 'seller' ? 'warning' : 'success'}>{u.role}</Badge>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
          <Pagination
            page={result.page}
            totalPages={result.total_pages}
            onChange={(p) => setParams({ page: String(p) })}
          />
        </>
      )}
    </>
  )
}
