import express from 'express'
import cors from 'cors'
import { load, save, nextId } from './db.js'
import { hashPassword, verifyPassword, signToken, requireAuth, requireSeller } from './auth.js'

const app = express()
const PORT = process.env.PORT || 4000
const api = express.Router()

app.use(cors())
app.use(express.json())

const publicUser = ({ password: _password, ...rest }) => rest
const clean = (v) => (typeof v === 'string' ? v.trim() : v)

/* ---------------------------- PRODUCTS ---------------------------- */

api.get('/products', (req, res) => {
  let { products } = load()
  if (req.query.sort === 'desc') products = [...products].sort((a, b) => b.id - a.id)
  const limit = Number(req.query.limit)
  if (limit > 0) products = products.slice(0, limit)
  res.json(products)
})

api.get('/products/categories', (_req, res) => {
  const { products } = load()
  res.json([...new Set(products.map((p) => p.category))])
})

api.get('/products/category/:name', (req, res) => {
  const { products } = load()
  res.json(products.filter((p) => p.category.toLowerCase() === req.params.name.toLowerCase()))
})

api.get('/products/:id', (req, res) => {
  const product = load().products.find((p) => p.id === Number(req.params.id))
  if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' })
  res.json(product)
})

function validateProduct(body, partial = false) {
  const errors = []
  const { title, price, description, category, image } = body
  const has = (v) => v !== undefined
  if ((!partial || has(title)) && !clean(title)) errors.push('title wajib diisi')
  if ((!partial || has(price)) && !(Number(price) > 0)) errors.push('price harus lebih dari 0')
  if ((!partial || has(category)) && !clean(category)) errors.push('category wajib diisi')
  if ((!partial || has(description)) && !clean(description)) errors.push('description wajib diisi')
  if ((!partial || has(image)) && !clean(image)) errors.push('image (URL) wajib diisi')
  return errors
}

api.post('/products', requireAuth, requireSeller, (req, res) => {
  const errors = validateProduct(req.body)
  if (errors.length) return res.status(400).json({ error: errors.join(', ') })
  const db = load()
  const { title, price, description, category, image } = req.body
  const product = {
    id: nextId(db.products),
    title: clean(title),
    price: Number(price),
    description: clean(description),
    category: clean(category),
    image: clean(image),
    rating: { rate: 0, count: 0 },
    sellerId: Number(req.auth.sub),
  }
  db.products.push(product)
  save(db)
  res.status(201).json(product)
})

api.put('/products/:id', requireAuth, requireSeller, (req, res) => {
  const errors = validateProduct(req.body, true)
  if (errors.length) return res.status(400).json({ error: errors.join(', ') })
  const db = load()
  const index = db.products.findIndex((p) => p.id === Number(req.params.id))
  if (index < 0) return res.status(404).json({ error: 'Produk tidak ditemukan' })
  const { title, price, description, category, image } = req.body
  const patch = { title, price: price === undefined ? undefined : Number(price), description, category, image }
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) db.products[index][key] = clean(value)
  }
  save(db)
  res.json(db.products[index])
})

api.delete('/products/:id', requireAuth, requireSeller, (req, res) => {
  const db = load()
  const index = db.products.findIndex((p) => p.id === Number(req.params.id))
  if (index < 0) return res.status(404).json({ error: 'Produk tidak ditemukan' })
  const [removed] = db.products.splice(index, 1)
  save(db)
  res.json(removed)
})

/* ------------------------------ AUTH ------------------------------ */

// LOGIN - SUCCESSFUL / UNSUCCESSFUL (email atau username + password)
function login(req, res) {
  const identity = clean(req.body.email ?? req.body.username)
  const { password } = req.body
  if (!identity) return res.status(400).json({ error: 'Missing email or username' })
  if (!password) return res.status(400).json({ error: 'Missing password' })
  const user = load().users.find((u) => u.email === identity || u.username === identity)
  if (!user || !verifyPassword(password, user.password)) {
    return res.status(400).json({ error: 'user not found or wrong password' })
  }
  res.json({ token: signToken(user), user: publicUser(user) })
}
api.post('/auth/login', login)
api.post('/login', login)

// REGISTER - SUCCESSFUL / UNSUCCESSFUL
function register(req, res) {
  const email = clean(req.body.email)
  const { password } = req.body
  if (!email) return res.status(400).json({ error: 'Missing email or username' })
  if (!password) return res.status(400).json({ error: 'Missing password' })
  if (String(password).length < 4) {
    return res.status(400).json({ error: 'Password minimal 4 karakter' })
  }
  const db = load()
  const username = clean(req.body.username) || email.split('@')[0]
  if (db.users.some((u) => u.email === email || u.username === username)) {
    return res.status(400).json({ error: 'Email atau username sudah terdaftar' })
  }
  const user = {
    id: nextId(db.users),
    email,
    username,
    password: hashPassword(password),
    first_name: clean(req.body.first_name) || '',
    last_name: clean(req.body.last_name) || '',
    phone: '',
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
    role: req.body.role === 'seller' ? 'seller' : 'buyer',
  }
  db.users.push(user)
  save(db)
  res.status(201).json({ id: user.id, token: signToken(user), user: publicUser(user) })
}
api.post('/register', register)
api.post('/auth/register', register)

/* ------------------------------ USERS ----------------------------- */

// LIST USERS (protected). Mendukung ?page=1&per_page=6
api.get('/users', requireAuth, (req, res) => {
  const { users } = load()
  const per_page = Math.max(1, Number(req.query.per_page) || 6)
  const total = users.length
  const total_pages = Math.max(1, Math.ceil(total / per_page))
  const page = Math.min(Math.max(1, Number(req.query.page) || 1), total_pages)
  const data = users.slice((page - 1) * per_page, page * per_page).map(publicUser)
  res.json({ page, per_page, total, total_pages, data })
})

// SINGLE USER (protected)
api.get('/users/:id', requireAuth, (req, res) => {
  const user = load().users.find((u) => u.id === Number(req.params.id))
  if (!user) return res.status(404).json({ error: 'User tidak ditemukan' })
  res.json({ data: publicUser(user) })
})

app.use('/api', api)
app.use((_req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan' }))
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Terjadi kesalahan pada server' })
})

app.listen(PORT, () => console.log(`API berjalan di http://localhost:${PORT}/api`))
