import { useMemo, useState } from 'react'
import { Alert, Button, Input, Space, Table, Tabs, Tag, Typography } from 'antd'
import {
  ChartLineUp as ChartNoAxesCombined,
  FileText as FileClock,
  List as Menu,
  Pencil,
  Plus,
  ShieldCheck,
  User as UserRound,
} from '@phosphor-icons/react'
import OrderTableTransferModal from '../components/tables/OrderTableTransferModal'
import CategoryAdmin from '../components/admin/CategoryAdmin'
import DishFormModal from '../components/admin/DishFormModal'
import ReportsAdmin from '../components/admin/ReportsAdmin'
import UserFormModal from '../components/admin/UserFormModal'
import ContentPanel from '../components/common/ContentPanel'
import DataState from '../components/common/DataState'
import PageHeader from '../components/common/PageHeader'
import SectionHeader from '../components/common/SectionHeader'
import { useApi } from '../hooks/useApi'
import { getAdminDishes, setDishStatus } from '../services/dishService'
import { getAuditLogs, getUsers } from '../services/adminService'
import { assetUrl, getErrorMessage } from '../services/api'
import { formatClock, formatVND } from '../utils/format'
import './admin-workspace.css'

const USER_ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  STAFF: 'Nhân viên',
  CUSTOMER: 'Khách hàng',
}

const getUserRoleLabel = (role) => USER_ROLE_LABELS[role] ?? role ?? 'Chưa xác định'

const adminSections = [
  { key: 'menu', label: 'Thực đơn', icon: Menu },
  { key: 'categories', label: 'Danh mục món', icon: Menu },
  { key: 'users', label: 'Tài khoản & phân quyền', icon: UserRound },
  { key: 'logs', label: 'Nhật ký hệ thống', icon: FileClock },
  { key: 'reports', label: 'Báo cáo', icon: ChartNoAxesCombined },
]

export default function AdminWorkspace({ onNotify }) {
  const [activeSection, setActiveSection] = useState('menu')
  const [transferOpen, setTransferOpen] = useState(false)

  return (
    <div className="page-content admin-workspace">
      <PageHeader
        eyebrow={<><ShieldCheck size={14} /> Quản trị</>}
        title="Quản trị hệ thống"
        description="Quản lý thực đơn, tài khoản và cấu hình vận hành."
        extra={(
          <Space wrap>
            <Button onClick={() => setTransferOpen(true)}>
              Chuyển đơn sang bàn
            </Button>
          </Space>
        )}
      />
      <ContentPanel className="admin-panel">
        <Tabs
          className="admin-tabs"
          activeKey={activeSection}
          onChange={setActiveSection}
          items={adminSections.map(({ key, label, icon: Icon }) => ({
            key,
            label: <span className="admin-tab-label"><Icon size={16} />{label}</span>,
            children: key === 'menu'
              ? <MenuAdmin onNotify={onNotify} />
              : key === 'users'
                ? <UsersAdmin onNotify={onNotify} />
                : key === 'categories'
                  ? <CategoryAdmin onNotify={onNotify} />
                : key === 'logs'
                  ? <AuditLogs />
                  : <ReportsAdmin />,
          }))}
        />
      </ContentPanel>
      {transferOpen && (
        <OrderTableTransferModal
          onClose={() => setTransferOpen(false)}
          onSaved={(message) => {
            setTransferOpen(false)
            onNotify(message)
          }}
        />
      )}
    </div>
  )
}

