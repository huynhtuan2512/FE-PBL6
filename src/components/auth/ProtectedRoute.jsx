import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, role, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div style={{ padding: 40 }}>Đang xác thực...</div>
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/staff" replace />
  return children
}
