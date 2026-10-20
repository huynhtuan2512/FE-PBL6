import { useCallback } from 'react'
import { Alert, Button, Space, Tag, Typography } from 'antd'
import {
  ArrowsClockwise,
  ClipboardText as ClipboardCheck,
  CookingPot,
  Plus,
  ForkKnife as Utensils,
  Wallet as WalletCards,
} from '@phosphor-icons/react'
import ContentPanel from '../components/common/ContentPanel'
import DataState from '../components/common/DataState'
import PageHeader from '../components/common/PageHeader'
import SectionHeader from '../components/common/SectionHeader'
import KitchenKDS from '../components/kitchen/KitchenKDS'
import POSCheckout from '../components/pos/POSCheckout'
import { useApi } from '../hooks/useApi'
import { getOrders } from '../services/orderService'
import { getDishes } from '../services/dishService'
import { getRobotStatuses } from '../services/robotService'
import { formatClock } from '../utils/format'
import './staff-workspace.css'

export default function StaffWorkspace({ onNotify }) {
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    reload: reloadOrders,
    lastUpdated: ordersUpdatedAt,
  } = useApi(getOrders, { interval: 5000 })
  const {
    data: dishes,
    loading: dishesLoading,
    error: dishesError,
    reload: reloadDishes,
  } = useApi(getDishes, { interval: 30000 })
  const {
    data: robots,
    loading: robotsLoading,
    error: robotsError,
    reload: reloadRobots,
    lastUpdated: robotsUpdatedAt,
  } = useApi(getRobotStatuses, { interval: 5000 })

  const refresh = useCallback(() => reloadOrders({ silent: true }), [reloadOrders])
  const refreshAll = () => {
    reloadOrders()
    reloadDishes()
    reloadRobots()
  }

  const ticketCount = (orders ?? []).filter((order) =>
    ['PENDING', 'PREPARING'].includes(order.order_status),
  ).length
  const isRefreshing = ordersLoading || dishesLoading || robotsLoading

  return (
    <div className="page-content staff-workspace">
      <PageHeader
        eyebrow={<><Utensils size={14} /> Không gian phục vụ</>}
        title="Không gian phục vụ"
        description="Theo dõi bàn, xử lý món tại bếp và hoàn tất đơn tại quầy."
        extra={(
          <div className="staff-page-actions">
            <Space orientation="vertical" size={0} className="staff-update-times">
              <Typography.Text type={ordersError ? 'danger' : 'secondary'}>
                Đơn hàng: {ordersUpdatedAt ? formatClock(ordersUpdatedAt) : 'Chưa cập nhật'}
              </Typography.Text>
              <Typography.Text type={robotsError ? 'danger' : 'secondary'}>
                Robot: {robotsUpdatedAt ? formatClock(robotsUpdatedAt) : 'Chưa cập nhật'}
              </Typography.Text>
            </Space>
            <Button icon={<ArrowsClockwise size={17} />} loading={isRefreshing} onClick={refreshAll}>
              Làm mới
            </Button>
          </div>
        )}
      />

      <ContentPanel className="staff-tables-panel">
        <SectionHeader
          eyebrow="Sảnh"
          title="Trạng thái bàn"
          className="staff-section-header"
          extra={<Tag color="default">Chưa đồng bộ</Tag>}
        />
        <Alert
          type="info"
          showIcon
          title="Hệ thống chưa cung cấp danh sách và trạng thái bàn."
          description="Không hiển thị bàn mẫu để tránh nhầm với dữ liệu vận hành. Đặt bàn chưa khả dụng."
          action={(
            <Button disabled icon={<Plus size={16} />}>
              Đặt bàn
            </Button>
          )}
        />
        <div className="staff-unavailable-state">
          <DataState status="empty" message="Chưa có dữ liệu bàn từ hệ thống." />
        </div>
      </ContentPanel>

      {(dishesLoading || dishesError) && (
        <div className="staff-menu-state">
          {dishesLoading && <DataState status="loading" message="Đang tải tên món..." />}
          {dishesError && (
            <DataState
              status="error"
              message="Không thể tải thực đơn; các món trong đơn sẽ hiển thị theo mã."
              error={dishesError}
              onRetry={() => reloadDishes()}
            />
          )}
        </div>
      )}

      {ordersError && orders && (
        <Alert
          type="warning"
          showIcon
          title="Không thể đồng bộ đơn hàng mới."
          description={`Đang giữ dữ liệu đã tải lúc ${ordersUpdatedAt ? formatClock(ordersUpdatedAt) : 'chưa xác định'}.`}
          action={<Button onClick={() => reloadOrders()}>Thử lại</Button>}
        />
      )}

      <div className="staff-workflow-grid">
        <ContentPanel className="staff-kitchen-panel">
          <SectionHeader
            eyebrow={<><CookingPot size={14} /> Bếp</>}
            title="Món cần hoàn tất"
            className="staff-section-header"
            extra={<Tag color="processing">{ticketCount} đơn</Tag>}
          />
          <KitchenKDS
            orders={orders}
            dishes={dishes}
            robots={robots}
            robotsLoading={robotsLoading}
            robotsError={robotsError}
            onChanged={refresh}
            onRetry={() => reloadOrders()}
            onNotify={onNotify}
            loading={ordersLoading}
            error={ordersError}
          />
        </ContentPanel>

        <ContentPanel className="staff-checkout-panel">
          <SectionHeader
            eyebrow={<><WalletCards size={14} /> Thu ngân</>}
            title="Thanh toán"
            className="staff-section-header"
          />
          <POSCheckout
            orders={orders}
            dishes={dishes}
            onChanged={refresh}
            onRetry={() => reloadOrders()}
            onNotify={onNotify}
            loading={ordersLoading}
            error={ordersError}
          />
          <Typography.Paragraph className="staff-payment-note" type="secondary">
            Hiện hệ thống chỉ cập nhật trạng thái đơn sang Hoàn tất; chưa ghi nhận phương thức hoặc giao dịch thanh toán.
          </Typography.Paragraph>
        </ContentPanel>
      </div>

      <ContentPanel className="staff-ai-panel">
        <SectionHeader
          eyebrow={<><ClipboardCheck size={14} /> Kiểm tra khay</>}
          title="Đối chiếu món trước khi giao"
          className="staff-section-header"
          extra={<Button disabled>Kiểm tra khay AI</Button>}
        />
        <Typography.Text type="secondary">
          Chưa kết nối camera hoặc chức năng xác minh khay. Kết quả quét không được mô phỏng trên màn hình vận hành.
        </Typography.Text>
      </ContentPanel>
    </div>
  )
}
