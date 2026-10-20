import { api, unwrap } from './api'

export const getOrders = (params = {}) =>
  api.get('/orders', { params: typeof params === 'string' ? { status: params } : params }).then(unwrap)
export const getOrder = (id) => api.get(`/orders/${id}`).then(unwrap)
export const createOrder = (payload) => api.post('/orders', payload).then(unwrap)
export const createInvoice = (payload) => api.post('/invoices', payload).then(unwrap)
export const updateOrderStatus = (id, order_status) =>
  api.patch(`/staff/orders/${id}/status`, { order_status }).then(unwrap)
export const updateOrderDetailServed = (detail_id, served_status) =>
  api.patch(`/staff/orders/details/${encodeURIComponent(detail_id)}/served`, { served_status }).then(unwrap)