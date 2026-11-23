// Membuat database lokal (server/db.json) dari data FakeStoreAPI.
// Jalankan: npm run seed
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashPassword } from './auth.js'

const BASE = 'https://fakestoreapi.com'
const here = dirname(fileURLToPath(import.meta.url))

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Gagal mengambil ${path}: ${res.status}`)
  return res.json()
}

const [products, users] = await Promise.all([get('/products'), get('/users')])

const db = {
  products,
  users: users.map((u, i) => ({
    id: u.id,
    email: u.email,
    username: u.username,
    password: hashPassword(u.password),
    first_name: u.name?.firstname ?? '',
    last_name: u.name?.lastname ?? '',
    phone: u.phone ?? '',
    avatar: `https://i.pravatar.cc/150?img=${u.id + 10}`,
    // dua user pertama menjadi seller, sisanya pembeli
    role: i < 2 ? 'seller' : 'buyer',
  })),
}

await mkdir(here, { recursive: true })
await writeFile(join(here, 'db.json'), JSON.stringify(db, null, 2))
console.log(`db.json dibuat: ${db.products.length} produk, ${db.users.length} user`)
