import { api, unwrap } from './api'

// ----- Users -----
export const getUsers = (params) => api.get('/admin/users', { params }).then(unwrap) // { items, page, page_size, total }
export const createUser = (payload) => api.post('/admin/users', payload).then(unwrap)
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload).then(unwrap)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(unwrap)

// ----- Node / QR -----
export const getNodes = () => api.get('/admin/nodes').then(unwrap)

// ----- Bàn -----
export const swapRoutingTables = (table_a_id, table_b_id) => api.post('/admin/routings/swap-tables', { table_a_id, table_b_id }).then(unwrap)
export const swapOrderTable = (order_id, new_table_id) => api.post('/admin/swap-table', { order_id, new_table_id }).then(unwrap)
