import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchMe, loginRequest } from '../services/authService'
import { getErrorMessage, setUnauthorizedHandler, tokenStorage } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(tokenStorage.get()))

  const logout = useCallback(() => {
    tokenStorage.clear()
    setCurrentUser(null)
  }, [])

  // Khôi phục phiên khi tải lại trang
  useEffect(() => {
    if (!tokenStorage.get()) return
    fetchMe()
      .then(setCurrentUser)
      .catch(logout)
      .finally(() => setLoading(false))
  }, [logout])

  useEffect(() => { setUnauthorizedHandler(logout) }, [logout])

  const login = async (username, password) => {
    try {
      const { access_token } = await loginRequest(username, password)
      tokenStorage.set(access_token)
      const user = await fetchMe()
      setCurrentUser(user)
      return { ok: true, user }
    } catch (error) {
      tokenStorage.clear()
      const status = error.response?.status
      const message = status === 401 ? 'Tên đăng nhập hoặc mật khẩu không chính xác.'
        : status === 403 ? 'Tài khoản đã bị khóa.'
        : getErrorMessage(error)
      return { ok: false, message }
    }
  }

  const value = useMemo(() => ({
    currentUser,
    role: currentUser?.role_name ?? null, 
    loading,
    login,
    logout,
  }), [currentUser, loading, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}