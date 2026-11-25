import { useState } from 'react'
import { Alert, Button, Form, Input, Modal, Select } from 'antd'
import DataState from '../common/DataState'
import { useApi } from '../../hooks/useApi'
import { getErrorMessage } from '../../services/api'
import { swapOrderTable } from '../../services/adminService'
import { getTables } from '../../services/tableService'

export default function OrderTableTransferModal({ onClose, onSaved }) {
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { data: tables, loading, error: tablesError, reload } = useApi(getTables)
  const availableTables = (tables ?? []).filter((table) => table.status === 'EMPTY')

  const submit = async (values) => {
    setError('')
    setSaving(true)
    try {
      await swapOrderTable(values.order_id.trim(), values.new_table_id)
      onSaved(`Đã chuyển đơn ${values.order_id.trim()} sang bàn ${values.new_table_id}.`)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      title="Chuyển đơn sang bàn trống"
      onCancel={onClose}
      footer={null}
      mask={{ closable: false }}
      destroyOnHidden
      width={520}
    >
      <Alert
        className="admin-form-error"
        type="info"
        showIcon
        title="Chỉ chuyển được đơn sang bàn đang trống."
      />
      {loading && tables === null && <DataState status="loading" message="Đang tải danh sách bàn..." />}
      {tablesError && tables === null && (
        <DataState status="error" error={tablesError} onRetry={() => reload()} />
      )}
      {tablesError && tables !== null && (
        <Alert
          className="admin-form-error"
          type="warning"
          showIcon
          title="Không thể làm mới danh sách bàn."
          description={tablesError}
          action={<Button onClick={() => reload()}>Thử lại</Button>}
        />
      )}
      {tables !== null && availableTables.length === 0 && (
        <Alert
          className="admin-form-error"
          type="warning"
          showIcon
          title="Hiện không có bàn trống."
          description="Đơn hàng chưa được thay đổi."
        />
      )}
      {tables !== null && availableTables.length > 0 && (
        <Form
          className="admin-entity-form"
          form={form}
          layout="vertical"
          onFinish={submit}
        >
          <Form.Item
            label="Mã đơn hàng"
            name="order_id"
            rules={[{ required: true, whitespace: true, message: 'Nhập mã đơn hàng.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Bàn mới"
            name="new_table_id"
            rules={[{ required: true, message: 'Chọn bàn trống.' }]}
          >
            <Select
              options={availableTables.map((table) => ({
                value: table.table_id,
                label: `Bàn ${String(table.table_number).padStart(2, '0')} · ${table.table_id}`,
              }))}
            />
          </Form.Item>
          {error && (
            <Alert
              className="admin-form-error"
              type="error"
              showIcon
              title="Không thể chuyển bàn."
              description={error}
            />
          )}
          <div className="admin-form-actions">
            <Button onClick={onClose} disabled={saving}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Chuyển đơn
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  )
}
