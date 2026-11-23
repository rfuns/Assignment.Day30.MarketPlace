import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Halaman hanya untuk user login. `role="seller"` membatasi ke seller saja.
export default function ProtectedRoute({ role }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace state={{ denied: `Halaman ini hanya untuk ${role}.` }} />
  }
  return <Outlet />
}
