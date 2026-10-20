import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Form, Input, InputNumber, Modal, Space, Switch, Typography } from 'antd'
import { UploadSimple } from '@phosphor-icons/react'
import { createDish, updateDish, uploadDishImage } from '../../services/dishService'
import { assetUrl, getErrorMessage } from '../../services/api'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function DishFormModal({ dish, onClose, onSaved }) {
  const editing = Boolean(dish)
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const imageInput = useRef(null)

  useEffect(() => () => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Chỉ chọn ảnh JPEG, PNG hoặc WebP.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Ảnh không được vượt quá 5 MB.')
      return
    }
    setError('')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const submit = async (values) => {
    setError('')
    setSaving(true)
    const payload = {
      dish_name: values.dish_name.trim(),
      price: values.price,
      is_available: values.is_available,
    }
    if (values.ai_label_id?.trim()) payload.ai_label_id = values.ai_label_id.trim()

    try {
      const savedDish = editing
        ? await updateDish(dish.dish_id, payload)
        : await createDish(payload)
      if (imageFile) {
        try {
          await uploadDishImage(savedDish.dish_id, imageFile)
        } catch (uploadError) {
          onSaved(`Đã lưu món nhưng tải ảnh thất bại: ${getErrorMessage(uploadError)}`, 'danger')
          return
        }
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
          dish_name: dish?.dish_name ?? '',
          price: dish?.price ?? null,
          ai_label_id: dish?.ai_label_id ?? '',
          is_available: dish?.is_available ?? true,
        }}
        onFinish={submit}
        requiredMark="optional"
      >
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
        <Form.Item label="Nhãn AI (không bắt buộc)" name="ai_label_id">
          <Input maxLength={50} placeholder="Ví dụ: pho_bo" />
        </Form.Item>
        <Form.Item label="Ảnh món (không bắt buộc)">
          <Space wrap>
            <input
              ref={imageInput}
              className="admin-visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={chooseImage}
            />
            <Button
              icon={<UploadSimple size={17} />}
              disabled={saving}
              onClick={() => imageInput.current?.click()}
            >
              Chọn ảnh
            </Button>
            <Typography.Text type="secondary">
              {imageFile?.name ?? (dish?.image_url ? 'Giữ ảnh hiện tại' : 'JPEG, PNG hoặc WebP; tối đa 5 MB')}
            </Typography.Text>
          </Space>
          {(imagePreview || dish?.image_url) && (
            <img
              className="admin-dish-preview"
              src={imagePreview || assetUrl(dish.image_url)}
              alt="Ảnh xem trước món ăn"
            />
          )}
        </Form.Item>
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
