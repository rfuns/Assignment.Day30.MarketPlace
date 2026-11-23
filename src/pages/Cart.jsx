import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart()

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h1>Keranjang kosong</h1>
        <Button to="/">Mulai belanja</Button>
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Keranjang" subtitle={`${items.length} jenis produk`}>
        <Button variant="ghost" size="sm" onClick={clear}>Kosongkan</Button>
      </PageHeader>
      <div className={styles.layout}>
        <div className={styles.list}>
          {items.map(({ product, qty }) => (
            <Card key={product.id} padding="sm" className={styles.item}>
              <img src={product.image} alt="" className={styles.img} />
              <div className={styles.info}>
                <Link to={`/products/${product.id}`} className={styles.name}>{product.title}</Link>
                <span className={styles.unit}>{formatPrice(product.price)}</span>
                <div className={styles.qty}>
                  <Button variant="secondary" size="sm" aria-label="Kurangi" onClick={() => setQty(product.id, qty - 1)}>−</Button>
                  <span>{qty}</span>
                  <Button variant="secondary" size="sm" aria-label="Tambah" onClick={() => setQty(product.id, qty + 1)}>+</Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(product.id)}>Hapus</Button>
                </div>
              </div>
              <strong className={styles.sub}>{formatPrice(product.price * qty)}</strong>
            </Card>
          ))}
        </div>
        <Card className={styles.summary}>
          <h2>Ringkasan</h2>
          <div className={styles.total}><span>Total</span><strong>{formatPrice(total)}</strong></div>
          <Button fullWidth size="lg" onClick={() => { alert('Checkout simulasi berhasil. Terima kasih!'); clear() }}>
            Checkout
          </Button>
        </Card>
      </div>
    </>
  )
}
