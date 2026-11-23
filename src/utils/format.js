export const cx = (...names) => names.filter(Boolean).join(' ')

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const formatPrice = (n) => usd.format(Number(n) || 0)

export const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1)
