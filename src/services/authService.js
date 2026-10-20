import { api, unwrap } from './api'

export async function loginRequest(username, password) {
  const body = new URLSearchParams({ username, password })
  const res = await api.post('/auth/login', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data 
}

export const fetchMe = () => api.get('/auth/me').then(unwrap)