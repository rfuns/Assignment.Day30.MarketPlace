import { useState } from 'react'
import Alert from './Alert'
import Button from './Button'
import Field from './Field'
import styles from './ProductForm.module.css'

const EMPTY = { title: '', price: '', category: '', image: '', description: '' }

// Form tambah/edit produk. `initial` terisi saat edit.
export default function ProductForm({ initial, categories = [], onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({ ...form, price: Number(form.price) })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <Alert>{error}</Alert>
      <Field label="Nama produk" value={form.title} onChange={set('title')} />
      <div className={styles.row}>
        <Field label="Harga (USD)" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} />
        <Field label="Kategori" list="category-options" value={form.category} onChange={set('category')} />
        <datalist id="category-options">
          {categories.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>
      <Field label="URL gambar" type="url" placeholder="https://..." value={form.image} onChange={set('image')} />
      <Field label="Deskripsi" as="textarea" value={form.description} onChange={set('description')} />
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={loading}>{initial ? 'Simpan perubahan' : 'Tambah produk'}</Button>
      </div>
    </form>
  )
}
