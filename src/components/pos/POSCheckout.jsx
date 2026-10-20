import { useState } from 'react'
import { Button, Select, Tag, Typography } from 'antd'
import { Receipt } from '@phosphor-icons/react'
import DataState from '../common/DataState'
import { getErrorMessage } from '../../services/api'
import { createInvoice } from '../../services/orderService'
import { useOrderDetails } from '../../hooks/useOrderDetails'
import { formatVND } from '../../utils/format'

const ORDER_STATUS = {
  PENDING: { label: 'Chờ xử lý', color: 'gold' },
  PROCESSING: { label: 'Đang chế biến', color: 'processing' },
  DELIVERING: { label: 'Đã phục vụ · chờ thanh toán', color: 'blue' },
}

export default function POSCheckout({ orders, dishes, onChanged, onRetry, onNotify, loading, error }) {
  const [selectedId, setSelectedId] = useState('')
  const [busy, setBusy] = useState(false)

  const openOrders = (orders ?? []).filter((item) => item.order_status === 'DELIVERING')
  const order = openOrders.find((item) => String(item.order_id) === selectedId) ?? openOrders[0]
  const { details, loading: detailsLoading, error: detailsError, retry } = useOrderDetails(order)
  const dishById = Object.fromEntries((dishes ?? []).map((dish) => [dish.dish_id, dish]))
  const orderStatus = ORDER_STATUS[order?.order_status] ?? { label: order?.order_status, color: 'default' }
  const allItemsServed = details.length > 0 && details.every((detail) => detail.served_status)

  const completeOrder = async () => {
    if (!order || !allItemsServed || detailsLoading || detailsError) return
    setBusy(true)
    try {
      const invoice = await createInvoice({ order_id: order.order_id, payment_method: 'CASH' })
      onNotify(invoice.payment_status === 'PAID'
        ? `Hóa đơn ${invoice.invoice_id} đã thanh toán; đơn và bàn đã được đồng bộ.`
        : `Đã thanh toán đơn #${order.order_id}; mã hóa đơn ${invoice.invoice_id}.`)
      setSelectedId('')
      await onChanged()
    } catch (requestError) {
      onNotify(getErrorMessage(requestError), 'danger')
    } finally {
      setBusy(false)
    }
  }

  if (loading && orders === null) {
    return <DataState status="loading" message="Đang tải đơn cần thanh toán..." />
  }
  if (error && orders === null) {
    return <DataState status="error" error={error} onRetry={onRetry} />
  }
  if (!order) {
    return <DataState status="empty" message="Chưa có đơn nào đã phục vụ đủ món để thanh toán." />
  }

  return (
    <div className="staff-pos-content">
      <div className="staff-pos-order-heading">
        <div>
          <Typography.Text type="secondary">Đơn #{order.order_id} · Bàn {order.table_id}</Typography.Text>
          <Typography.Title level={3} className="staff-pos-title">Chi tiết đơn hàng</Typography.Title>
        </div>
        <Tag color={orderStatus.color}>{orderStatus.label}</Tag>
      </div>

      {openOrders.length > 1 && (
        <div className="staff-order-select">
          <Typography.Text id="staff-order-select-label">Chọn đơn hàng</Typography.Text>
          <Select
            value={String(order.order_id)}
            onChange={setSelectedId}
            options={openOrders.map((item) => ({
              value: String(item.order_id),
              label: `#${item.order_id} · Bàn ${item.table_id} · ${formatVND(item.total_amount)}`,
            }))}
            aria-labelledby="staff-order-select-label"
          />
        </div>
      )}

      <div className="staff-pos-items">
        {detailsLoading && <DataState status="loading" message="Đang tải món trong đơn..." />}
        {detailsError && (
          <DataState
            status="error"
            message="Không thể tải chi tiết món; chưa thể hoàn tất đơn."
            error={detailsError}
            onRetry={retry}
          />
        )}
        {!detailsLoading && !detailsError && details.length === 0 && (
          <DataState status="empty" message="Đơn chưa có chi tiết món." />
        )}
        {details.map((detail) => (
          <div className="staff-pos-item" key={detail.detail_id}>
            <Typography.Text>
              {detail.quantity} × {dishById[detail.dish_id]?.dish_name ?? `Món ${detail.dish_id}`}
              {detail.notes ? ` · ${detail.notes}` : ''}
            </Typography.Text>
          </div>
        ))}
      </div>

      <div className="staff-pos-total">
        <Typography.Text strong>Tổng đơn theo hệ thống</Typography.Text>
        <Typography.Text strong>{formatVND(order.total_amount)}</Typography.Text>
      </div>

      {!detailsLoading && !detailsError && !allItemsServed && (
        <Typography.Text type="warning">
          Chưa thể thanh toán: cần xác nhận tất cả món đã phục vụ tại khu vực bếp.
        </Typography.Text>
      )}
      <Button
        className="staff-pos-complete"
        type="primary"
        icon={<Receipt size={17} />}
        loading={busy}
        disabled={!allItemsServed || detailsLoading || Boolean(detailsError)}
        onClick={completeOrder}
      >
        {busy ? 'Đang xử lý thanh toán...' : 'Xác nhận thanh toán'}
      </Button>
    </div>
  )
}
