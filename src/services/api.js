import axios from 'axios'

const TOKEN_KEY = 'robo_ops_token'

export const tokenStorage = {
  get: () => window.localStorage.getItem(TOKEN_KEY),
  set: (token) => window.localStorage.setItem(TOKEN_KEY, token),
  clear: () => window.localStorage.removeItem(TOKEN_KEY),
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLoginRequest) onUnauthorized()
    return Promise.reject(error)
  },
)

export const unwrap = (res) => res.data.data

export function getErrorMessage(error) {
  if (!error?.response) return 'Không kết nối được máy chủ. Vui lòng thử lại; nếu lỗi tiếp diễn, hãy báo quản trị viên.'
  const { status, data } = error.response
  if (status === 422 && Array.isArray(data?.detail) && data.detail.length) {
    return data.detail.map((d) => d.msg).join('; ')
  }
  if (status === 403) return data?.message || (typeof data?.detail === 'string' ? data.detail : '') || 'Bạn không có quyền thực hiện thao tác này.'
  return data?.message || (typeof data?.detail === 'string' ? data.detail : '') || `Lỗi máy chủ (${status})`
}

export const assetUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `${import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000'}${path}`
}
