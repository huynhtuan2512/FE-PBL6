import { useCallback, useEffect, useState } from 'react'
import { getOrder } from '../services/restaurantApi'
import { formatVnd } from '../mockData'

const ORDER_STATUSES = {
  PENDING: { label: 'Đã nhận đơn · chờ xử lý', style: 'bg-amber-100 text-amber-900' },
  PROCESSING: { label: 'Nhà bếp đang chuẩn bị món', style: 'bg-blue-100 text-blue-900' },
  DELIVERING: { label: 'Đã phục vụ món · chờ thanh toán', style: 'bg-violet-100 text-violet-900' },
  COMPLETED: { label: 'Đơn hàng đã hoàn tất', style: 'bg-emerald-100 text-emerald-900' },
  CANCELLED: { label: 'Đơn hàng đã hủy', style: 'bg-slate-200 text-slate-800' },
}

const isTerminal = (status) => ['COMPLETED', 'CANCELLED'].includes(status)

export default function CustomerOrderTracking({
  tableId,
  initialOrderId,
  dishes,
  onOrderFound,
}) {
  const [input, setInput] = useState(initialOrderId ?? '')
  const [orderId, setOrderId] = useState(initialOrderId ?? '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(Boolean(initialOrderId))
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const dishById = new Map((dishes ?? []).map((dish) => [dish.dish_id, dish]))

  const refresh = useCallback(async (signal) => {
    if (!orderId || !tableId) return
    try {
      const nextOrder = await getOrder(orderId, tableId, signal)
      if (signal?.aborted) return
      setOrder(nextOrder)
      setError('')
      setLastUpdated(new Date())
      onOrderFound(nextOrder.order_id)
    } catch (requestError) {
      if (signal?.aborted) return
      setError(requestError.message || 'Không thể tra cứu đơn hàng.')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [onOrderFound, orderId, tableId])

  useEffect(() => {
    setInput(initialOrderId ?? '')
    if (initialOrderId) setOrderId(initialOrderId)
  }, [initialOrderId])

  useEffect(() => {
    if (!orderId) {
      setOrder(null)
      setLoading(false)
      setError('')
      return undefined
    }

    const controller = new AbortController()
    setLoading(true)
    refresh(controller.signal)
    return () => controller.abort()
  }, [orderId, refresh])

  useEffect(() => {
    if (!orderId || !order || isTerminal(order.order_status)) return undefined
    const timer = window.setInterval(() => refresh(), 5000)
    return () => window.clearInterval(timer)
  }, [order?.order_status, orderId, refresh])

  const submitLookup = (event) => {
    event.preventDefault()
    const value = input.trim()
    if (!value) {
      setError('Nhập mã đơn hàng để tra cứu.')
      return
    }
    if (value.length > 50) {
      setError('Mã đơn hàng không hợp lệ.')
      return
    }
    setError('')
    setOrder(null)
    if (value === orderId) {
      setLoading(true)
      refresh()
    } else {
      setOrderId(value)
    }
  }

  const status = ORDER_STATUSES[order?.order_status]

  return (
    <section id="order-tracking" className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-red-600">Theo dõi đơn hàng</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">Tra cứu đơn đã gọi</h2>
          <p className="mt-2 text-sm text-slate-700">Đơn được đối chiếu với mã bàn trên trang để xem trạng thái và món đã gọi.</p>
        </div>
        {lastUpdated && (
          <span className="text-xs text-slate-600">
            Cập nhật lúc {lastUpdated.toLocaleTimeString('vi-VN')}
          </span>
        )}
      </div>

      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={submitLookup}>
        <label className="sr-only" htmlFor="customer-order-id">Mã đơn hàng</label>
        <input
          id="customer-order-id"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={50}
          placeholder="Ví dụ: ORD_A1B2C3D4E5F6"
          className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-[44px] rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? 'Đang tra cứu...' : 'Tra cứu'}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-5 border-t border-slate-200 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Đơn #{order.order_id}</p>
              <p className="mt-1 text-xs text-slate-600">
                Bàn {tableId}{order.created_at ? ` · ${new Date(order.created_at).toLocaleString('vi-VN')}` : ''}
              </p>
            </div>
            <span className={`rounded-full px-3 py-2 text-sm font-bold ${status?.style ?? 'bg-slate-100 text-slate-800'}`}>
              {status?.label ?? order.order_status}
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {order.order_details.map((item) => {
              const dish = dishById.get(item.dish_id)
              return (
                <div key={item.detail_id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.quantity} × {dish?.dish_name ?? `Món ${item.dish_id}`}
                    </p>
                    {item.notes && <p className="mt-1 text-sm text-slate-600">Ghi chú: {item.notes}</p>}
                    <p className="mt-1 text-xs text-slate-600">
                      {item.served_status
                        ? 'Đã phục vụ'
                        : order.order_status === 'PENDING'
                          ? 'Chờ nhà bếp xử lý'
                          : order.order_status === 'CANCELLED'
                            ? 'Đơn hàng đã hủy'
                            : order.order_status === 'COMPLETED'
                              ? 'Đơn hàng đã hoàn tất'
                              : 'Đang chuẩn bị'}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {formatVnd(Number(item.price_at_time) * Number(item.quantity ?? 0))}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex justify-between border-t border-slate-200 pt-4">
            <span className="font-bold text-slate-900">Tổng đơn</span>
            <span className="font-bold text-red-700">{formatVnd(order.total_amount)}</span>
          </div>
          {!isTerminal(order.order_status) && (
            <p className="mt-3 text-xs text-slate-600">Trạng thái được tự động cập nhật khoảng mỗi 5 giây.</p>
          )}
        </div>
      )}
    </section>
  )
}
