import { useState } from 'react'
import { Alert, Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd'
import { Pencil, Plus, Trash } from '@phosphor-icons/react'
import DataState from '../common/DataState'
import SectionHeader from '../common/SectionHeader'
import { useApi } from '../../hooks/useApi'
import { getErrorMessage } from '../../services/api'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../services/dishService'

export default function CategoryAdmin({ onNotify }) {
  const { data: categories, loading, error, reload } = useApi(getCategories)
  const [editing, setEditing] = useState(undefined)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  const submit = async (values) => {
    setSaving(true)
    setActionError('')
    const payload = {
      category_name: values.category_name.trim(),
      description: values.description?.trim() || null,
    }
    try {
      if (editing) await updateCategory(editing.category_id, payload)
      else await createCategory(payload)
      setEditing(undefined)
      onNotify(editing ? 'Đã cập nhật danh mục.' : 'Đã tạo danh mục.')
      await reload({ silent: true })
    } catch (requestError) {
      setActionError(getErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (category) => {
    setActionError('')
    try {
      await deleteCategory(category.category_id)
      onNotify(`Đã xóa danh mục "${category.category_name}".`)
      await reload({ silent: true })
    } catch (requestError) {
      setActionError(getErrorMessage(requestError))
    }
  }

  const columns = [
    { title: 'Tên danh mục', dataIndex: 'category_name', key: 'category_name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', render: (value) => value || '—' },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right',
      render: (_, category) => (
        <Space>
          <Button icon={<Pencil size={16} />} onClick={() => setEditing(category)}>Sửa</Button>
          <Popconfirm
            title={`Xóa danh mục "${category.category_name}"?`}
            description="Chỉ danh mục chưa có món ăn mới xóa được."
            okText="Xóa danh mục"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => remove(category)}
          >
            <Button danger icon={<Trash size={16} />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <section className="admin-section">
      <SectionHeader
        title="Danh mục thực đơn"
        className="admin-section-header"
        extra={<Button type="primary" icon={<Plus size={17} />} onClick={() => setEditing(null)}>Thêm danh mục</Button>}
      />
      {actionError && (
        <Alert
          className="admin-action-error"
          type="error"
          showIcon
          title="Không thể cập nhật danh mục."
          description={actionError}
          closable
          onClose={() => setActionError('')}
        />
      )}
      {loading && categories === null && <DataState status="loading" message="Đang tải danh mục..." />}
      {error && categories === null && <DataState status="error" error={error} onRetry={() => reload()} />}
      {categories && (
        <Table
          className="admin-data-table"
          rowKey="category_id"
          columns={columns}
          dataSource={categories}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 640 }}
          locale={{ emptyText: 'Chưa có danh mục thực đơn.' }}
        />
      )}
      {editing !== undefined && (
        <Modal
          open
          title={editing ? 'Sửa danh mục' : 'Thêm danh mục'}
          onCancel={() => setEditing(undefined)}
          footer={null}
          mask={{ closable: false }}
          destroyOnHidden
        >
          <Form
            className="admin-entity-form"
            layout="vertical"
            initialValues={{
              category_name: editing?.category_name ?? '',
              description: editing?.description ?? '',
            }}
            onFinish={submit}
          >
            <Form.Item
              label="Tên danh mục"
              name="category_name"
              rules={[{ required: true, whitespace: true, max: 100, message: 'Nhập tên danh mục (tối đa 100 ký tự).' }]}
            >
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <Input maxLength={255} />
            </Form.Item>
            <div className="admin-form-actions">
              <Button onClick={() => setEditing(undefined)} disabled={saving}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={saving}>Lưu danh mục</Button>
            </div>
          </Form>
        </Modal>
      )}
    </section>
  )
}
