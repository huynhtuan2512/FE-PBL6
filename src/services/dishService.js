import { api, unwrap } from './api'

export const getCategories = () => api.get('/categories').then(unwrap)
export const createCategory = (payload) => api.post('/categories', payload).then(unwrap)
export const updateCategory = (id, payload) => api.put(`/categories/${encodeURIComponent(id)}`, payload).then(unwrap)
export const deleteCategory = (id) => api.delete(`/categories/${encodeURIComponent(id)}`).then(unwrap)
export const getDishes = () => api.get('/dishes').then(unwrap)
export const getAdminDishes = () => api.get('/admin/dishes').then(unwrap)
export const createDish = (payload) => api.post('/dishes', payload).then(unwrap)
export const updateDish = (id, payload) => api.put(`/dishes/${id}`, payload).then(unwrap)
export const setDishStatus = (id, is_available) =>
  api.patch(`/dishes/${id}/status`, { is_available }).then(unwrap)