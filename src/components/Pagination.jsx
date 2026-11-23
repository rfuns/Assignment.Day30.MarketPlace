import Button from './Button'
import { cx } from '../utils/format'
import styles from './Pagination.module.css'

// Menampilkan nomor halaman dengan elipsis: 1 … 4 5 6 … 10
function pageList(page, total) {
  const pages = new Set([1, total, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push(`gap-${p}`)
    out.push(p)
  })
  return out
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className={styles.nav} aria-label="Pagination">
      <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => onChange(page - 1)}>
        ‹ Prev
      </Button>
      <ul className={styles.list}>
        {pageList(page, totalPages).map((p) =>
          typeof p === 'string' ? (
            <li key={p} className={styles.gap}>…</li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={cx(styles.page, p === page && styles.active)}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => onChange(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>
      <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Next ›
      </Button>
    </nav>
  )
}
