import { useState } from 'react'
import { Button, Checkbox, Space, Tag, Typography } from 'antd'
import { Circle, Timer } from '@phosphor-icons/react'
import { getErrorMessage } from '../../services/api'
import DataState from '../common/DataState'
import { updateOrderDetailServed, updateOrderStatus } from '../../services/orderService'
import { useOrderDetails } from '../../hooks/useOrderDetails'
import { minutesSince } from '../../utils/format'

function Ticket({
  order,
  dishById,
  onChanged,
  onRetry,
  onNotify,
}) {
  const [busy, setBusy] = useState(false)
  const { details, loading: detailsLoading, error: detailsError, retry } = useOrderDetails(order)
  const processing = order.order_status === 'PROCESSING'
  const actionDisabled = busy || detailsLoading || Boolean(detailsError) || details.length === 0
  const servedCount = details.filter((detail) => detail.served_status).length

  const run = async (action, successMessage) => {
    setBusy(true)
    try {
      await action()
      onNotify(successMessage)
      await onChanged()
    } catch (error) {
      onNotify(getErrorMessage(error), 'danger')
    } finally {
      setBusy(false)
    }
  }

  const start = () =>
    run(
      () => updateOrderStatus(order.order_id, 'PROCESSING'),
      `Đơn #${order.order_id} bắt đầu chế biến.`,
    )

  const markServed = (detail) =>
    run(
      () => updateOrderDetailServed(detail.detail_id, true),
      servedCount + 1 === details.length
        ? `Đã phục vụ đủ món của đơn #${order.order_id}; đơn sẵn sàng thanh toán.`
        : `Đã xác nhận phục vụ món trong đơn #${order.order_id}.`,
    )

  return (
    <article className="kds-ticket">
      <div className="staff-ticket-header">
        <Typography.Text strong>Đơn #{order.order_id} · Bàn {order.table_id}</Typography.Text>
        <Tag color={processing ? 'processing' : 'gold'}>
          {processing ? `Đang chế biến · ${servedCount}/${details.length} đã phục vụ` : 'Chờ xử lý'}
        </Tag>
      </div>
      <Typography.Text className="staff-ticket-time" type="secondary">
        <Timer size={14} aria-hidden="true" />
        {order.created_at ? `Tạo ${minutesSince(order.created_at)} phút trước` : 'Chưa có thời điểm tạo'}
      </Typography.Text>

      <div className="staff-ticket-dishes">
        {detailsLoading && <DataState status="loading" message="Đang tải chi tiết món..." />}
        {detailsError && (
          <DataState
            status="error"
            message="Không thể tải chi tiết món của đơn này."
            error={detailsError}
            onRetry={retry}
          />
        )}
        {!detailsLoading && !detailsError && details.length === 0 && (
          <DataState status="empty" message="Đơn chưa có chi tiết món." />
        )}
        {details.map((detail) => (
          <div className="staff-ticket-dish" key={detail.detail_id}>
            <div className="staff-ticket-dish-row">
              <Typography.Text strong>
                {detail.quantity} × {dishById[detail.dish_id]?.dish_name ?? `Món ${detail.dish_id}`}
              </Typography.Text>
              {processing && (
                <Checkbox
                  checked={Boolean(detail.served_status)}
                  disabled={busy || Boolean(detail.served_status)}
                  onChange={() => markServed(detail)}
                >
                  Đã phục vụ
                </Checkbox>
              )}
              {detail.notes && <Typography.Text type="secondary">Ghi chú: {detail.notes}</Typography.Text>}
            </div>
          </div>
        ))}
      </div>

      <Button
        className="staff-ticket-action"
        type="default"
        icon={<Circle size={17} />}
        disabled={actionDisabled || processing}
        loading={busy}
        onClick={start}
      >
        {processing ? 'Đang chế biến' : 'Bắt đầu chế biến'}
      </Button>
      {processing && <Typography.Text className="staff-ticket-hint" type="secondary">
        Xác nhận từng món đã phục vụ; đơn sẽ chuyển sang chờ thanh toán khi hoàn tất.
      </Typography.Text>}
    </article>
  )
}

export default function KitchenKDS({
  orders,
  dishes,
  onChanged,
  onRetry,
  onNotify,
  loading,
  error,
}) {
  const dishById = Object.fromEntries((dishes ?? []).map((dish) => [dish.dish_id, dish]))
  const tickets = (orders ?? [])
    .filter((order) => ['PENDING', 'PROCESSING'].includes(order.order_status))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  if (loading && orders === null) {
    return <DataState status="loading" message="Đang tải đơn cần chế biến..." />
  }
  if (error && orders === null) {
    return <DataState status="error" error={error} onRetry={onRetry} />
  }
  if (tickets.length === 0) {
    return <DataState status="empty" message="Không có đơn nào cần chế biến." />
  }

  return (
    <Space orientation="vertical" size="middle" className="staff-kds-content">
      <div className="kds-list">
        {tickets.map((order) => (
          <Ticket
            key={order.order_id}
            order={order}
            dishById={dishById}
            onChanged={onChanged}
            onNotify={onNotify}
          />
        ))}
      </div>
    </Space>
  )
}
