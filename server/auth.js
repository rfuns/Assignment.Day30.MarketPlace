import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'marketplace-dev-secret'

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(String(password), salt, 32).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':')
  if (!salt || !hash) return false
  const test = crypto.scryptSync(String(password), salt, 32)
  const expected = Buffer.from(hash, 'hex')
  return expected.length === test.length && crypto.timingSafeEqual(test, expected)
}

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '12h' })

// Middleware: wajib token. Format header: Authorization: Bearer <token>
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Token tidak ditemukan' })
  try {
    req.auth = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token tidak valid atau kedaluwarsa' })
  }
}

export function requireSeller(req, res, next) {
  if (req.auth?.role !== 'seller') {
    return res.status(403).json({ error: 'Hanya seller yang boleh melakukan aksi ini' })
  }
  next()
}
