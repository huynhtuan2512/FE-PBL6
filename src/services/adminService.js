import { api, unwrap } from './api'

// ----- Users -----
export const getRoles = () => api.get('/admin/roles').then(unwrap)
export const getUsers = (params) => api.get('/admin/users', { params }).then(unwrap) // { items, page, page_size, total }
export const createUser = (payload) => api.post('/admin/users', payload).then(unwrap)
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload).then(unwrap)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(unwrap)

export const getAuditLogs = (limit = 100) => api.get('/admin/audit-logs', { params: { limit } }).then(unwrap)
export const swapOrderTable = (order_id, new_table_id) => api.post('/admin/swap-table', { order_id, new_table_id }).then(unwrap)
