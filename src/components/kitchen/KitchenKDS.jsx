import { useState } from 'react'
import { Button, Space, Tag, Typography } from 'antd'
import { Check, Circle, Fire, Timer } from '@phosphor-icons/react'
import { getErrorMessage } from '../../services/api'
import DataState from '../common/DataState'
import { dispatchOrder, updateOrderStatus } from '../../services/orderService'
import { useOrderDetails } from '../../hooks/useOrderDetails'
import { minutesSince } from '../../utils/format'

const canDispatch = (robot) => ['IDLE', 'CHARGING'].includes(robot.robot_state)

function Ticket({
  order,
  dishById,
  robots,
  robotsLoading,
  robotsError,
  onChanged,
  onRetry,
  onNotify,
}) {
  const [busy, setBusy] = useState(false)
  const { details, loading: detailsLoading, error: detailsError, retry } = useOrderDetails(order)
  const preparing = order.order_status === 'PREPARING'
  const availableRobot = (robots ?? []).find(canDispatch)
  const robotBlockReason = robotsError
    ? `Không thể xác minh trạng thái robot mới nhất. ${robotsError}`
    : robotsLoading
      ? 'Đang tải trạng thái robot.'
      : !availableRobot
        ? 'Không có robot sẵn sàng để giao đơn.'
        : ''
  const actionDisabled = busy || detailsLoading || Boolean(detailsError) || details.length === 0
    || (preparing && Boolean(robotBlockReason))

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
      () => updateOrderStatus(order.order_id, 'PREPARING'),
      `Đơn #${order.order_id} bắt đầu chế biến.`,
    )

  const finish = () => {
    if (!availableRobot) return
    return run(
      () => dispatchOrder(order.order_id, availableRobot.id),
      `Đã cho ${availableRobot.id} xuất phát giao đơn #${order.order_id}.`,
    )
  }

  return (
    <article className="kds-ticket">
      <div className="staff-ticket-header">
        <Typography.Text strong>Đơn #{order.order_id} · Bàn {order.table_id}</Typography.Text>
        <Tag color={preparing ? 'processing' : 'gold'}>
          {preparing ? 'Đang chế biến' : 'Chờ xử lý'}
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
            <Typography.Text strong>
              {detail.quantity} × {dishById[detail.dish_id]?.dish_name ?? `Món ${detail.dish_id}`}
            </Typography.Text>
          </div>
        ))}
      </div>

      <Button
        className="staff-ticket-action"
        type={preparing ? 'primary' : 'default'}
        icon={preparing ? <Check size={17} /> : <Circle size={17} />}
        disabled={actionDisabled}
        loading={busy}
        onClick={preparing ? finish : start}
      >
        {preparing ? 'Hoàn tất và gọi robot' : 'Bắt đầu chế biến'}
      </Button>
      {preparing && robotBlockReason && (
        <Typography.Text className="staff-ticket-hint" type="secondary">
          {robotBlockReason}
        </Typography.Text>
      )}
      <div className="ticket-footer">
        <Fire size={14} aria-hidden="true" />
        Mã món AI:{' '}
        <span className="mono">
          {details.map((detail) => dishById[detail.dish_id]?.ai_label_id).filter(Boolean).join(', ') || '—'}
        </span>
      </div>
    </article>
  )
}

export default function KitchenKDS({
  orders,
  dishes,
  robots,
  robotsLoading,
  robotsError,
  onChanged,
  onRetry,
  onNotify,
  loading,
  error,
}) {
  const dishById = Object.fromEntries((dishes ?? []).map((dish) => [dish.dish_id, dish]))
  const tickets = (orders ?? [])
    .filter((order) => ['PENDING', 'PREPARING'].includes(order.order_status))
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
            robots={robots}
            robotsLoading={robotsLoading}
            robotsError={robotsError}
            onChanged={onChanged}
            onNotify={onNotify}
          />
        ))}
      </div>
    </Space>
  )
}
