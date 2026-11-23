import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'marketplace_cart'

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(read) // [{ product, qty }]

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items])

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id)
      return found
        ? prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { product, qty }]
    })
  }, [])

  const setQty = useCallback((id, qty) => {
    setItems((prev) =>
      qty < 1 ? prev.filter((i) => i.product.id !== id) : prev.map((i) => (i.product.id === id ? { ...i, qty } : i)),
    )
  }, [])

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.product.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.product.price, 0),
    }),
    [items, add, setQty, remove, clear],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
