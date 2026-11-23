import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import Alert from '../components/Alert'
import Field from '../components/Field'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import Button from '../components/Button'
import { capitalize, cx } from '../utils/format'
import styles from './Home.module.css'

const PER_PAGE = 8

export default function Home() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const category = params.get('category') || ''
  const query = params.get('q') || ''
  const sort = params.get('sort') || ''
  const page = Math.max(1, Number(params.get('page')) || 1)

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    const request = category ? api.getProductsByCategory(category) : api.getProducts()
    request
      .then((data) => active && setProducts(data))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [category])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = q ? products.filter((p) => p.title.toLowerCase().includes(q)) : products
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
    return list
  }, [products, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  // Ubah satu/lebih parameter URL; reset ke halaman 1 kecuali yang diubah adalah `page`.
  const update = (changes) => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    if (!('page' in changes)) next.delete('page')
    setParams(next)
  }

  const goToPage = (p) => {
    update({ page: p > 1 ? String(p) : '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Alert type="info">{location.state?.denied}</Alert>
      <PageHeader
        title="Semua Produk"
        subtitle={loading ? 'Memuat...' : `${filtered.length} produk ditemukan`}
      />

      <div className={styles.toolbar}>
        <Field
          type="search"
          placeholder="Cari produk..."
          aria-label="Cari produk"
          value={query}
          onChange={(e) => update({ q: e.target.value })}
          className={styles.search}
        />
        <Field
          as="select"
          aria-label="Urutkan"
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
          className={styles.sort}
        >
          <option value="">Urutkan: Default</option>
          <option value="price-asc">Harga: Termurah</option>
          <option value="price-desc">Harga: Termahal</option>
          <option value="rating">Rating tertinggi</option>
        </Field>
      </div>

      <div className={styles.chips} role="group" aria-label="Kategori">
        <button type="button" className={cx(styles.chip, !category && styles.chipActive)} onClick={() => update({ category: '' })}>
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={cx(styles.chip, category === c && styles.chipActive)}
            onClick={() => update({ category: c })}
          >
            {capitalize(c)}
          </button>
        ))}
      </div>

      <Alert>{error}</Alert>
      {loading ? (
        <Spinner />
      ) : visible.length === 0 && !error ? (
        <div className={styles.empty}>
          <p>Tidak ada produk yang cocok.</p>
          <Button variant="secondary" onClick={() => setParams({})}>Reset filter</Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {!loading && <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />}
    </>
  )
}
