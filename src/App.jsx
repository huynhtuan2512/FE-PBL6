import { useCallback, useEffect, useRef, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Sidebar from './components/common/Sidebar'
import Topbar from './components/common/Topbar'
import Dashboard from './pages/Dashboard'
import StaffWorkspace from './pages/StaffWorkspace'
import AdminWorkspace from './pages/AdminWorkspace'
import Login from './pages/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'

export default function App() {
  const [toast, setToast] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)
  const toastTimeout = useRef(null)
  const menuButtonRef = useRef(null)
  const location = useLocation()
  const { currentUser, role, loading } = useAuth()
  const openMenu = useCallback(() => setMobileNav(true), [])
  const closeMenu = useCallback(() => {
    setMobileNav(false)
    menuButtonRef.current?.focus()
  }, [])

  const notify = useCallback((message, tone = 'success') => {
    window.clearTimeout(toastTimeout.current)
    setToast({ message, tone })
    toastTimeout.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimeout.current), [])

  useEffect(() => {
    if (!mobileNav) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [closeMenu, mobileNav])

  if (loading) return <div className="state-message">Đang xác thực phiên đăng nhập...</div>

  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to={role === 'ADMIN' ? '/admin' : '/staff'} replace /> : <Login />} />
        <Route
          path="*"
          element={(
            <ProtectedRoute>
              <div className="app-shell">
                <Sidebar mobileNav={mobileNav} onClose={closeMenu} />
                {mobileNav && (
                  <button
                    className="sidebar-backdrop"
                    type="button"
                    aria-label="Đóng menu"
                    onClick={closeMenu}
                  />
                )}
                <main className="main-shell">
                  <Topbar
                    onMenu={openMenu}
                    mobileNav={mobileNav}
                    menuButtonRef={menuButtonRef}
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      className="page-shell"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24 }}
                    >
                      <Routes>
                        <Route path="/" element={<Navigate to={role === 'ADMIN' ? '/admin' : '/staff'} replace />} />
                        <Route path="/staff" element={<StaffWorkspace onNotify={notify} />} />
                        <Route path="/dashboard" element={<Dashboard onNotify={notify} />} />
                        <Route
                          path="/admin"
                          element={(
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                              <AdminWorkspace onNotify={notify} />
                            </ProtectedRoute>
                          )}
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </motion.div>
                  </AnimatePresence>
                </main>
                <AnimatePresence>
                  {toast && (
                    <motion.div
                      className={`toast toast-${toast.tone}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 18 }}
                      role="status"
                    >
                      {toast.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ProtectedRoute>
          )}
        />
      </Routes>
    </MotionConfig>
  )
}
