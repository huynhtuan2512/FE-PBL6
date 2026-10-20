import { useState } from 'react'
import { Alert, Button, Form, Input, Modal } from 'antd'
import { swapRoutingTables } from '../../services/adminService'
import { getErrorMessage } from '../../services/api'

export default function TableSwapModal({ onClose, onSaved }) {
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (values) => {
    const tableA = values.table_a_id.trim()
    const tableB = values.table_b_id.trim()
    if (tableA === tableB) {
      form.setFields([{ name: 'table_b_id', errors: ['Hai bàn phải khác nhau.'] }])
      return
    }

    setError('')
    setSaving(true)
    try {
      const response = await swapRoutingTables(tableA, tableB)
      onSaved(`Đã hoán đổi ma trận định tuyến (${response?.updated ?? 0} dòng cập nhật).`)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      title="Đổi cấu hình tuyến giữa hai bàn"
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
        title="Thao tác này chỉ hoán đổi ma trận định tuyến."
        description="Mã QR dưới sàn và trạng thái bàn không thay đổi. Nhập đúng mã bàn trong hệ thống."
      />
      <Form
        className="admin-entity-form"
        form={form}
        layout="vertical"
        onFinish={submit}
      >
        <Form.Item
          label="Mã bàn thứ nhất"
          name="table_a_id"
          rules={[{ required: true, whitespace: true, message: 'Nhập mã bàn thứ nhất.' }]}
        >
          <Input autoFocus placeholder="Ví dụ: TABLE_01" />
        </Form.Item>
        <Form.Item
          label="Mã bàn thứ hai"
          name="table_b_id"
          rules={[{ required: true, whitespace: true, message: 'Nhập mã bàn thứ hai.' }]}
        >
          <Input placeholder="Ví dụ: TABLE_02" />
        </Form.Item>
        {error && (
          <Alert
            className="admin-form-error"
            type="error"
            showIcon
            title="Không thể đổi cấu hình tuyến."
            description={error}
          />
        )}
        <div className="admin-form-actions">
          <Button onClick={onClose} disabled={saving}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            {saving ? 'Đang cập nhật...' : 'Đổi cấu hình tuyến'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
