import { Link } from 'react-router-dom'
import Card from './Card'
import Badge from './Badge'
import Button from './Button'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const rate = product.rating?.rate ?? 0
  return (
    <Card padding="none" hoverable className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageWrap}>
          <img src={product.image} alt={product.title} loading="lazy" className={styles.image} />
        </div>
        <div className={styles.body}>
          <Badge tone="primary">{product.category}</Badge>
          <h3 className={styles.title}>{product.title}</h3>
          <div className={styles.meta}>
            <strong className={styles.price}>{formatPrice(product.price)}</strong>
            <span className={styles.rating} style={{ '--fill': `${(rate / 5) * 100}%` }} title={`${rate} / 5`}>
              ★ {rate.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
      <div className={styles.footer}>
        <Button fullWidth size="sm" onClick={() => add(product)}>+ Keranjang</Button>
      </div>
    </Card>
  )
}
