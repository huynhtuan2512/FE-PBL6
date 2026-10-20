import { api, unwrap } from './api'

export const getOrders = (status) =>
  api.get('/orders', { params: status ? { status } : {} }).then(unwrap)
export const getOrder = (id) => api.get(`/orders/${id}`).then(unwrap)
export const createOrder = (payload) => api.post('/orders', payload).then(unwrap)
export const updateOrderStatus = (id, order_status) =>
  api.patch(`/staff/orders/${id}/status`, { order_status }).then(unwrap)
export const dispatchOrder = (id, robot_id) =>
  api.post(`/staff/orders/${id}/dispatch`, { robot_id }).then(unwrap)