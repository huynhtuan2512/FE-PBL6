import { Space, Tag, Typography } from 'antd'
import { Timer } from '@phosphor-icons/react'
import DataState from '../common/DataState'
import { useOrderDetails } from '../../hooks/useOrderDetails'
import { minutesSince } from '../../utils/format'

function Ticket({
  order,
  dishById,
  robots,
}) {
  const { details, loading: detailsLoading, error: detailsError, retry } = useOrderDetails(order)
  const robotTask = (robots ?? [])
    .flatMap((robot) => (robot.tasks ?? []).map((task) => ({ robot, task })))
    .find(({ task }) => task.order_id === order.order_id)
  const deliveryStatus = robotTask?.task.task_status
  const statusConfig = {
    WAITING_FOR_DISH: { label: 'Đang xác định món và bàn', color: 'gold' },
    DELIVERING: { label: `Đang phục vụ · Bàn ${robotTask?.task.table_number ?? order.table_id}`, color: 'processing' },
    DELIVERED: { label: `Đã giao món · Bàn ${robotTask?.task.table_number ?? order.table_id}`, color: 'success' },
  }
  const status = statusConfig[deliveryStatus] ?? {
    label: order.order_status === 'PENDING' ? 'Chờ robot nhận diện' : 'Chưa có cập nhật robot',
    color: 'gold',
  }

  return (
    <article className="kds-ticket">
      <div className="staff-ticket-header">
        <Typography.Text strong>Đơn #{order.order_id} · Bàn {order.table_id}</Typography.Text>
        <Tag color={status.color}>{status.label}</Tag>
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
              <Tag color={detail.served_status ? 'success' : 'default'}>
                {detail.served_status ? 'Đã giao tới bàn' : 'Chờ robot giao'}
              </Tag>
              {detail.notes && <Typography.Text type="secondary">Ghi chú: {detail.notes}</Typography.Text>}
            </div>
          </div>
        ))}
      </div>
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
  robots,
}) {
  const dishById = Object.fromEntries((dishes ?? []).map((dish) => [dish.dish_id, dish]))
  const tickets = (orders ?? [])
    .filter((order) => ['PENDING'].includes(order.order_status))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  if (loading && orders === null) {
    return <DataState status="loading" message="Đang tải trạng thái phục vụ..." />
  }
  if (error && orders === null) {
    return <DataState status="error" error={error} onRetry={onRetry} />
  }
  if (tickets.length === 0) {
    return <DataState status="empty" message="Không có đơn nào đang chờ hoặc đang được robot phục vụ." />
  }

  return (
    <Space orientation="vertical" size="middle" className="staff-kds-content">
      <div className="kds-list">
        {tickets.map((order) => (
          <Ticket
            key={order.order_id}
            order={order}
            dishById={dishById}
            robots={robots}
          />
        ))}
      </div>
    </Space>
  )
}
