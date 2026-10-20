import { Alert, Card, Empty, Tag, Typography } from 'antd'
import DataState from '../common/DataState'
import SectionHeader from '../common/SectionHeader'

function normalize(value, min, max) {
  if (max === min) return 50
  return 8 + ((value - min) / (max - min)) * 84
}

function getBounds(nodes) {
  return nodes.reduce((bounds, node) => ({
    minX: Math.min(bounds.minX, node.pos_x),
    maxX: Math.max(bounds.maxX, node.pos_x),
    minY: Math.min(bounds.minY, node.pos_y),
    maxY: Math.max(bounds.maxY, node.pos_y),
  }), {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  })
}

export default function RobotMap2D({
  nodes,
  robots,
  loading,
  error,
  onRetry,
  restricted = false,
}) {
  const nodeList = nodes ?? []
  const robotList = robots ?? []
  const bounds = nodeList.length ? getBounds(nodeList) : null
  const nodeById = new Map(nodeList.map((node) => [node.qr_id, node]))

  return (
    <Card className="dashboard-map-card">
      <SectionHeader
        eyebrow="Sơ đồ vận hành"
        title="Vị trí node và robot"
        className="dashboard-card-header"
      />

      {restricted ? (
        <Alert
          type="info"
          showIcon
          title="Sơ đồ node chỉ dành cho quản trị viên"
          description="Danh sách node chỉ dành cho quản trị viên."
        />
      ) : loading ? (
        <DataState status="loading" message="Đang tải sơ đồ node..." />
      ) : error ? (
        <DataState status="error" error={error} onRetry={onRetry} />
      ) : nodeList.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có node trong hệ thống." />
      ) : (
        <>
          <div className="dashboard-map-canvas" role="img" aria-label="Sơ đồ node theo tọa độ cấu hình và vị trí robot">
            <div className="dashboard-map-grid" aria-hidden="true" />
            {nodeList.map((node) => {
              const robotsAtNode = robotList.filter((robot) => robot.current_qr_id === node.qr_id)
              return (
                <div
                  className="dashboard-map-node"
                  key={node.qr_id}
                  style={{
                    left: `${normalize(node.pos_x, bounds.minX, bounds.maxX)}%`,
                    top: `${normalize(node.pos_y, bounds.minY, bounds.maxY)}%`,
                  }}
                  title={`${node.node_name} (${node.qr_id})`}
                >
                  <span aria-hidden="true" />
                  <Typography.Text>{node.qr_id}</Typography.Text>
                  {robotsAtNode.map((robot) => (
                    <Tag className="dashboard-map-robot" color="blue" key={robot.id}>
                      {robot.id}
                    </Tag>
                  ))}
                </div>
              )
            })}
          </div>

          <div className="dashboard-map-details">
            <Typography.Text type="secondary">
              Tọa độ node lấy từ cấu hình hệ thống; hiện chưa có dữ liệu tuyến đường để vẽ lộ trình.
            </Typography.Text>
            {robots !== null && robotList.length === 0 && (
              <Typography.Text type="secondary">Chưa có robot gửi vị trí.</Typography.Text>
            )}
            {robots !== null && robotList.length > 0 && (
              <ul aria-label="Vị trí robot">
                {robotList.map((robot) => {
                  const node = nodeById.get(robot.current_qr_id)
                  return (
                    <li key={robot.id}>
                      <strong>{robot.id}</strong>
                      <span>{node ? `${node.node_name} (${node.qr_id})` : 'Chưa có node vị trí trong cấu hình'}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
