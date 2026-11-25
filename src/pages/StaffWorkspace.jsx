import { useCallback, useMemo, useState } from 'react'
import { Alert, Button, Input, Space, Tag, Typography } from 'antd'
import {
  ArrowsClockwise,
  ClipboardText as ClipboardCheck,
  CookingPot,
  ForkKnife as Utensils,
  Wallet as WalletCards,
} from '@phosphor-icons/react'
import ContentPanel from '../components/common/ContentPanel'
import DataState from '../components/common/DataState'
import PageHeader from '../components/common/PageHeader'
import SectionHeader from '../components/common/SectionHeader'
import KitchenKDS from '../components/kitchen/KitchenKDS'
import POSCheckout from '../components/pos/POSCheckout'
import TableGrid from '../components/tables/TableGrid'
import TableOrderModal from '../components/tables/TableOrderModal'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../hooks/useApi'
import { getOrders } from '../services/orderService'
import { getDishes } from '../services/dishService'
import { getTables } from '../services/tableService'
import { getRobots } from '../services/robotService'
import { formatClock } from '../utils/format'
import './staff-workspace.css'

export default function StaffWorkspace({ onNotify }) {
  const [orderSearch, setOrderSearch] = useState('')
  const [selectedTable, setSelectedTable] = useState(null)
  const { currentUser } = useAuth()
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
    data: tables,
    loading: tablesLoading,
    error: tablesError,
    reload: reloadTables,
  } = useApi(getTables, { interval: 30000 })
  const {
    data: robots,
    loading: robotsLoading,
    error: robotsError,
    reload: reloadRobots,
  } = useApi(getRobots, { interval: 5000 })

  const refresh = useCallback(
    () => Promise.all([
      reloadOrders({ silent: true }),
      reloadTables({ silent: true }),
      reloadRobots({ silent: true }),
    ]),
    [reloadOrders, reloadTables, reloadRobots],
  )
  const refreshAll = () => {
    reloadOrders()
    reloadDishes()
    reloadTables()
    reloadRobots()
  }

  const matchingOrders = useMemo(
    () => orders === null ? null : orders.filter((order) => matchesOrderSearch(order, orderSearch)),
    [orders, orderSearch],
  )
  const isRefreshing = ordersLoading || dishesLoading || tablesLoading || robotsLoading
  const ticketCount = (matchingOrders ?? []).filter((order) =>
    ['PENDING', 'DELIVERING'].includes(order.order_status),
  ).length

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
                Robot: {robotsError ? 'Lỗi đồng bộ' : `${(robots ?? []).filter((robot) => robot.online).length}/${(robots ?? []).length} online`}
              </Typography.Text>
            </Space>
            <Input.Search
              className="staff-order-search"
              aria-label="Tìm đơn theo mã đơn hoặc mã bàn"
              placeholder="Tìm mã đơn hoặc bàn"
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.target.value)}
              allowClear
            />
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
          extra={(
            <Tag color={tablesError ? 'error' : 'default'}>
              {tablesLoading && tables === null ? 'Đang tải' : tablesError ? 'Lỗi đồng bộ' : `${tables?.length ?? 0} bàn`}
            </Tag>
          )}
        />
        {tablesLoading && tables === null && <DataState status="loading" message="Đang tải trạng thái bàn..." />}
        {tablesError && tables === null && (
          <DataState status="error" error={tablesError} onRetry={() => reloadTables()} />
        )}
        {tablesError && tables !== null && (
          <Alert
            type="warning"
            showIcon
            title="Không thể đồng bộ trạng thái bàn mới nhất."
            description="Đang hiển thị dữ liệu đã tải trước đó."
            action={<Button onClick={() => reloadTables()}>Thử lại</Button>}
          />
        )}
        {tables && <TableGrid tables={tables} onSelectTable={setSelectedTable} />}
      </ContentPanel>

      {selectedTable && (
        <TableOrderModal
          table={selectedTable}
          dishes={dishes}
          dishesLoading={dishesLoading}
          dishesError={dishesError}
          onRetryDishes={() => reloadDishes()}
          user={currentUser}
          onClose={() => setSelectedTable(null)}
          onSaved={(message) => {
            setSelectedTable(null)
            onNotify(message)
            refresh()
          }}
        />
      )}

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
            title="Trạng thái phục vụ món"
            className="staff-section-header"
            extra={<Tag color="processing">{ticketCount} đơn</Tag>}
          />
          <KitchenKDS
            orders={matchingOrders}
            dishes={dishes}
            robots={robots}
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
            orders={matchingOrders}
            dishes={dishes}
            onChanged={refresh}
            onRetry={() => reloadOrders()}
            onNotify={onNotify}
            loading={ordersLoading}
            error={ordersError}
          />
          <Typography.Paragraph className="staff-payment-note" type="secondary">
            Thanh toán tiền mặt sẽ tạo hóa đơn và chuyển đơn sang Hoàn tất.
          </Typography.Paragraph>
        </ContentPanel>
      </div>

      <ContentPanel className="staff-ai-panel">
        <SectionHeader
          eyebrow={<><ClipboardCheck size={14} /> Tích hợp robot</>}
          title="Theo dõi robot"
          className="staff-section-header"
        />
        {robotsLoading && robots === null && <DataState status="loading" message="Đang tải trạng thái robot..." />}
        {robotsError && robots === null && (
          <DataState status="error" error={robotsError} onRetry={() => reloadRobots()} />
        )}
        {robotsError && robots !== null && (
          <Alert
            type="warning"
            showIcon
            title="Không thể đồng bộ trạng thái robot."
            description="Đang hiển thị dữ liệu đã tải trước đó."
            action={<Button onClick={() => reloadRobots()}>Thử lại</Button>}
          />
        )}
        {robots && robots.length === 0 && (
          <DataState status="empty" message="Chưa có robot trong cơ sở dữ liệu." />
        )}
        {robots && robots.length > 0 && (
          <div className="staff-robot-list">
            {robots.map((robot) => (
              <div className="staff-robot-row" key={robot.robot_id}>
                <div>
                  <Typography.Text strong>{robot.robot_id}</Typography.Text>
                  <Typography.Text type="secondary">
                    {robot.delivery_status || 'Chưa xác định'}
                    {robot.table_number ? ` · Bàn ${robot.table_number}` : ''}
                    {robot.order_id ? ` · ${robot.order_id}` : ''}
                  </Typography.Text>
                </div>
                <Tag color={robot.online ? 'success' : 'default'}>
                  {robot.online ? 'Online' : 'Offline'}
                </Tag>
              </div>
            ))}
          </div>
        )}
      </ContentPanel>
    </div>
  )
}

function matchesOrderSearch(order, search) {
  const term = search.trim().toLocaleLowerCase()
  return !term
    || String(order.order_id).toLocaleLowerCase().includes(term)
    || String(order.table_id).toLocaleLowerCase().includes(term)
}
