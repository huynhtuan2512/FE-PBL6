import { useState } from 'react'
import { Alert, Button, Form, Input, InputNumber, Modal, Select, Switch, Typography } from 'antd'
import { createDish, getCategories, updateDish } from '../../services/dishService'
import { assetUrl, getErrorMessage } from '../../services/api'
import { useApi } from '../../hooks/useApi'

export default function DishFormModal({ dish, onClose, onSaved }) {
  const editing = Boolean(dish)
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const imageUrl = Form.useWatch('image_url', form)
  const { data: categories, loading: categoriesLoading, error: categoriesError, reload: reloadCategories } = useApi(getCategories)

  const submit = async (values) => {
    setError('')
    setSaving(true)
    const payload = {
      category_id: values.category_id,
      dish_name: values.dish_name.trim(),
      price: values.price,
      is_available: values.is_available,
      image_url: values.image_url?.trim() || null,
      description: values.description?.trim() || null,
    }
    try {
      if (editing) {
        await updateDish(dish.dish_id, payload)
      } else {
        await createDish(payload)
      }
      onSaved(editing ? `Đã cập nhật "${payload.dish_name}".` : `Đã thêm món "${payload.dish_name}".`)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      title={editing ? 'Sửa món ăn' : 'Thêm món mới'}
      onCancel={onClose}
      footer={null}
      mask={{ closable: false }}
      destroyOnHidden
      width={640}
    >
      <Typography.Text type="secondary">
        {editing ? `Mã món: ${dish.dish_id}` : 'Thông tin món mới trong thực đơn.'}
      </Typography.Text>
      <Form
        className="admin-entity-form"
        form={form}
        layout="vertical"
        initialValues={{
          category_id: dish?.category_id,
          dish_name: dish?.dish_name ?? '',
          description: dish?.description ?? '',
          price: dish?.price ?? null,
          image_url: dish?.image_url ?? '',
          is_available: dish?.is_available ?? true,
        }}
        onFinish={submit}
        requiredMark="optional"
      >
        {categoriesError && (
          <Alert
            className="admin-form-error"
            type="error"
            showIcon
            title="Không thể tải danh mục."
            description={categoriesError}
            action={<Button onClick={() => reloadCategories()}>Thử lại</Button>}
          />
        )}
        <Form.Item
          label="Danh mục"
          name="category_id"
          rules={[{ required: true, message: 'Chọn danh mục món ăn.' }]}
        >
          <Select
            loading={categoriesLoading}
            options={(categories ?? []).map((category) => ({
              value: category.category_id,
              label: category.category_name,
            }))}
            placeholder="Chọn danh mục"
          />
        </Form.Item>
        <Form.Item
          label="Tên món"
          name="dish_name"
          rules={[
            { required: true, whitespace: true, message: 'Vui lòng nhập tên món.' },
            { max: 100, message: 'Tên món không được vượt quá 100 ký tự.' },
          ]}
        >
          <Input autoFocus placeholder="Nhập tên món" maxLength={100} />
        </Form.Item>
        <Form.Item label="Mô tả (không bắt buộc)" name="description">
          <Input.TextArea maxLength={5000} rows={3} />
        </Form.Item>
        <Form.Item
          label="Giá (VNĐ)"
          name="price"
          rules={[
            { required: true, message: 'Vui lòng nhập giá món.' },
            { type: 'number', min: 1, message: 'Giá phải lớn hơn 0.' },
          ]}
        >
          <InputNumber className="admin-full-width" min={1} precision={0} placeholder="Nhập giá" />
        </Form.Item>
        <Form.Item label="Đường dẫn ảnh (không bắt buộc)" name="image_url">
          <Input maxLength={255} placeholder="https://... hoặc /uploads/..." />
        </Form.Item>
        {(imageUrl ?? dish?.image_url) && (
            <img
              className="admin-dish-preview"
              src={assetUrl(imageUrl ?? dish.image_url)}
              alt="Ảnh xem trước món ăn"
            />
        )}
        <Form.Item label="Đang bán" name="is_available" valuePropName="checked">
          <Switch />
        </Form.Item>
        {error && <Alert className="admin-form-error" type="error" showIcon title="Không thể lưu món." description={error} />}
        <div className="admin-form-actions">
          <Button onClick={onClose} disabled={saving}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            {saving ? 'Đang lưu...' : 'Lưu món'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