function MenuAdmin({ onNotify }) {
  const { data: dishes, loading, error, reload } = useApi(getAdminDishes)
  const [editing, setEditing] = useState(undefined)
  const [statusChanging, setStatusChanging] = useState(null)
  const [actionError, setActionError] = useState('')

  const toggleAvailability = async (dish) => {
    setStatusChanging(dish.dish_id)
    setActionError('')
    try {
      await setDishStatus(dish.dish_id, !dish.is_available)
      onNotify(`Đã ${dish.is_available ? 'ngừng bán' : 'mở bán'} "${dish.dish_name}".`)
      await reload({ silent: true })
    } catch (requestError) {
      setActionError(getErrorMessage(requestError))
    } finally {
      setStatusChanging(null)
    }
  }

  const columns = [
    {
      title: 'Món ăn',
      dataIndex: 'dish_name',
      key: 'dish_name',
      render: (name, dish) => (
        <Space className="admin-dish-name" size="middle">
          {dish.image_url
            ? <img src={assetUrl(dish.image_url)} alt="" />
            : <span className="admin-dish-image-placeholder" aria-hidden="true" />}
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: formatVND,
    },
    {
      title: 'Nhãn AI',
      dataIndex: 'ai_label_id',
      key: 'ai_label_id',
      render: (value) => value || '—',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_available',
      key: 'is_available',
      render: (available, dish) => (
        <Space size="small">
          <Tag color={available ? 'success' : 'default'}>
            {available ? 'Đang bán' : 'Ngừng bán'}
          </Tag>
          <Button
            size="small"
            loading={statusChanging === dish.dish_id}
            disabled={statusChanging !== null && statusChanging !== dish.dish_id}
            onClick={() => toggleAvailability(dish)}
          >
            {available ? 'Ngừng bán' : 'Mở bán'}
          </Button>
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right',
      render: (_, dish) => (
        <Button
          aria-label={`Sửa ${dish.dish_name}`}
          icon={<Pencil size={16} />}
          onClick={() => setEditing(dish)}
        >
          Sửa
        </Button>
      ),
    },
  ]

  return (
    <section className="admin-section">
      <SectionHeader
        eyebrow={dishes ? `${dishes.filter((dish) => dish.is_available).length} món đang bán · ${dishes.length} tổng số` : 'Thực đơn'}
        title="Thực đơn và nhãn AI"
        className="admin-section-header"
        extra={(
          <Button type="primary" icon={<Plus size={17} />} onClick={() => setEditing(null)}>
            Thêm món
          </Button>
        )}
      />
      <Alert
        className="admin-action-error"
        type="info"
        showIcon
        title="Danh sách gồm cả món đang bán và đã ngừng bán."
        description="Dùng nút trạng thái trên từng món để mở bán hoặc ngừng bán."
      />
      {actionError && (
        <Alert
          className="admin-action-error"
          type="error"
          showIcon
          title="Không thể cập nhật trạng thái món."
          description={actionError}
          closable
          onClose={() => setActionError('')}
        />
      )}
      {loading && dishes === null && <DataState status="loading" message="Đang tải thực đơn..." />}
      {error && dishes === null && <DataState status="error" error={error} onRetry={() => reload()} />}
      {error && dishes && (
        <Alert
          className="admin-action-error"
          type="warning"
          showIcon
          title="Không thể đồng bộ thực đơn mới nhất."
          description={error}
          action={<Button onClick={() => reload()}>Thử lại</Button>}
        />
      )}
      {dishes && (
        <Table
          className="admin-data-table"
          rowKey="dish_id"
          columns={columns}
          dataSource={dishes}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 760 }}
          locale={{ emptyText: 'Chưa có món nào trong thực đơn.' }}
        />
      )}
      {editing !== undefined && (
        <DishFormModal
          dish={editing}
          onClose={() => setEditing(undefined)}
          onSaved={(message, tone) => {
            setEditing(undefined)
            onNotify(message, tone ?? 'success')
            reload({ silent: true })
          }}
        />
      )}
    </section>
  )
}

