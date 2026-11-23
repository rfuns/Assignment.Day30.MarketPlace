import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import Alert from '../components/Alert'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import ProductForm from '../components/ProductForm'
import Spinner from '../components/Spinner'
import { formatPrice } from '../utils/format'
import styles from './Seller.module.css'

export default function Seller() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | product

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([api.getProducts(), api.getCategories()])
      setProducts([...p].sort((a, b) => b.id - a.id))
      setCategories(c)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const save = async (data) => {
    if (editing === 'new') await api.createProduct(data)
    else await api.updateProduct(editing.id, data)
    setNotice(editing === 'new' ? 'Produk ditambahkan.' : 'Produk diperbarui.')
    setEditing(null)
    await load()
  }

  const remove = async (p) => {
    if (!window.confirm(`Hapus "${p.title}"?`)) return
    try {
      await api.deleteProduct(p.id)
      setNotice('Produk dihapus.')
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <PageHeader title="Dashboard Seller" subtitle="Kelola produk: tambah, ubah, dan hapus.">
        {!editing && <Button onClick={() => { setNotice(''); setEditing('new') }}>+ Produk baru</Button>}
      </PageHeader>
      <Alert>{error}</Alert>
      <Alert type="success">{notice}</Alert>

      {editing && (
        <Card padding="lg" className={styles.formCard}>
          <h2 className={styles.formTitle}>{editing === 'new' ? 'Produk baru' : 'Edit produk'}</h2>
          <ProductForm
            initial={editing === 'new' ? null : editing}
            categories={categories}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </Card>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <div className={styles.list}>
          {products.map((p) => (
            <Card key={p.id} padding="sm" className={styles.row}>
              <img src={p.image} alt="" className={styles.img} />
              <div className={styles.info}>
                <strong className={styles.title}>{p.title}</strong>
                <div className={styles.meta}>
                  <Badge tone="primary">{p.category}</Badge>
                  <span className={styles.price}>{formatPrice(p.price)}</span>
                </div>
              </div>
              <div className={styles.actions}>
                <Button size="sm" variant="secondary" onClick={() => { setNotice(''); setEditing(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => remove(p)}>Hapus</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
