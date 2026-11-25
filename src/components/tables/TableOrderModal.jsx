import { useState } from 'react'
import { Alert, Button, Form, Input, InputNumber, Modal, Select, Space } from 'antd'
import DataState from '../common/DataState'
import { getErrorMessage } from '../../services/api'
import { createOrder } from '../../services/orderService'
import { formatVND } from '../../utils/format'

export default function TableOrderModal({
  table,
  dishes,
  dishesLoading,
  dishesError,
  onRetryDishes,
  user,
  onClose,
  onSaved,
}) {
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const availableDishes = (dishes ?? []).filter((dish) => dish.is_available)

  const submit = async (values) => {
    setError('')
    setSaving(true)
    try {
      await createOrder({
        table_id: Number(table.table_id),
        created_by_user_id: user?.user_id == null ? undefined : String(user.user_id),
        items: values.items.map((item) => ({
          dish_id: item.dish_id,
          quantity: item.quantity,
          notes: item.notes?.trim() || null,
        })),
      })
      onSaved(`Đã tạo đơn cho bàn ${String(table.table_number).padStart(2, '0')}.`)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      title={`Đặt món · Bàn ${String(table.table_number).padStart(2, '0')}`}
      onCancel={onClose}
      footer={null}
      mask={{ closable: false }}
      destroyOnHidden
      width={640}
    >
      <p className="staff-order-modal-copy">
        Chọn các món và số lượng. Bàn sẽ chuyển sang trạng thái đang dùng sau khi tạo đơn thành công.
      </p>
      {dishesLoading && dishes === null && (
        <DataState status="loading" message="Đang tải thực đơn..." />
      )}
      {dishesError && dishes === null && (
        <DataState status="error" error={dishesError} onRetry={onRetryDishes} />
      )}
      {dishesError && dishes !== null && (
        <Alert
          className="admin-form-error"
          type="warning"
          showIcon
          title="Không thể làm mới thực đơn."
          description="Đang hiển thị danh sách món đã tải trước đó."
          action={<Button onClick={onRetryDishes}>Thử lại</Button>}
        />
      )}
      {dishes !== null && availableDishes.length === 0 && (
        <Alert
          className="admin-form-error"
          type="warning"
          showIcon
          title="Chưa có món nào đang bán."
          description="Hãy thử tải lại thực đơn hoặc kiểm tra trạng thái món trong quản trị."
        />
      )}
      {dishes !== null && (
        <Form
          form={form}
          layout="vertical"
          initialValues={{ items: [{ quantity: 1 }] }}
          onFinish={submit}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...field }) => (
                  <Space key={key} align="start" className="staff-order-item-row" wrap>
                    <Form.Item
                      {...field}
                      name={[name, 'dish_id']}
                      label="Món"
                      rules={[{ required: true, message: 'Chọn món ăn.' }]}
                    >
                      <Select
                        className="staff-order-dish-select"
                        placeholder="Chọn món"
                        options={availableDishes.map((dish) => ({
                          value: dish.dish_id,
                          label: `${dish.dish_name} · ${formatVND(dish.price)}`,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[name, 'quantity']}
                      label="Số lượng"
                      rules={[{ required: true, message: 'Nhập số lượng.' }]}
                    >
                      <InputNumber min={1} precision={0} />
                    </Form.Item>
                    <Form.Item {...field} name={[name, 'notes']} label="Ghi chú">
                      <Input placeholder="Ít cay, không hành..." />
                    </Form.Item>
                    <Button
                      className="staff-order-remove-item"
                      danger
                      disabled={fields.length === 1}
                      onClick={() => remove(name)}
                    >
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button onClick={() => add({ quantity: 1 })} disabled={availableDishes.length === 0}>
                  Thêm món
                </Button>
              </>
            )}
          </Form.List>
          {error && (
            <Alert
              className="admin-form-error"
              type="error"
              showIcon
              title="Không thể tạo đơn hàng."
              description={error}
            />
          )}
          <div className="admin-form-actions">
            <Button onClick={onClose} disabled={saving}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              disabled={availableDishes.length === 0}
            >
              Tạo đơn
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  )
}
