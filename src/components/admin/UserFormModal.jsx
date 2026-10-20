import { useState } from 'react'
import { Alert, Button, Form, Input, Modal, Popconfirm, Select, Space, Switch } from 'antd'
import { createUser, deleteUser, getRoles, updateUser } from '../../services/adminService'
import { getErrorMessage } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useApi } from '../../hooks/useApi'

export default function UserFormModal({ user, onClose, onSaved }) {
  const { currentUser } = useAuth()
  const editing = Boolean(user)
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const rolesState = useApi(getRoles)
  const self = user && String(user.user_id) === String(currentUser?.user_id)
  const roleOptions = (rolesState.data ?? []).map((role) => ({
    value: role.role_id,
    label: role.role_name,
  }))
  if (user?.role_id && !roleOptions.some((role) => role.value === user.role_id)) {
    roleOptions.push({ value: user.role_id, label: user.role_name ?? 'Vai trò hiện tại' })
  }

  const submit = async (values) => {
    setError('')
    setSaving(true)
    try {
      if (editing) {
        const payload = {
          full_name: values.full_name.trim(),
          phone: values.phone?.trim() || null,
          is_active: values.is_active,
          role_id: values.role_id,
        }
        if (values.new_password) payload.new_password = values.new_password
        await updateUser(user.user_id, payload)
        onSaved(values.new_password
          ? `Đã cập nhật thông tin và đặt lại mật khẩu cho ${user.username}.`
          : `Đã cập nhật tài khoản ${user.username}.`)
      } else {
        const payload = {
          username: values.username.trim(),
          password: values.password,
          full_name: values.full_name.trim(),
          role_id: values.role_id,
        }
        if (values.phone?.trim()) payload.phone = values.phone.trim()
        await createUser(payload)
        onSaved(`Đã tạo tài khoản ${payload.username}.`)
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    setError('')
    setSaving(true)
    try {
      await deleteUser(user.user_id)
      onSaved(`Đã xóa tài khoản ${user.username}.`)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      title={editing ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản'}
      onCancel={onClose}
      footer={null}
      mask={{ closable: false }}
      destroyOnHidden
      width={600}
    >
      <Form
        className="admin-entity-form"
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          username: user?.username ?? '',
          full_name: user?.full_name ?? '',
          phone: user?.phone ?? '',
          role_id: user?.role_id ?? 'ROLE_02',
          is_active: user?.is_active ?? true,
        }}
        onFinish={submit}
      >
        {rolesState.error && (
          <Alert
            className="admin-form-error"
            type="error"
            showIcon
            title="Không thể tải danh sách vai trò."
            description={rolesState.error}
            action={<Button onClick={() => rolesState.reload()}>Thử lại</Button>}
          />
        )}
        {!editing && (
          <>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                { required: true, whitespace: true, message: 'Vui lòng nhập tên đăng nhập.' },
                { max: 50, message: 'Tên đăng nhập không được vượt quá 50 ký tự.' },
              ]}
            >
              <Input autoFocus autoComplete="username" maxLength={50} />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu.' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự.' },
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          </>
        )}
        {editing && <Form.Item label="Tên đăng nhập"><Input value={user.username} disabled /></Form.Item>}
        {editing && user.role_name === 'STAFF' && (
          <Form.Item
            label="Mật khẩu mới cho nhân viên (để trống nếu không đổi)"
            name="new_password"
            rules={[
              {
                validator: async (_, value) => {
                  if (!value) return
                  if (value.length < 6) throw new Error('Mật khẩu tối thiểu 6 ký tự.')
                  if (new TextEncoder().encode(value).length > 72) {
                    throw new Error('Mật khẩu không được vượt quá 72 byte.')
                  }
                },
              },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        )}
        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[
            { required: true, whitespace: true, message: 'Vui lòng nhập họ tên.' },
            { max: 100, message: 'Họ tên không được vượt quá 100 ký tự.' },
          ]}
        >
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item
          label="Số điện thoại (không bắt buộc)"
          name="phone"
          rules={[{ max: 20, message: 'Số điện thoại không được vượt quá 20 ký tự.' }]}
        >
          <Input type="tel" autoComplete="tel" maxLength={20} />
        </Form.Item>
        <Form.Item label="Vai trò" name="role_id" rules={[{ required: true, message: 'Chọn vai trò.' }]}>
          <Select loading={rolesState.loading} options={roleOptions} />
        </Form.Item>
        {editing && (
          <Form.Item label="Tài khoản đang hoạt động" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}
        {error && (
          <Alert
            className="admin-form-error"
            type="error"
            showIcon
            title={editing ? 'Không thể cập nhật tài khoản.' : 'Không thể tạo tài khoản.'}
            description={error}
          />
        )}
        <div className="admin-form-actions">
          {editing && (
            <Popconfirm
              title={`Xóa tài khoản "${user.username}"?`}
              description="Thao tác này không thể hoàn tác."
              okText="Xóa tài khoản"
              cancelText="Hủy"
              okButtonProps={{ danger: true, loading: saving, disabled: self }}
              onConfirm={remove}
            >
              <Button danger disabled={saving || self} title={self ? 'Không thể tự xóa tài khoản đang đăng nhập.' : undefined}>
                Xóa tài khoản
              </Button>
            </Popconfirm>
          )}
          <Space className="admin-form-submit-actions">
            <Button onClick={onClose} disabled={saving}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving} disabled={rolesState.loading || !roleOptions.length}>
              {saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  )
}
