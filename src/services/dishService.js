import { api, unwrap } from './api'

export const getDishes = () => api.get('/dishes').then(unwrap)
export const createDish = (payload) => api.post('/dishes', payload).then(unwrap)
export const updateDish = (id, payload) => api.put(`/dishes/${id}`, payload).then(unwrap)
export const uploadDishImage = (id, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post(`/admin/dishes/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(unwrap)
}
export const setDishStatus = (id, is_available) =>
  api.patch(`/dishes/${id}/status`, { is_available }).then(unwrap)