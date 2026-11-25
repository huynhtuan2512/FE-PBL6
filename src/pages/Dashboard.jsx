import { Alert, Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd'
import ContentPanel from '../components/common/ContentPanel'
import DataState from '../components/common/DataState'
import PageHeader from '../components/common/PageHeader'
import SectionHeader from '../components/common/SectionHeader'
import { useApi } from '../hooks/useApi'
import { getInvoices } from '../services/invoiceService'
import { getOrders } from '../services/orderService'
import { getTables } from '../services/tableService'
import { getRobots } from '../services/robotService'
import { formatClock, formatVND } from '../utils/format'
import './dashboard.css'

const ORDER_STATUS = {
  PENDING: { label: 'Chờ robot nhận diện', color: 'gold' },
  PROCESSING: { label: 'Đang xử lý robot', color: 'processing' },
  DELIVERING: { label: 'Đang/đã giao · chờ thanh toán', color: 'blue' },
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
  const robotsState = useApi(getRobots, { interval: 5000 })
  const orders = ordersState.data ?? []
  const tables = tablesState.data ?? []
  const invoices = invoicesState.data ?? []
  const robots = robotsState.data ?? []
  const activeOrders = orders.filter(
    (order) => !['COMPLETED', 'CANCELLED'].includes(order.order_status),
  ).length
  const occupiedTables = tables.filter((table) => table.status === 'OCCUPIED').length
  const paidTotal = invoices
    .filter((invoice) => invoice.payment_status === 'PAID')
    .reduce((sum, invoice) => sum + Number(invoice.final_amount), 0)
  const onlineRobots = robots.filter((robot) => robot.online).length
  const robotsDelivering = robots.filter((robot) => robot.delivery_status === 'DELIVERING').length

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
        <Col xs={12} sm={6}><Card size="small"><Statistic title="Đơn chưa hoàn tất" value={ordersState.error && ordersState.data === null ? '—' : activeOrders} /></Card></Col>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="Bàn đang sử dụng" value={tablesState.error && tablesState.data === null ? '—' : `${occupiedTables}/${tables.length}`} /></Card></Col>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="Robot đang online" value={robotsState.error && robotsState.data === null ? '—' : `${onlineRobots}/${robots.length}`} /></Card></Col>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="Robot đang giao món" value={robotsState.error && robotsState.data === null ? '—' : robotsDelivering} /></Card></Col>
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
        <Col xs={24}>
          <ContentPanel className="dashboard-orders-panel">
            <SectionHeader title="Trạng thái robot" className="dashboard-card-header" />
            {robotsState.loading && robotsState.data === null && (
              <DataState status="loading" message="Đang tải trạng thái robot..." />
            )}
            {robotsState.error && robotsState.data === null && (
              <DataState status="error" error={robotsState.error} onRetry={() => robotsState.reload()} />
            )}
            {robotsState.error && robotsState.data && (
              <Alert
                type="warning"
                showIcon
                title="Không thể đồng bộ robot."
                description="Đang hiển thị dữ liệu robot đã tải trước đó."
                action={<button type="button" onClick={() => robotsState.reload()}>Thử lại</button>}
              />
            )}
            {robotsState.data && (
              <Table
                className="dashboard-orders-table"
                rowKey="robot_id"
                columns={[
                  { title: 'Robot', dataIndex: 'robot_id', key: 'robot_id' },
                  { title: 'Trạng thái', dataIndex: 'delivery_status', key: 'delivery_status', render: (status) => (
                    <Tag>{status || 'Chưa xác định'}</Tag>
                  ) },
                  { title: 'Bàn', dataIndex: 'table_number', key: 'table_number', render: (number) => number ? `Bàn ${number}` : '—' },
                  { title: 'Mã đơn', dataIndex: 'order_id', key: 'order_id', render: (orderId) => orderId || '—' },
                  { title: 'Kết nối', dataIndex: 'online', key: 'online', render: (online) => <Tag color={online ? 'success' : 'default'}>{online ? 'Online' : 'Offline'}</Tag> },
                ]}
                dataSource={robots}
                pagination={false}
                loading={robotsState.loading}
                scroll={{ x: 680 }}
                locale={{ emptyText: 'Chưa có robot trong cơ sở dữ liệu.' }}
              />
            )}
          </ContentPanel>
        </Col>
      </Row>
    </div>
  )
}
