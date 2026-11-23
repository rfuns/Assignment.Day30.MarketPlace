const BASE = '/api'
const TOKEN_KEY = 'marketplace_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = tokenStore.get()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Pastikan "npm run dev" berjalan.', 0)
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(data?.error || `Request gagal (${res.status})`, res.status)
  return data
}

export const api = {
  // Products
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request('/products/categories'),
  getProductsByCategory: (name) => request(`/products/category/${encodeURIComponent(name)}`),
  createProduct: (body) => request('/products', { method: 'POST', body, auth: true }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body, auth: true }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE', auth: true }),
  // Auth
  login: (body) => request('/auth/login', { method: 'POST', body }),
  register: (body) => request('/register', { method: 'POST', body }),
  // Users (protected)
  getUsers: (page = 1, perPage = 6) => request(`/users?page=${page}&per_page=${perPage}`, { auth: true }),
  getUser: (id) => request(`/users/${id}`, { auth: true }),
}
