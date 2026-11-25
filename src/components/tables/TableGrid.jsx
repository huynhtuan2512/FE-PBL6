import { Armchair } from '@phosphor-icons/react'
import { Empty, Tag, Typography } from 'antd'

const states = {
  EMPTY: { label: 'Trống', color: 'success' },
  OCCUPIED: { label: 'Đang dùng', color: 'processing' },
  RESERVED: { label: 'Đã đặt', color: 'warning' },
  CLEANING: { label: 'Đang dọn', color: 'default' },
}

export default function TableGrid({ tables, onSelectTable }) {
  if (!tables.length) return <Empty description="Chưa có bàn trong hệ thống." />

  return (
    <div className="staff-table-grid">
      {tables.map((table) => {
        const state = states[table.status] ?? { label: table.status, color: 'default' }
        const content = (
          <>
            <Armchair size={22} aria-hidden="true" />
            <Typography.Text strong>Bàn {String(table.table_number).padStart(2, '0')}</Typography.Text>
            <Tag color={state.color}>{state.label}</Tag>
            <Typography.Text type="secondary">{table.capacity ?? 4} chỗ</Typography.Text>
            {table.status === 'EMPTY' && (
              <Typography.Text type="secondary">Chọn để đặt món</Typography.Text>
            )}
          </>
        )

        return table.status === 'EMPTY'
          ? (
            <button
              className="staff-table-item staff-table-button"
              key={table.table_id}
              type="button"
              aria-label={`Đặt món cho bàn ${String(table.table_number).padStart(2, '0')}`}
              onClick={() => onSelectTable(table)}
            >
              {content}
            </button>
          )
          : (
            <article className="staff-table-item" key={table.table_id}>
              {content}
            </article>
          )
      })}
    </div>
  )
}
