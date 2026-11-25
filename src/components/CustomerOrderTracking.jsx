import { useEffect, useMemo, useState } from 'react'
import { getActiveOrders } from '../services/restaurantApi'
import { formatVnd } from '../mockData'

const ORDER_STATUSES = {
  PENDING: { label: 'Đã nhận đơn · chờ xử lý', style: 'bg-amber-100 text-amber-900' },
  PREPARING: { label: 'Nhà bếp đang chuẩn bị món', style: 'bg-blue-100 text-blue-900' },
  PROCESSING: { label: 'Nhà bếp đang chuẩn bị món', style: 'bg-blue-100 text-blue-900' },
  DELIVERING: { label: 'Đã phục vụ món · chờ thanh toán', style: 'bg-violet-100 text-violet-900' },
}

export default function CustomerOrderTracking({ tableId, dishes, refreshKey }) {
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const dishById = useMemo(
    () => new Map((dishes ?? []).map((dish) => [dish.dish_id, dish])),
    [dishes],
  )

  useEffect(() => {
    const controller = new AbortController()
    let requestPending = false

    const refresh = async (showLoading = false) => {
      if (requestPending) return
      requestPending = true
      if (showLoading) setLoading(true)
      try {
        const activeOrders = await getActiveOrders(tableId, controller.signal)
        if (controller.signal.aborted) return
        setOrders(activeOrders)
        setError('')
        setLastUpdated(new Date())
      } catch (requestError) {
        if (controller.signal.aborted) return
        setError(requestError.message || 'Không thể tải đơn hàng của bàn.')
      } finally {
        requestPending = false
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    refresh(true)
    const timer = window.setInterval(() => refresh(), 5000)
    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [refreshKey, tableId])

  return (
    <section id="order-tracking" className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-red-600">Theo dõi đơn hàng</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">Đơn hàng đang phục vụ</h2>
          <p className="mt-2 text-sm text-slate-700">
            Các đơn đang hoạt động tại bàn {tableId}, kèm trạng thái giao từng món.
          </p>
        </div>
        {lastUpdated && (
          <span className="text-xs text-slate-600">
            Cập nhật lúc {lastUpdated.toLocaleTimeString('vi-VN')}
          </span>
        )}
      </div>

      {loading && orders === null && (
        <p role="status" className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
          Đang tải đơn hàng...
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      )}
      {!loading && !error && orders?.length === 0 && (
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          Hiện không có đơn hàng nào đang được phục vụ tại bàn này.
        </p>
      )}

      <div className="mt-4 grid gap-4">
        {orders?.map((order) => {
          const status = ORDER_STATUSES[order.order_status]
          return (
            <article key={order.order_id} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">Đơn #{order.order_id}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Bàn {tableId}{order.created_at ? ` · ${new Date(order.created_at).toLocaleString('vi-VN')}` : ''}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-2 text-sm font-bold ${status?.style ?? 'bg-slate-100 text-slate-800'}`}>
                  {status?.label ?? order.order_status}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">Các món trong đơn</h3>
              <div className="mt-2 divide-y divide-slate-100">
                {order.order_details.map((item) => {
                  const dish = dishById.get(item.dish_id)
                  const served = item.served_status === true
                  return (
                    <div key={item.detail_id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.quantity} × {dish?.dish_name ?? `Món ${item.dish_id}`}
                        </p>
                        {item.notes && <p className="mt-1 text-sm text-slate-600">Ghi chú: {item.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {formatVnd(Number(item.price_at_time) * Number(item.quantity ?? 0))}
                        </p>
                        <p className={`mt-1 text-sm font-bold ${served ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {served ? 'Đã giao' : 'Chưa giao'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-3 flex justify-between border-t border-slate-200 pt-4">
                <span className="font-bold text-slate-900">Tổng đơn</span>
                <span className="font-bold text-red-700">{formatVnd(order.total_amount)}</span>
              </div>
            </article>
          )
        })}
      </div>
      {orders?.length > 0 && (
        <p className="mt-3 text-xs text-slate-600">
          Trạng thái đơn được tự động cập nhật khoảng mỗi 5 giây.
        </p>
      )}
    </section>
  )
}
