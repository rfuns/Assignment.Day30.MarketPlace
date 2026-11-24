# MarketPlace (Sesuai dengan Assignment Day 30)

Aplikasi marketplace berbasis dengan database JSON lokal.
Data awal (produk & user) diambil dari [FakeStoreAPI](https://fakestoreapi.com/docs) dan disimpan ke database lokal `server/db.json`.

**Repository:** https://github.com/rfuns/Assignment.Day30.MarketPlace.git

## Menjalankan

```bash
npm install
npm run seed   # opsional: membuat ulang server/db.json dari FakeStoreAPI (db.json sudah disertakan)
npm run dev    # API di http://localhost:4000, web di http://localhost:5173
```

Akun demo (dari data seed):

| Peran   | Username    | Password     |
| ------- | ----------- | ------------ |
| Seller  | `johnd`     | `m38rmF$`    |
| Pembeli | `kevinryan` | `kev02937@`  |

Seller pertama kali bisa juga dibuat lewat halaman **Daftar** (pilih "Seller").

## Fitur utama

- Daftar produk, detail produk, filter kategori, pencarian, dan pengurutan.
- Login & register, token JWT disimpan di `localStorage` dan dikirim sebagai `Authorization: Bearer <token>`.
- **Protected routes**: `/users` dan `/users/:id` (wajib login), `/seller` (wajib login sebagai seller). Akses tanpa login dialihkan ke `/login` lalu kembali ke halaman tujuan setelah berhasil login.
- Dashboard seller: tambah, ubah, dan hapus produk (POST/PUT/DELETE tersimpan ke database).

## Database & Endpoint

Database: `server/db.json` (dibuat oleh `server/seed.js`). Semua endpoint berada di bawah `/api`.

### Endpoint FakeStoreAPI

| Method | Path | Keterangan | Auth |
| ------ | ---- | ---------- | ---- |
| GET | `/products` | Daftar produk | - |
| GET | `/products/:id` | Detail produk | - |
| GET | `/products/categories` | Daftar kategori | - |
| GET | `/products/category/:name` | Produk per kategori | - |
| POST | `/products` | Tambah produk | Seller |
| PUT | `/products/:id` | Ubah produk | Seller |
| DELETE | `/products/:id` | Hapus produk | Seller |
| GET | `/users` | Daftar user/pembeli | Token |
| POST | `/auth/login` | Login, mengembalikan token | - |

### Endpoint Register / Login / Users

| Skenario | Request | Respons |
| -------- | ------- | ------- |
| REGISTER - SUCCESSFUL | `POST /register` `{ "email", "password" }` | `201` `{ id, token, user }` |
| REGISTER - UNSUCCESSFUL | `POST /register` tanpa `password` (atau email/username sudah dipakai) | `400` `{ "error": "Missing password" }` |
| LOGIN - SUCCESSFUL | `POST /login` `{ "username" atau "email", "password" }` | `200` `{ token, user }` |
| LOGIN - UNSUCCESSFUL | `POST /login` password salah / user tidak ada / tanpa password | `400` `{ "error": "..." }` |
| LIST USERS (token) | `GET /users?page=1&per_page=6` | `200` `{ page, per_page, total, total_pages, data: [...] }`, tanpa token `401` |
| SINGLE USER (token) | `GET /users/:id` | `200` `{ data: {...} }`, tidak ada `404`, tanpa token `401` |

Catatan: `POST /auth/login` dan `POST /login` memakai handler yang sama, begitu juga `/register` dan `/auth/register`.

## Struktur

```
server/            Express API, auth (JWT), seed, db.json
src/api/           client fetch + penyimpanan token
src/context/       AuthContext, CartContext
src/components/    Button, Card, Badge, Alert, Field, Navbar, ProductCard, Pagination, ProtectedRoute, ...
src/pages/         Home, ProductDetail, Login, Register, Cart, Users, UserDetail, Seller, NotFound
```

## Pendekatan styling

- **CSS Modules per komponen** (`Button.module.css`, `Card.module.css`, dst.). `index.css` hanya berisi design token (warna, radius, font, spacing) dan reset.
- **Dynamic styling lewat props/state**: `Button` (`variant`, `size`, `fullWidth`, `loading`), `Card` (`padding`, `hoverable`), `Badge` (`tone`), `Alert` (`type`), chip kategori aktif, tombol halaman aktif, menu mobile terbuka (`open`).
- **Reusable component**: Button, Card, Container, Badge, Alert, Spinner, Field, Pagination, PageHeader, ProductCard, Navbar.
- Tidak ada HTML statis di luar komponen React; semua halaman disusun dari komponen.
- Layout memakai `Container` (max-width + padding), CSS grid/flex, `min-width: 0` dan `overflow-wrap` untuk mencegah overflow, serta breakpoint 820px, 600px, dan 380px.

## Library yang digunakan

| Library | Fungsi |
| ------- | ------ |
| [react](https://react.dev/) & react-dom | Frontend framework |
| [react-router-dom](https://reactrouter.com/) | Routing, protected routes, query string |
| [vite](https://vite.dev/) & @vitejs/plugin-react | Dev server & bundler (proxy `/api` ke Express) |
| [express](https://expressjs.com/) | Server API mock |
| [cors](https://github.com/expressjs/cors) | CORS untuk API |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | Pembuatan & verifikasi token |
| [concurrently](https://github.com/open-cli-tools/concurrently) | Menjalankan API dan web dengan satu perintah |
| [oxlint](https://oxc.rs/docs/guide/usage/linter) | Linter |

Hash password memakai `crypto.scrypt` bawaan Node.js.

## Fitur tambahan di luar requirement

- Keranjang belanja (tersimpan di `localStorage`) dengan ubah jumlah, hapus, dan checkout simulasi.
- Pencarian produk, pengurutan (harga/rating), dan filter kategori yang tersimpan di URL.
- Role seller/pembeli dengan pembatasan akses di backend (403) maupun frontend.
- Halaman daftar pengguna dengan pagination dan halaman detail pengguna.
- Auto logout jika token tidak valid/kedaluwarsa.
- Password di-hash (scrypt), token JWT berlaku 12 jam.
- Perubahan produk dari dashboard seller benar-benar tersimpan di database (berbeda dengan FakeStoreAPI asli yang hanya simulasi).
- Halaman 404, loading spinner, dan pesan error di setiap proses.
