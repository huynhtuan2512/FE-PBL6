import { Alert, Button, Card, Space, Table, Tag, Tooltip, Typography } from 'antd'
import {
  ArrowUpRight,
  House as Home,
  ArrowCounterClockwise as RotateCcw,
  Warning as ShieldAlert,
  Siren,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import ContentPanel from '../components/common/ContentPanel'
import DataState from '../components/common/DataState'
import MetricsBar from '../components/common/MetricsBar'
import PageHeader from '../components/common/PageHeader'
import RobotMap2D from '../components/map/RobotMap2D'
import SectionHeader from '../components/common/SectionHeader'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../hooks/useApi'
import { getOrders } from '../services/orderService'
import { getRobotStatuses } from '../services/robotService'
import { getNodes } from '../services/adminService'
import { formatClock, formatVND } from '../utils/format'
import './dashboard.css'

const ORDER_STATUS = {
  PENDING: { label: 'Chờ xử lý', color: 'gold' },
  PREPARING: { label: 'Đang chế biến', color: 'processing' },
  DELIVERING: { label: 'Đang giao', color: 'blue' },
  COMPLETED: { label: 'Hoàn tất', color: 'success' },
  CANCELLED: { label: 'Đã hủy', color: 'default' },
}

const ROBOT_STATUS = {
  IDLE: 'Rảnh',
  MOVING: 'Đang di chuyển',
  DELIVERING: 'Đang giao hàng',
  RETURNING: 'Đang về bếp',
  CHARGING: 'Đang sạc',
  ERROR: 'Lỗi',
}

const ordersColumns = [
  {
    title: 'Đơn hàng',
    dataIndex: 'order_id',
    key: 'order_id',
    render: (orderId) => <Typography.Text strong>#{orderId}</Typography.Text>,
  },
  {
    title: 'Bàn',
    dataIndex: 'table_id',
    key: 'table_id',
    render: (tableId) => `Bàn ${tableId}`,
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'total_amount',
    key: 'total_amount',
    render: formatVND,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'order_status',
    key: 'order_status',
    render: (status) => {
      const descriptor = ORDER_STATUS[status]
      return <Tag color={descriptor?.color}>{descriptor?.label ?? status}</Tag>
    },
  },
]

function RobotStatusList({ robots, loading, error, onRetry }) {
  if (loading && robots === null) return <DataState status="loading" message="Đang tải trạng thái robot..." />
  if (error && robots === null) return <DataState status="error" error={error} onRetry={onRetry} />
  if (!robots?.length) return <DataState status="empty" message="Chưa có robot gửi trạng thái." />

  return (
    <div className="dashboard-robot-list">
      {error && <Alert type="warning" showIcon title="Đang hiển thị trạng thái robot đã tải trước đó." />}
      {robots.map((robot) => (
        <div className="dashboard-robot-row" key={robot.id}>
          <div>
            <Typography.Text strong>{robot.id}</Typography.Text>
            <Typography.Text type="secondary">
              {robot.current_qr_id ? `Vị trí ${robot.current_qr_id}` : 'Chưa có vị trí'}
              {robot.current_order_id ? ` · Đơn #${robot.current_order_id}` : ''}
            </Typography.Text>
          </div>
          <Space wrap>
            <Tag color={robot.robot_state === 'ERROR' ? 'error' : 'default'}>
              {ROBOT_STATUS[robot.robot_state] ?? robot.robot_state}
            </Tag>
            {robot.obstacle_detected && <Tag color="warning">Có vật cản</Tag>}
          </Space>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { role } = useAuth()
  const isAdmin = role === 'ADMIN'
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    reload: reloadOrders,
    lastUpdated: ordersUpdatedAt,
  } = useApi(getOrders, { interval: 5000 })
  const {
    data: robots,
    loading: robotsLoading,
    error: robotsError,
    reload: reloadRobots,
    lastUpdated: robotsUpdatedAt,
  } = useApi(getRobotStatuses, { interval: 3000 })
  const {
    data: nodes,
    loading: nodesLoading,
    error: nodesError,
    reload: reloadNodes,
  } = useApi(getNodes, { enabled: isAdmin })

  const robotList = robots ?? []
  const alerts = robotList.flatMap((robot) => [
    ...(robot.obstacle_detected ? [{
      key: `${robot.id}-obstacle`,
      type: 'warning',
      message: `${robot.id} phát hiện vật cản`,
      description: robot.current_qr_id ? `Vị trí hiện tại: ${robot.current_qr_id}.` : 'Robot chưa báo mã QR vị trí.',
    }] : []),
    ...(robot.robot_state === 'ERROR' ? [{
      key: `${robot.id}-error`,
      type: 'error',
      message: `${robot.id} đang ở trạng thái lỗi`,
      description: robot.current_qr_id ? `Vị trí hiện tại: ${robot.current_qr_id}. Cần kiểm tra robot.` : 'Cần kiểm tra robot.',
    }] : []),
  ])

  const disableReason = 'Hệ thống chưa hỗ trợ các thao tác điều khiển này.'
  const controlActions = [
    { key: 'stop', label: 'Dừng khẩn cấp', icon: <Siren size={18} />, danger: true },
    { key: 'home', label: 'Cho robot về bếp', icon: <Home size={18} /> },
    { key: 'reset', label: 'Đặt lại trạng thái', icon: <RotateCcw size={18} /> },
  ]

  return (
    <div className="page-content dashboard-page">
      <PageHeader
        eyebrow="Vận hành"
        title="Trung tâm điều hành"
        description="Theo dõi đơn hàng, trạng thái robot và cảnh báo đang cần xử lý."
        extra={(
          <Space orientation="vertical" size={0} className="dashboard-update-times">
            <Typography.Text type={ordersError ? 'danger' : 'secondary'}>
              Đơn hàng cập nhật: {ordersUpdatedAt ? formatClock(ordersUpdatedAt) : 'Chưa có dữ liệu'}
            </Typography.Text>
            <Typography.Text type={robotsError ? 'danger' : 'secondary'}>
              Robot cập nhật: {robotsUpdatedAt ? formatClock(robotsUpdatedAt) : 'Chưa có dữ liệu'}
            </Typography.Text>
          </Space>
        )}
      />

      <MetricsBar
        robots={robots}
        orders={orders}
        robotsLoading={robotsLoading}
        robotsError={robotsError}
        ordersLoading={ordersLoading}
        ordersError={ordersError}
      />

      <div className="dashboard-primary-grid">
        <RobotMap2D
          nodes={nodes}
          robots={robots}
          loading={nodesLoading}
          error={nodesError}
          onRetry={() => reloadNodes()}
          restricted={!isAdmin}
        />

        <Card className="dashboard-control-card">
          <SectionHeader
            eyebrow="Thao tác robot"
            title="Điều khiển từ xa"
            className="dashboard-card-header"
          />
          <Alert
            className="dashboard-control-notice"
            type="info"
            showIcon
            title={disableReason}
            description="Các nút vẫn bị khóa vì chưa thể gửi và xác nhận lệnh điều khiển."
          />
          <Space orientation="vertical" className="dashboard-control-actions" size="middle">
            {controlActions.map(({ key, label, icon, danger }) => (
              <Tooltip title={disableReason} key={key}>
                <Button block disabled danger={danger} icon={icon}>
                  {label}
                </Button>
              </Tooltip>
            ))}
          </Space>
          <RobotStatusList
            robots={robots}
            loading={robotsLoading}
            error={robotsError}
            onRetry={() => reloadRobots()}
          />
        </Card>
      </div>

      <div className="dashboard-secondary-grid">
        <ContentPanel className="dashboard-orders-panel">
          <SectionHeader
            eyebrow="Đơn hàng"
            title="Đơn hàng gần đây"
            className="dashboard-card-header"
            extra={<Link className="dashboard-view-all" to="/staff">Xem không gian phục vụ <ArrowUpRight size={15} /></Link>}
          />
          {ordersError && (
            <DataState
              status="error"
              error={ordersError}
              message={orders ? 'Không thể đồng bộ đơn hàng mới' : undefined}
              onRetry={() => reloadOrders()}
            />
          )}
          {ordersLoading && orders === null && <DataState status="loading" message="Đang tải đơn hàng..." />}
          {orders && (
            <Table
              className="dashboard-orders-table"
              columns={ordersColumns}
              dataSource={orders.slice(0, 6)}
              rowKey="order_id"
              pagination={false}
              size="small"
              scroll={{ x: 520 }}
              locale={{ emptyText: 'Chưa có đơn hàng.' }}
            />
          )}
        </ContentPanel>

        <ContentPanel className="dashboard-alerts-panel">
          <SectionHeader
            eyebrow="Theo dõi robot"
            title="Cảnh báo cần xử lý"
            className="dashboard-card-header"
            extra={<Tag>{robots === null ? '—' : alerts.length}</Tag>}
          />
          {robotsLoading && robots === null && <DataState status="loading" message="Đang tải cảnh báo..." />}
          {!robotsLoading && !robotsError && robotList.length === 0 && (
            <DataState status="empty" message="Chưa có robot gửi trạng thái để xác định cảnh báo." />
          )}
          {robotsError && robots === null && (
            <Typography.Text type="secondary">Không thể xác định cảnh báo khi chưa tải được trạng thái robot.</Typography.Text>
          )}
          {robots && alerts.length === 0 && <DataState status="empty" message="Không có cảnh báo từ trạng thái robot." />}
          {robotsError && robots && (
            <Typography.Text type="secondary">Cảnh báo bên dưới dựa trên trạng thái đã tải trước đó.</Typography.Text>
          )}
          <Space orientation="vertical" className="dashboard-alert-list" size="middle">
            {alerts.map((alert) => (
              <Alert
                key={alert.key}
                type={alert.type}
                showIcon
                title={alert.message}
                description={alert.description}
              />
            ))}
          </Space>
        </ContentPanel>
      </div>

      {ordersError && orders && (
        <Typography.Text className="dashboard-stale-note" type="secondary">
          Đang hiển thị dữ liệu đơn hàng đã tải trước đó; thời điểm cập nhật gần nhất được ghi ở đầu trang.
        </Typography.Text>
      )}
    </div>
  )
}
