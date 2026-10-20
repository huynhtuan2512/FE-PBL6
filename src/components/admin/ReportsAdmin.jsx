import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Input, Row, Select, Space, Statistic, Table } from 'antd'
import { DownloadSimple } from '@phosphor-icons/react'
import DataState from '../common/DataState'
import SectionHeader from '../common/SectionHeader'
import { useApi } from '../../hooks/useApi'
import { getReportStaff, getSalesReport } from '../../services/invoiceService'
import { getErrorMessage } from '../../services/api'
import { downloadSalesWorkbook } from '../../utils/salesWorkbook'
import { formatVND } from '../../utils/format'

const now = new Date()
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
const PAYMENT_STATUSES = [
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'UNPAID', label: 'Chưa thanh toán' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền' },
]

export default function ReportsAdmin() {
  const [periodType, setPeriodType] = useState('month')
  const [month, setMonth] = useState(currentMonth)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [paymentStatus, setPaymentStatus] = useState()
  const [userId, setUserId] = useState()
  const [actionError, setActionError] = useState('')

  const params = useMemo(() => {
    const filters = {}
    if (periodType === 'month' && month) {
      const [year, selectedMonth] = month.split('-')
      filters.year = Number(year)
      filters.month = Number(selectedMonth)
    } else {
      if (dateFrom) filters.date_from = dateFrom
      if (dateTo) filters.date_to = dateTo
    }
    if (paymentStatus) filters.payment_status = paymentStatus
    if (userId) filters.user_id = userId
    return filters
  }, [dateFrom, dateTo, month, paymentStatus, periodType, userId])

  const reportState = useApi(() => getSalesReport(params))
  const staffState = useApi(getReportStaff)
  const filterKey = JSON.stringify(params)
  const initialFilterLoad = useRef(true)

  useEffect(() => {
    if (initialFilterLoad.current) {
      initialFilterLoad.current = false
      return
    }
    reportState.reload()
  }, [filterKey, reportState.reload])

  const report = reportState.data
  const columns = [
    { title: 'Mã hóa đơn', dataIndex: 'invoice_id', key: 'invoice_id' },
    { title: 'Mã đơn', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Bàn', dataIndex: 'table_id', key: 'table_id' },
    { title: 'Nhân viên', dataIndex: 'staff_name', key: 'staff_name', render: (value) => value || 'Tài khoản đã xóa' },
    { title: 'Tổng tiền', dataIndex: 'total_amount', key: 'total_amount', render: formatVND },
    { title: 'Giảm giá', dataIndex: 'discount_amount', key: 'discount_amount', render: formatVND },
    { title: 'Thực thu', dataIndex: 'final_amount', key: 'final_amount', render: formatVND },
    { title: 'Thanh toán', dataIndex: 'payment_status', key: 'payment_status', render: (value) => PAYMENT_STATUSES.find((item) => item.value === value)?.label ?? value },
    { title: 'Phương thức', dataIndex: 'payment_method', key: 'payment_method' },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (value) => value ? new Date(value).toLocaleString('vi-VN') : '—',
    },
  ]

  const exportWorkbook = async () => {
    if (!report) return
    setActionError('')
    try {
      await downloadSalesWorkbook(report, {
        period: periodType === 'month' ? month : `range_${dateFrom || 'all'}_${dateTo || 'all'}`,
        paymentStatus: PAYMENT_STATUSES.find((item) => item.value === paymentStatus)?.label ?? 'Tất cả',
        staffName: staffState.data?.find((staff) => staff.user_id === userId)?.full_name ?? 'Tất cả',
      })
    } catch (error) {
      setActionError(getErrorMessage(error))
    }
  }

  return (
    <section className="admin-section">
      <SectionHeader
        title="Báo cáo doanh thu"
        className="admin-section-header"
        extra={(
          <Button
            type="primary"
            icon={<DownloadSimple size={17} />}
            disabled={!report?.rows.length}
            onClick={exportWorkbook}
          >
            Xuất Excel
          </Button>
        )}
      />

      <Space className="admin-report-filters" wrap>
        <Select
          aria-label="Chọn kiểu lọc thời gian"
          value={periodType}
          onChange={setPeriodType}
          options={[
            { value: 'month', label: 'Theo tháng' },
            { value: 'range', label: 'Khoảng ngày' },
          ]}
          style={{ width: 150 }}
        />
        {periodType === 'month' ? (
          <Input
            aria-label="Tháng báo cáo"
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            style={{ width: 180 }}
          />
        ) : (
          <>
            <Input
              aria-label="Từ ngày"
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              style={{ width: 180 }}
            />
            <Input
              aria-label="Đến ngày"
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              style={{ width: 180 }}
            />
          </>
        )}
        <Select
          aria-label="Lọc trạng thái thanh toán"
          allowClear
          placeholder="Tất cả trạng thái"
          value={paymentStatus}
          onChange={setPaymentStatus}
          options={PAYMENT_STATUSES}
          style={{ width: 190 }}
        />
        <Select
          aria-label="Lọc theo nhân viên"
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="Tất cả nhân viên"
          value={userId}
          onChange={setUserId}
          loading={staffState.loading}
          options={(staffState.data ?? []).map((staff) => ({
            value: staff.user_id,
            label: `${staff.full_name} (${staff.role_name === 'ADMIN' ? 'Quản trị' : 'Nhân viên'})`,
          }))}
          style={{ width: 240 }}
        />
      </Space>

      {staffState.error && (
        <Alert
          className="admin-action-error"
          type="warning"
          showIcon
          title="Không thể tải danh sách nhân viên để lọc."
          description={staffState.error}
          action={<Button onClick={() => staffState.reload()}>Thử lại</Button>}
        />
      )}
      {actionError && (
        <Alert
          className="admin-action-error"
          type="error"
          showIcon
          title="Không thể xuất báo cáo."
          description={actionError}
          closable
          onClose={() => setActionError('')}
        />
      )}
      {reportState.loading && report === null && <DataState status="loading" message="Đang tải báo cáo..." />}
      {reportState.error && report === null && (
        <DataState status="error" error={reportState.error} onRetry={() => reportState.reload()} />
      )}
      {reportState.error && report && (
        <Alert
          className="admin-action-error"
          type="warning"
          showIcon
          title="Không thể cập nhật bộ lọc báo cáo."
          description={reportState.error}
          action={<Button onClick={() => reportState.reload()}>Thử lại</Button>}
        />
      )}
      {report && (
        <>
          <Row gutter={[12, 12]} className="admin-report-metrics">
            <Col xs={12} xl={6}><Card size="small"><Statistic title="Hóa đơn" value={report.invoice_count} /></Card></Col>
            <Col xs={12} xl={6}><Card size="small"><Statistic title="Đã thanh toán" value={report.paid_count} /></Card></Col>
            <Col xs={12} xl={6}><Card size="small"><Statistic title="Đã hoàn tiền" value={report.refunded_count} /></Card></Col>
            <Col xs={12} xl={6}><Card size="small"><Statistic title="Doanh thu đã thu" value={formatVND(report.revenue)} /></Card></Col>
          </Row>
          <Table
            className="admin-data-table"
            rowKey="invoice_id"
            columns={columns}
            dataSource={report.rows}
            loading={reportState.loading}
            pagination={{ pageSize: 20, showSizeChanger: false }}
            scroll={{ x: 1200 }}
            locale={{ emptyText: 'Không có hóa đơn phù hợp với bộ lọc.' }}
          />
        </>
      )}
    </section>
  )
}
