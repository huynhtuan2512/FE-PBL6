import { Space, Typography } from 'antd'

export default function SectionHeader({ eyebrow, title, extra, className = '' }) {
  return (
    <div className={`ds-section-header ${className}`.trim()}>
      <div>
        {eyebrow && <Typography.Text className="ds-section-header-eyebrow">{eyebrow}</Typography.Text>}
        <Typography.Title className="ds-section-header-title" level={2}>{title}</Typography.Title>
      </div>
      {extra && <Space className="ds-section-header-extra" size="middle" wrap>{extra}</Space>}
    </div>
  )
}
