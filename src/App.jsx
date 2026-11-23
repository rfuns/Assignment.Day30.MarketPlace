import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Cart from './pages/Cart'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import Register from './pages/Register'
import Seller from './pages/Seller'
import UserDetail from './pages/UserDetail'
import Users from './pages/Users'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Publik */}
        <Route index element={<Home />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Wajib login (token) */}
        <Route element={<ProtectedRoute />}>
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
        </Route>

        {/* Wajib login sebagai seller */}
        <Route element={<ProtectedRoute role="seller" />}>
          <Route path="seller" element={<Seller />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
