const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const body = await response.json()

  if (!response.ok) {
    const detail = Array.isArray(body.detail)
      ? body.detail.map((item) => item.msg).join('; ')
      : body.detail || body.message
    throw new Error(detail || `Lỗi máy chủ (${response.status})`)
  }

  return body.data
}

export const getMenu = (signal) =>
  request('/dishes', { signal })

export const getCategories = (signal) =>
  request('/categories', { signal })

export const getTableStatus = (tableId, signal) =>
  request(`/public/tables/${encodeURIComponent(tableId)}/status`, { signal })

export const getOrder = (orderId, tableId, signal) =>
  request(`/public/orders/${encodeURIComponent(orderId)}?table_id=${encodeURIComponent(tableId)}`, { signal })

export const getActiveOrders = (tableId, signal) =>
  request(`/public/orders?table_id=${encodeURIComponent(tableId)}`, { signal })

export const createOrder = (payload) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