function UsersAdmin({ onNotify }) {
  const { data, loading, error, reload } = useApi(() => getUsers({ page: 1, page_size: 100 }))
  const [editing, setEditing] = useState(undefined)
  const [searchText, setSearchText] = useState('')
  const users = data?.items ?? []
  const filteredUsers = useMemo(() => {
    const search = searchText.trim().toLocaleLowerCase('vi')
    if (!search) return users
    return users.filter((user) =>
      [user.username, user.full_name, user.phone, user.role_name, getUserRoleLabel(user.role_name)]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase('vi').includes(search)),
    )
  }, [searchText, users])

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, user) => (
        <div className="admin-user-name">
          <Typography.Text strong>{user.full_name}</Typography.Text>
          <Typography.Text type="secondary">@{user.username}</Typography.Text>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (role) => <Tag>{getUserRoleLabel(role)}</Tag>,
    },
    {
      title: 'Liên hệ',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || '—',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active) => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? 'Đang hoạt động' : 'Đã khóa'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right',
      render: (_, user) => (
        <Button
          aria-label={`Chỉnh sửa ${user.username}`}
          icon={<Pencil size={16} />}
          onClick={() => setEditing(user)}
        >
          Sửa
        </Button>
      ),
    },
  ]

  return (
    <section className="admin-section">
      <SectionHeader
        eyebrow={`${users.length} tài khoản đã tải`}
        title="Tài khoản và phân quyền"
        className="admin-section-header"
        extra={(
          <Space wrap>
            <Input.Search
              className="admin-user-search"
              placeholder="Tìm tên, tên đăng nhập, số điện thoại hoặc vai trò"
              aria-label="Tìm tài khoản"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              allowClear
            />
            <Button type="primary" icon={<Plus size={17} />} onClick={() => setEditing(null)}>
              Tạo tài khoản
            </Button>
          </Space>
        )}
      />
      {loading && data === null && <DataState status="loading" message="Đang tải tài khoản..." />}
      {error && data === null && <DataState status="error" error={error} onRetry={() => reload()} />}
      {error && data && (
        <Alert
          className="admin-action-error"
          type="warning"
          showIcon
          title="Không thể đồng bộ danh sách tài khoản mới nhất."
          description={error}
          action={<Button onClick={() => reload()}>Thử lại</Button>}
        />
      )}
      {data && (
        <>
          <Typography.Text className="admin-result-count" type="secondary">
            Hiển thị {filteredUsers.length} trong tối đa {users.length} tài khoản đã tải.
          </Typography.Text>
          <Table
            className="admin-data-table"
            rowKey="user_id"
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: 720 }}
            locale={{ emptyText: searchText ? 'Không tìm thấy tài khoản phù hợp.' : 'Chưa có tài khoản nào.' }}
          />
        </>
      )}
      {editing !== undefined && (
        <UserFormModal
          user={editing}
          onClose={() => setEditing(undefined)}
          onSaved={(message) => {
            setEditing(undefined)
            onNotify(message)
            reload({ silent: true })
          }}
        />
      )}
    </section>
  )
}

function AuditLogs() {
  const { data: logs, loading, error, reload } = useApi(getAuditLogs)
  const columns = [
    { title: 'Thời gian', dataIndex: 'created_at', key: 'created_at', render: (value) => value ? formatClock(value) : '—' },
    { title: 'Người dùng', dataIndex: 'user_id', key: 'user_id', render: (value) => value ?? 'Hệ thống' },
    { title: 'Hành động', dataIndex: 'action', key: 'action' },
    { title: 'Bảng dữ liệu', dataIndex: 'table_name', key: 'table_name' },
    { title: 'Chi tiết', dataIndex: 'description', key: 'description' },
  ]

  return (
    <section className="admin-section">
      <SectionHeader
        eyebrow="Tối đa 100 bản ghi mới nhất"
        title="Nhật ký hệ thống"
        className="admin-section-header"
      />
      {loading && logs === null && <DataState status="loading" message="Đang tải nhật ký hệ thống..." />}
      {error && logs === null && <DataState status="error" error={error} onRetry={() => reload()} />}
      {error && logs && (
        <Alert
          className="admin-action-error"
          type="warning"
          showIcon
          title="Không thể đồng bộ nhật ký mới nhất."
          description={error}
          action={<Button onClick={() => reload()}>Thử lại</Button>}
        />
      )}
      {logs && (
        <Table
          className="admin-data-table"
          rowKey="log_id"
          columns={columns}
          dataSource={logs}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 680 }}
          locale={{ emptyText: 'Chưa có nhật ký hệ thống.' }}
        />
      )}
    </section>
  )
}
