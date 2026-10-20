import { Alert, Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd'
import ContentPanel from '../components/common/ContentPanel'
import DataState from '../components/common/DataState'
import PageHeader from '../components/common/PageHeader'
import SectionHeader from '../components/common/SectionHeader'
import { useApi } from '../hooks/useApi'
import { getInvoices } from '../services/invoiceService'
import { getOrders } from '../services/orderService'
import { getTables } from '../services/tableService'
import { formatClock, formatVND } from '../utils/format'
import './dashboard.css'

const ORDER_STATUS = {
  PENDING: { label: 'Chờ xử lý', color: 'gold' },
  PROCESSING: { label: 'Đang chế biến', color: 'processing' },
  DELIVERING: { label: 'Đã phục vụ · chờ thanh toán', color: 'blue' },
  COMPLETED: { label: 'Hoàn tất', color: 'success' },
  CANCELLED: { label: 'Đã hủy', color: 'default' },
}

const TABLE_STATUS = {
  EMPTY: { label: 'Trống', color: 'success' },
  OCCUPIED: { label: 'Đang dùng', color: 'processing' },
  RESERVED: { label: 'Đã đặt', color: 'warning' },
  CLEANING: { label: 'Đang dọn', color: 'default' },
}

export default function Dashboard() {
  const ordersState = useApi(getOrders, { interval: 5000 })
  const tablesState = useApi(getTables, { interval: 15000 })
  const invoicesState = useApi(getInvoices, { interval: 30000 })
  const orders = ordersState.data ?? []
  const tables = tablesState.data ?? []
  const invoices = invoicesState.data ?? []
  const activeOrders = orders.filter(
    (order) => !['COMPLETED', 'CANCELLED'].includes(order.order_status),
  ).length
  const occupiedTables = tables.filter((table) => table.status === 'OCCUPIED').length
  const paidTotal = invoices
    .filter((invoice) => invoice.payment_status === 'PAID')
    .reduce((sum, invoice) => sum + Number(invoice.final_amount), 0)

  const orderColumns = [
    { title: 'Mã đơn', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Bàn', dataIndex: 'table_id', key: 'table_id' },
    { title: 'Tổng đơn', dataIndex: 'total_amount', key: 'total_amount', render: formatVND },
    {
      title: 'Trạng thái',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (status) => <Tag color={ORDER_STATUS[status]?.color}>{ORDER_STATUS[status]?.label ?? status}</Tag>,
    },
  ]

  const tableColumns = [
    { title: 'Bàn', dataIndex: 'table_number', key: 'table_number', render: (number) => `Bàn ${String(number).padStart(2, '0')}` },
    { title: 'Sức chứa', dataIndex: 'capacity', key: 'capacity', render: (capacity) => `${capacity ?? 4} chỗ` },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={TABLE_STATUS[status]?.color}>{TABLE_STATUS[status]?.label ?? status}</Tag>,
    },
  ]

  const invoiceColumns = [
    { title: 'Mã hóa đơn', dataIndex: 'invoice_id', key: 'invoice_id' },
    { title: 'Mã đơn', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Thanh toán', dataIndex: 'payment_method', key: 'payment_method' },
    { title: 'Thực thu', dataIndex: 'final_amount', key: 'final_amount', render: formatVND },
    { title: 'Thời gian', dataIndex: 'created_at', key: 'created_at', render: (value) => value ? formatClock(value) : '—' },
  ]

  const renderData = (state, data, columns, rowKey, label) => {
    if (state.loading && state.data === null) return <DataState status="loading" message={`Đang tải ${label}...`} />
    if (state.error && state.data === null) return <DataState status="error" error={state.error} onRetry={() => state.reload()} />
    return (
      <>
        {state.error && (
          <Alert
            type="warning"
            showIcon
            title={`Không thể đồng bộ ${label} mới nhất.`}
            description="Đang hiển thị dữ liệu đã tải trước đó."
            action={<button type="button" onClick={() => state.reload()}>Thử lại</button>}
          />
        )}
        <Table
          className="dashboard-orders-table"
          columns={columns}
          dataSource={data.slice(0, 10)}
          rowKey={rowKey}
          pagination={false}
          scroll={{ x: 560 }}
          loading={state.loading}
          locale={{ emptyText: `Chưa có ${label}.` }}
        />
      </>
    )
  }

  return (
    <div className="page-content dashboard-page">
      <PageHeader
        eyebrow="Vận hành nhà hàng"
        title="Tổng quan"
        description="Đơn hàng, trạng thái bàn và hóa đơn từ cơ sở dữ liệu."
        extra={(
          <Typography.Text type="secondary">
            Cập nhật đơn: {ordersState.lastUpdated ? formatClock(ordersState.lastUpdated) : 'Chưa có dữ liệu'}
          </Typography.Text>
        )}
      />

      <Row className="dashboard-metrics" gutter={[12, 12]}>
        <Col xs={24} sm={8}><Card size="small"><Statistic title="Đơn chưa hoàn tất" value={ordersState.error && ordersState.data === null ? '—' : activeOrders} /></Card></Col>
        <Col xs={24} sm={8}><Card size="small"><Statistic title="Bàn đang sử dụng" value={tablesState.error && tablesState.data === null ? '—' : `${occupiedTables}/${tables.length}`} /></Card></Col>
        <Col xs={24} sm={8}><Card size="small"><Statistic title="Thực thu từ 100 hóa đơn gần nhất" value={invoicesState.error && invoicesState.data === null ? '—' : formatVND(paidTotal)} /></Card></Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <ContentPanel className="dashboard-orders-panel">
            <SectionHeader title="Đơn hàng gần đây" className="dashboard-card-header" />
            {renderData(ordersState, orders, orderColumns, 'order_id', 'đơn hàng')}
          </ContentPanel>
        </Col>
        <Col xs={24} xl={10}>
          <ContentPanel className="dashboard-alerts-panel">
            <SectionHeader title="Trạng thái bàn" className="dashboard-card-header" />
            {renderData(tablesState, tables, tableColumns, 'table_id', 'bàn')}
          </ContentPanel>
        </Col>
        <Col xs={24}>
          <ContentPanel className="dashboard-orders-panel">
            <SectionHeader title="Hóa đơn gần đây" className="dashboard-card-header" />
            {renderData(invoicesState, invoices, invoiceColumns, 'invoice_id', 'hóa đơn')}
          </ContentPanel>
        </Col>
      </Row>

      <Alert
        type="info"
        showIcon
        title="Theo dõi robot chưa khả dụng."
        description="Cơ sở dữ liệu hiện tại không có bảng robot, node hoặc định tuyến."
      />
    </div>
  )
}
