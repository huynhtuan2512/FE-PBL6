import { Card, Col, Row, Statistic, Tag, Typography } from 'antd'
import { tokens } from '../../design-system/tokens'

export default function MetricsBar({
  robots,
  orders,
  robotsLoading,
  robotsError,
  ordersLoading,
  ordersError,
}) {
  const robotList = robots ?? []
  const activeOrders = orders?.filter((order) => !['COMPLETED', 'CANCELLED'].includes(order.order_status)).length
  const obstacleCount = robotList.filter((robot) => robot.obstacle_detected).length
  const robotSummary = robotsError && robots === null
    ? 'Không tải được trạng thái robot'
    : robotsLoading && robots === null
      ? 'Đang tải trạng thái robot'
      : robotList.length === 0
        ? 'Chưa có robot gửi trạng thái'
        : `${robotList.length} robot đang được theo dõi`
  const obstacleSummary = robotsError && robots === null
    ? 'Không tải được dữ liệu robot'
    : robotsLoading && robots === null
      ? 'Đang tải trạng thái robot'
      : obstacleCount > 0
        ? `${obstacleCount} robot báo có vật cản`
        : robotList.length > 0
          ? 'Không có robot báo vật cản'
          : 'Chưa có dữ liệu robot'

  const metrics = [
    {
      title: 'Robot',
      value: robotsError && robots === null ? '—' : robotsLoading && robots === null ? '…' : robotList.length,
      note: robotSummary,
    },
    {
      title: 'Đơn đang xử lý',
      value: ordersError ? '—' : ordersLoading && orders === null ? '…' : (activeOrders ?? '—'),
      note: ordersError ? 'Không tải được dữ liệu đơn' : 'Theo trạng thái đơn từ hệ thống',
    },
    {
      title: 'Vật cản',
      value: robotsError && robots === null ? '—' : robotsLoading && robots === null ? '…' : obstacleCount,
      note: obstacleSummary,
      warning: obstacleCount > 0,
    },
  ]

  return (
    <section aria-label="Chỉ số vận hành">
      <Row className="dashboard-metrics" gutter={[12, 12]}>
        {metrics.map(({ title, value, note, warning }) => (
          <Col key={title} xs={24} sm={12} xl={8}>
            <Card className="dashboard-metric-card" size="small">
              <Statistic
                title={title}
                value={value}
                styles={warning ? { content: { color: tokens.colorDanger } } : undefined}
              />
              <Typography.Text type="secondary">{note}</Typography.Text>
              {warning && <Tag color="error">Cần kiểm tra</Tag>}
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  )
}
