import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import Alert from '../components/Alert'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { add } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true
    setProduct(null)
    setError('')
    api.getProduct(id)
      .then((p) => active && setProduct(p))
      .catch((e) => active && setError(e.message))
    return () => {
      active = false
    }
  }, [id])

  if (error) {
    return (
      <div className={styles.stack}>
        <Alert>{error}</Alert>
        <Button to="/" variant="secondary">← Kembali ke Home</Button>
      </div>
    )
  }
  if (!product) return <Spinner />

  const handleAdd = () => {
    add(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className={styles.stack}>
      <Link to="/" className={styles.back}>← Kembali</Link>
      <Card padding="lg" className={styles.detail}>
        <div className={styles.imageWrap}>
          <img src={product.image} alt={product.title} className={styles.image} />
        </div>
        <div className={styles.info}>
          <Badge tone="primary">{product.category}</Badge>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.rating}>
            ★ {(product.rating?.rate ?? 0).toFixed(1)} <span>({product.rating?.count ?? 0} ulasan)</span>
          </p>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.buy}>
            <div className={styles.qty}>
              <Button variant="secondary" size="sm" aria-label="Kurangi" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</Button>
              <span aria-live="polite">{qty}</span>
              <Button variant="secondary" size="sm" aria-label="Tambah" onClick={() => setQty((q) => q + 1)}>+</Button>
            </div>
            <Button size="lg" onClick={handleAdd}>Tambah ke Keranjang</Button>
          </div>
          <Alert type="success">{added && 'Ditambahkan ke keranjang.'}</Alert>
        </div>
      </Card>
    </div>
  )
}
